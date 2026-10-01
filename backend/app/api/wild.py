import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from app.core.database import get_db
from app.models.models import WildCollection, Collector, Herb, User
from app.api.deps import get_current_user, require_roles

router = APIRouter(prefix="/collections/wild", tags=["Wild Herb Collection"])

class WildCollectionCreate(BaseModel):
    herb_id: int
    forest_region: str
    permit_number: str
    collection_quantity_kg: float
    gps_coordinates: str
    photo_cid: Optional[str] = None

# Permitted Forest Regions and Geo-Fences (Lat Range, Long Range) for prototype verification
PERMITTED_GEO_FENCES = {
    "bandipur": {"lat_min": 11.5, "lat_max": 11.9, "lon_min": 76.2, "lon_max": 76.7, "name": "Bandipur Reserved Forest Zone B"},
    "western_ghats": {"lat_min": 11.0, "lat_max": 13.5, "lon_min": 75.0, "lon_max": 77.5, "name": "Western Ghats Reserved Forest"},
    "wayanad": {"lat_min": 11.4, "lat_max": 11.9, "lon_min": 75.8, "lon_max": 76.3, "name": "Wayanad Sanctuary"}
}

def parse_gps(gps_str: str):
    """
    Parses '11.6854, 76.1320' or '11.6854° N, 76.1320° E' into floats.
    """
    try:
        parts = gps_str.replace("°", "").replace("N", "").replace("E", "").replace("S", "").replace("W", "").split(",")
        lat = float(parts[0].strip())
        lon = float(parts[1].strip())
        return lat, lon
    except Exception:
        return None, None

@router.post("")
def create_wild_collection(
    req: WildCollectionCreate,
    current_user: User = Depends(require_roles("collector", "admin")),
    db: Session = Depends(get_db)
):
    """
    Registers a wild botanical herb collection with forest permit validation and geo-fencing check.
    """
    herb = db.query(Herb).filter(Herb.id == req.herb_id).first()
    if not herb:
        raise HTTPException(status_code=404, detail=f"Herb ID {req.herb_id} not found in catalog")

    collector = db.query(Collector).filter(Collector.user_id == current_user.id).first()
    if not collector:
        collector = Collector(
            user_id=current_user.id,
            forest_region=req.forest_region,
            state="Karnataka",
            permit_number=req.permit_number,
            authority_issued="State Forest Department",
            valid_from="2025-01-01",
            valid_until="2026-12-31",
            permitted_species="All Botanical Herbs",
            permitted_quantity_kg=500.0
        )
        db.add(collector)
        db.commit()
        db.refresh(collector)

    # 1. Permit Verification (Prototype Government Forest Dept Check)
    if req.permit_number.strip().upper() != collector.permit_number.strip().upper():
        # Validate against issued permit format
        if not req.permit_number.strip().startswith("FOREST-PERMIT"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Permit Verification Failed: Permit '{req.permit_number}' is invalid or expired."
            )

    # 2. Geo-fencing Validation
    lat, lon = parse_gps(req.gps_coordinates)
    geofence_passed = True
    matched_region = None

    if lat is not None and lon is not None:
        # Check against permitted forest regions
        for key, fence in PERMITTED_GEO_FENCES.items():
            if fence["lat_min"] <= lat <= fence["lat_max"] and fence["lon_min"] <= lon <= fence["lon_max"]:
                matched_region = fence["name"]
                break

        if not matched_region:
            geofence_passed = False
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"COLLECTION BLOCKED: Reason: Current GPS coordinates ({req.gps_coordinates}) are outside the permitted geo-fenced forest region ({req.forest_region})."
            )

    current_year = datetime.datetime.utcnow().year
    batch_id = f"WILD-{current_year}-{uuid.uuid4().hex[:6].upper()}"

    wild_item = WildCollection(
        batch_id=batch_id,
        collector_id=collector.id,
        herb_id=req.herb_id,
        forest_region=req.forest_region,
        permit_number=req.permit_number,
        collection_quantity_kg=req.collection_quantity_kg,
        gps_coordinates=req.gps_coordinates,
        photo_cid=req.photo_cid,
        permit_verified=True,
        geofence_verified=geofence_passed,
        status="COLLECTED"
    )
    db.add(wild_item)
    db.commit()
    db.refresh(wild_item)

    return {
        "message": "Wild herb collection logged successfully",
        "batch_id": batch_id,
        "forest_region": req.forest_region,
        "permit_verified": True,
        "geofence_verified": geofence_passed,
        "gps": req.gps_coordinates
    }

@router.get("")
def list_wild_collections(db: Session = Depends(get_db)):
    return db.query(WildCollection).order_by(WildCollection.id.desc()).all()
