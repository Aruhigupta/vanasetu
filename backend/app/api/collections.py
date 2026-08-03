import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.models import HerbCollection, Herb, Farmer, BlockchainTransaction
from app.schemas.schemas import CollectionCreate, CollectionResponse
from app.services.ai_service import HerbAIService
from app.services.blockchain_service import BlockchainService

router = APIRouter(prefix="/collections", tags=["Farmer & Collector Harvests"])

@router.get("", response_model=List[CollectionResponse])
def get_collections(db: Session = Depends(get_db)):
    return db.query(HerbCollection).order_by(HerbCollection.id.desc()).all()

@router.post("", response_model=CollectionResponse)
def create_collection(col_in: CollectionCreate, farmer_id: int = 1, db: Session = Depends(get_db)):
    herb = db.query(Herb).filter(Herb.id == col_in.herb_id).first()
    if not herb:
        raise HTTPException(status_code=404, detail="Herb specified does not exist")

    # Generate unique Batch ID (e.g. HCB-2025-8942)
    batch_id = f"HCB-2025-{uuid.uuid4().hex[:6].upper()}"

    # AI authenticity scan on uploaded photo hash
    ai_result = HerbAIService.detect_fake_herb_image(
        image_hash=col_in.image_ipfs_hash or "QmDefaultHash",
        claimed_herb=herb.common_name
    )

    new_collection = HerbCollection(
        batch_id=batch_id,
        herb_id=col_in.herb_id,
        farmer_id=farmer_id,
        quantity_kg=col_in.quantity_kg,
        gps_coordinates=col_in.gps_coordinates,
        location_address=col_in.location_address,
        moisture_pct=col_in.moisture_pct,
        image_ipfs_hash=col_in.image_ipfs_hash,
        ai_authenticity_score=ai_result["authenticity_score"],
        status="COLLECTED"
    )
    db.add(new_collection)
    db.commit()
    db.refresh(new_collection)

    # Record Polygon Blockchain transaction
    tx_meta = BlockchainService.generate_tx_hash(batch_id, "registerHerb")
    bc_tx = BlockchainTransaction(
        batch_id=batch_id,
        tx_hash=tx_meta["tx_hash"],
        block_number=tx_meta["block_number"],
        function_name="registerHerb",
        sender_address="0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
        status="CONFIRMED"
    )
    db.add(bc_tx)
    db.commit()

    return new_collection

@router.get("/{batch_id}")
def get_collection_by_batch(batch_id: str, db: Session = Depends(get_db)):
    col = db.query(HerbCollection).filter(HerbCollection.batch_id == batch_id).first()
    if not col:
        raise HTTPException(status_code=404, detail="Collection batch not found")
    return col
