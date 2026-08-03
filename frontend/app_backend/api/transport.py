from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app_backend.core.database import get_db
from app_backend.models.models import TransportLog, HerbCollection, BlockchainTransaction
from app_backend.schemas.schemas import TransportCreate
from app_backend.services.blockchain_service import BlockchainService

router = APIRouter(prefix="/transport", tags=["Logistics & Cold-Chain Transport"])

@router.post("")
def update_transport(trans_in: TransportCreate, db: Session = Depends(get_db)):
    col = db.query(HerbCollection).filter(HerbCollection.batch_id == trans_in.batch_id).first()
    if not col:
        raise HTTPException(status_code=404, detail="Batch ID not found")

    log = TransportLog(
        collection_id=col.id,
        carrier_agency=trans_in.carrier_agency,
        driver_name=trans_in.driver_name,
        vehicle_no=trans_in.vehicle_no,
        current_gps=trans_in.current_gps,
        temperature_celsius=trans_in.temperature_celsius,
        humidity_percentage=trans_in.humidity_percentage,
        status_notes=trans_in.status_notes
    )
    db.add(log)
    col.status = "IN_TRANSIT"

    tx_meta = BlockchainService.generate_tx_hash(trans_in.batch_id, "updateTransportStatus")
    bc_tx = BlockchainTransaction(
        batch_id=trans_in.batch_id,
        tx_hash=tx_meta["tx_hash"],
        block_number=tx_meta["block_number"],
        function_name="updateTransportStatus",
        sender_address="0xDD870FA1b7C4700F2BD7f44238821C26f7392148",
        status="CONFIRMED"
    )
    db.add(bc_tx)
    db.commit()

    return {"message": "Transport checkpoint updated on blockchain", "tx_hash": tx_meta["tx_hash"]}

@router.get("/{batch_id}")
def get_transport_logs(batch_id: str, db: Session = Depends(get_db)):
    col = db.query(HerbCollection).filter(HerbCollection.batch_id == batch_id).first()
    if not col:
        raise HTTPException(status_code=404, detail="Batch ID not found")
    return db.query(TransportLog).filter(TransportLog.collection_id == col.id).order_by(TransportLog.timestamp.asc()).all()
