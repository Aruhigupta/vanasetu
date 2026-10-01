import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.core.database import get_db
from app.models.models import HerbCollection, ManufacturedProduct, BlockchainTransaction, User, Manufacturer
from app.services.blockchain_service import BlockchainService
from app.services.qr_service import QRService
from app.api.deps import get_current_user, require_roles
from app.core.config import settings

router = APIRouter(prefix="/manufacturers", tags=["Ayurvedic Medicine Manufacturing"])

class ManufactureBatchRequest(BaseModel):
    batch_id: str  # Raw herb collection batch ID
    facility_name: str
    medicine_name: str
    ayush_lic_no: str
    final_product_ipfs_hash: Optional[str] = None

@router.post("/batch")
def process_manufacture(
    req: ManufactureBatchRequest,
    current_user: User = Depends(require_roles("manufacturer", "admin")),
    db: Session = Depends(get_db)
):
    """
    Processes raw botanical herb batch into final Ayurvedic medicine product batch (AYU-2026-XXXXX).
    Enforces strict checks: raw batch must exist, must have passed lab tests, must not be already manufactured.
    """
    col = db.query(HerbCollection).filter(HerbCollection.batch_id == req.batch_id).first()
    if not col:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Raw Herb Batch '{req.batch_id}' was not found in the database."
        )

    # 1. Check Lab Status
    if not col.lab_report:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Manufacturing Blocked: Batch '{req.batch_id}' has not undergone laboratory testing."
        )
    if col.lab_report.overall_status != "PASSED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Manufacturing Blocked: Batch '{req.batch_id}' failed quality testing (Status: {col.lab_report.overall_status})."
        )

    # 2. Check duplicate manufacturing
    if col.manufactured_product or col.status == "MANUFACTURED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Manufacturing Blocked: Batch '{req.batch_id}' has already been processed into final medicine batch."
        )

    current_year = datetime.datetime.utcnow().year
    final_batch_id = f"AYU-{current_year}-{uuid.uuid4().hex[:6].upper()}"

    verification_url = f"{settings.NEXT_PUBLIC_APP_URL.rstrip('/')}/verify/{final_batch_id}"

    mfg_product = ManufacturedProduct(
        final_batch_id=final_batch_id,
        raw_batch_id=req.batch_id,
        collection_id=col.id,
        manufacturer_id=current_user.id,
        facility_name=req.facility_name,
        medicine_name=req.medicine_name,
        ayush_lic_no=req.ayush_lic_no,
        final_product_ipfs_hash=req.final_product_ipfs_hash,
        qr_code_url=verification_url
    )
    db.add(mfg_product)

    # Update raw collection status
    col.status = "MANUFACTURED"

    tx_hash = None
    try:
        tx_result = BlockchainService.execute_contract_transaction(
            "updateManufacturing",
            [
                req.batch_id,
                req.facility_name,
                req.medicine_name,
                req.final_product_ipfs_hash or ""
            ]
        )
        tx_hash = tx_result["tx_hash"]
        bc_tx = BlockchainTransaction(
            batch_id=final_batch_id,
            tx_hash=tx_result["tx_hash"],
            block_number=tx_result["block_number"],
            function_name="updateManufacturing",
            sender_address=tx_result["sender_address"],
            status=tx_result["status"],
            contract_address=tx_result.get("contract_address")
        )
        db.add(bc_tx)
    except HTTPException:
        pass

    db.commit()

    return {
        "message": f"Final Ayurvedic Medicine Batch '{req.medicine_name}' generated successfully!",
        "final_batch_id": final_batch_id,
        "raw_batch_id": req.batch_id,
        "medicine_name": req.medicine_name,
        "verification_url": verification_url,
        "tx_hash": tx_hash
    }

@router.get("/batch/{final_batch_id}")
def get_manufactured_product(final_batch_id: str, db: Session = Depends(get_db)):
    mfg = db.query(ManufacturedProduct).filter(ManufacturedProduct.final_batch_id == final_batch_id).first()
    if not mfg:
        raise HTTPException(status_code=404, detail=f"Manufactured product batch '{final_batch_id}' not found")
    return mfg
