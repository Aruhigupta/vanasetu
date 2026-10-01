import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.models import HerbCollection, Herb, Farmer, BlockchainTransaction, User
from app.schemas.schemas import CollectionCreate, CollectionResponse
from app.services.ai_service import HerbAIService
from app.services.blockchain_service import BlockchainService
from app.api.deps import get_current_user, require_roles

router = APIRouter(prefix="/collections", tags=["Farmer Harvest Collections"])

@router.get("", response_model=List[CollectionResponse])
def get_collections(db: Session = Depends(get_db)):
    return db.query(HerbCollection).order_by(HerbCollection.id.desc()).all()

@router.post("", response_model=CollectionResponse)
def create_collection(
    col_in: CollectionCreate,
    current_user: User = Depends(require_roles("farmer", "admin")),
    db: Session = Depends(get_db)
):
    """
    Farmer registers new botanical herb harvest batch.
    Identity is extracted from JWT (current_user).
    """
    herb = db.query(Herb).filter(Herb.id == col_in.herb_id).first()
    if not herb:
        raise HTTPException(status_code=404, detail=f"Herb ID {col_in.herb_id} does not exist in catalog")

    # Get farmer profile for current user
    farmer = db.query(Farmer).filter(Farmer.user_id == current_user.id).first()
    if not farmer:
        # Create farmer profile if not existing
        farmer = Farmer(
            user_id=current_user.id,
            farm_name=f"{current_user.full_name}'s Organic Farm",
            farm_location=col_in.location_address or "Wayanad, Kerala",
            state="Kerala",
            gps_coordinates=col_in.gps_coordinates,
            land_area_acres=3.5,
            ayush_reg_id=f"AYUSH-FARM-{current_user.id:04d}"
        )
        db.add(farmer)
        db.commit()
        db.refresh(farmer)

    current_year = datetime.datetime.utcnow().year
    batch_id = f"HCB-{current_year}-{uuid.uuid4().hex[:6].upper()}"

    # AI inspection on image CID or URL
    ai_result = HerbAIService.detect_fake_herb_image(
        image_hash=col_in.image_ipfs_hash or "",
        claimed_herb=herb.common_name
    )

    new_collection = HerbCollection(
        batch_id=batch_id,
        herb_id=col_in.herb_id,
        farmer_id=farmer.id,
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

    # Attempt real Polygon transaction if configured
    try:
        tx_result = BlockchainService.execute_contract_transaction(
            "registerHerb",
            [
                batch_id,
                herb.common_name,
                herb.botanical_name,
                farmer.farm_location,
                col_in.gps_coordinates,
                int(col_in.quantity_kg),
                col_in.image_ipfs_hash or "",
                int(col_in.moisture_pct * 10)
            ]
        )
        bc_tx = BlockchainTransaction(
            batch_id=batch_id,
            tx_hash=tx_result["tx_hash"],
            block_number=tx_result["block_number"],
            function_name="registerHerb",
            sender_address=tx_result["sender_address"],
            status=tx_result["status"],
            contract_address=tx_result.get("contract_address")
        )
        db.add(bc_tx)
        db.commit()
    except HTTPException:
        # If blockchain connection/key is not configured, do not create fake tx record
        pass

    return new_collection

@router.get("/{batch_id}")
def get_collection_by_batch(batch_id: str, db: Session = Depends(get_db)):
    col = db.query(HerbCollection).filter(HerbCollection.batch_id == batch_id).first()
    if not col:
        raise HTTPException(status_code=404, detail=f"Collection batch '{batch_id}' not found")
    return col
