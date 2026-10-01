from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.core.database import get_db
from app.models.models import LabReport, HerbCollection, BlockchainTransaction, User
from app.services.blockchain_service import BlockchainService
from app.api.deps import get_current_user, require_roles

router = APIRouter(prefix="/lab", tags=["Quality Testing & Lab Reports"])

class LabReportCreateRequest(BaseModel):
    batch_id: str
    lab_name: str
    tester_name: str
    chemical_assay: str
    heavy_metals_pass: bool = True
    pesticides_pass: bool = True
    microbial_pass: bool = True
    potency_percentage: float
    cert_ipfs_hash: Optional[str] = None
    hplc_report_cid: Optional[str] = None
    heavy_metal_report_cid: Optional[str] = None
    pesticide_report_cid: Optional[str] = None
    microbial_report_cid: Optional[str] = None

@router.post("")
def add_lab_report(
    report_in: LabReportCreateRequest,
    current_user: User = Depends(require_roles("lab", "admin")),
    db: Session = Depends(get_db)
):
    """
    Submits certified lab report for an existing harvest batch.
    Identity is extracted from JWT (current_user).
    Status becomes TESTED_PASSED or TESTED_FAILED.
    """
    col = db.query(HerbCollection).filter(HerbCollection.batch_id == report_in.batch_id).first()
    if not col:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Batch ID '{report_in.batch_id}' was not found in the HerbChain database."
        )

    # Prevent duplicate final certification if report already submitted and passed
    if col.lab_report and col.lab_report.overall_status == "PASSED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Batch '{report_in.batch_id}' has already passed laboratory certification."
        )

    overall = "PASSED" if (report_in.heavy_metals_pass and report_in.pesticides_pass and report_in.microbial_pass) else "FAILED"

    report = LabReport(
        collection_id=col.id,
        lab_id=current_user.id,
        lab_name=report_in.lab_name,
        tester_name=report_in.tester_name,
        chemical_assay=report_in.chemical_assay,
        heavy_metals_pass=report_in.heavy_metals_pass,
        pesticides_pass=report_in.pesticides_pass,
        microbial_pass=report_in.microbial_pass,
        potency_percentage=report_in.potency_percentage,
        cert_ipfs_hash=report_in.cert_ipfs_hash or report_in.hplc_report_cid or "",
        hplc_report_cid=report_in.hplc_report_cid,
        heavy_metal_report_cid=report_in.heavy_metal_report_cid,
        pesticide_report_cid=report_in.pesticide_report_cid,
        microbial_report_cid=report_in.microbial_report_cid,
        overall_status=overall
    )
    db.add(report)
    
    # Update collection lifecycle status
    col.status = "TESTED_PASSED" if overall == "PASSED" else "TESTED_FAILED"

    tx_hash = None
    # Attempt real Polygon transaction execution
    try:
        tx_result = BlockchainService.execute_contract_transaction(
            "addLabReport",
            [
                report_in.batch_id,
                report_in.cert_ipfs_hash or report_in.hplc_report_cid or "",
                report_in.chemical_assay,
                report_in.heavy_metals_pass,
                report_in.pesticides_pass,
                int(report_in.potency_percentage * 10),
                overall == "PASSED"
            ]
        )
        tx_hash = tx_result["tx_hash"]
        bc_tx = BlockchainTransaction(
            batch_id=report_in.batch_id,
            tx_hash=tx_result["tx_hash"],
            block_number=tx_result["block_number"],
            function_name="addLabReport",
            sender_address=tx_result["sender_address"],
            status=tx_result["status"],
            contract_address=tx_result.get("contract_address")
        )
        db.add(bc_tx)
    except HTTPException:
        pass

    db.commit()

    return {
        "message": f"Lab report recorded successfully with overall status: {overall}",
        "batch_id": report_in.batch_id,
        "overall_status": overall,
        "tx_hash": tx_hash
    }

@router.get("/{batch_id}")
def get_lab_report(batch_id: str, db: Session = Depends(get_db)):
    col = db.query(HerbCollection).filter(HerbCollection.batch_id == batch_id).first()
    if not col or not col.lab_report:
        raise HTTPException(status_code=404, detail=f"Lab report for batch '{batch_id}' not found")
    return col.lab_report
