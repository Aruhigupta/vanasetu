from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app_backend.core.database import get_db
from app_backend.models.models import HerbCollection, BlockchainTransaction
from app_backend.services.blockchain_service import BlockchainService

router = APIRouter(prefix="/manufacturers", tags=["Ayurvedic Medicine Manufacturing"])

class ManufactureBatchRequest(BaseModel):
    batch_id: str
    facility_name: str
    medicine_name: str
    ayush_lic_no: str
    final_product_ipfs_hash: str = "QmFinalMedicinePkgHash2025"

@router.post("/batch")
def process_manufacture(req: ManufactureBatchRequest, db: Session = Depends(get_db)):
    col = db.query(HerbCollection).filter(HerbCollection.batch_id == req.batch_id).first()
    if not col:
        raise HTTPException(status_code=404, detail="Batch ID not found")

    col.status = "MANUFACTURED"

    tx_meta = BlockchainService.generate_tx_hash(req.batch_id, "updateManufacturing")
    bc_tx = BlockchainTransaction(
        batch_id=req.batch_id,
        tx_hash=tx_meta["tx_hash"],
        block_number=tx_meta["block_number"],
        function_name="updateManufacturing",
        sender_address="0x58303A293720775Ef925354921C5e85304ec51e6",
        status="CONFIRMED"
    )
    db.add(bc_tx)
    db.commit()

    return {
        "message": f"Final Ayurvedic Medicine Batch ({req.medicine_name}) generated successfully!",
        "batch_id": req.batch_id,
        "tx_hash": tx_meta["tx_hash"]
    }
