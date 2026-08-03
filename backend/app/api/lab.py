from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import LabReport, HerbCollection, BlockchainTransaction
from app.schemas.schemas import LabReportCreate
from app.services.blockchain_service import BlockchainService

router = APIRouter(prefix="/lab", tags=["Quality Testing & Lab Reports"])

@router.post("")
def add_lab_report(report_in: LabReportCreate, db: Session = Depends(get_db)):
    col = db.query(HerbCollection).filter(HerbCollection.batch_id == report_in.batch_id).first()
    if not col:
        raise HTTPException(status_code=404, detail="Batch ID not found")

    overall = "PASSED" if (report_in.heavy_metals_pass and report_in.pesticides_pass and report_in.microbial_pass) else "FAILED"

    report = LabReport(
        collection_id=col.id,
        lab_name=report_in.lab_name,
        tester_name=report_in.tester_name,
        chemical_assay=report_in.chemical_assay,
        heavy_metals_pass=report_in.heavy_metals_pass,
        pesticides_pass=report_in.pesticides_pass,
        microbial_pass=report_in.microbial_pass,
        potency_percentage=report_in.potency_percentage,
        cert_ipfs_hash=report_in.cert_ipfs_hash or "QmLabCertHashMock2025",
        overall_status=overall
    )
    db.add(report)
    
    # Update collection status
    col.status = "TESTED_PASSED" if overall == "PASSED" else "TESTED_FAILED"

    # Record Blockchain transaction
    tx_meta = BlockchainService.generate_tx_hash(report_in.batch_id, "addLabReport")
    bc_tx = BlockchainTransaction(
        batch_id=report_in.batch_id,
        tx_hash=tx_meta["tx_hash"],
        block_number=tx_meta["block_number"],
        function_name="addLabReport",
        sender_address="0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB",
        status="CONFIRMED"
    )
    db.add(bc_tx)
    db.commit()

    return {"message": "Lab report uploaded and logged on Polygon Blockchain", "status": overall, "tx_hash": tx_meta["tx_hash"]}

@router.get("/{batch_id}")
def get_lab_report(batch_id: str, db: Session = Depends(get_db)):
    col = db.query(HerbCollection).filter(HerbCollection.batch_id == batch_id).first()
    if not col or not col.lab_report:
        raise HTTPException(status_code=404, detail="Lab report for batch not found")
    return col.lab_report
