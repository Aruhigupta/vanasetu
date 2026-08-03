from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app_backend.core.database import get_db
from app_backend.models.models import Herb
from app_backend.schemas.schemas import HerbCreate, HerbResponse

router = APIRouter(prefix="/herbs", tags=["Herbs Catalog"])

@router.get("", response_model=List[HerbResponse])
def get_all_herbs(db: Session = Depends(get_db)):
    return db.query(Herb).all()

@router.post("", response_model=HerbResponse)
def create_herb(herb_in: HerbCreate, db: Session = Depends(get_db)):
    existing = db.query(Herb).filter(Herb.botanical_name == herb_in.botanical_name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Herb botanical name already exists")
    
    new_herb = Herb(**herb_in.dict())
    db.add(new_herb)
    db.commit()
    db.refresh(new_herb)
    return new_herb

@router.get("/{herb_id}", response_model=HerbResponse)
def get_herb_by_id(herb_id: int, db: Session = Depends(get_db)):
    herb = db.query(Herb).filter(Herb.id == herb_id).first()
    if not herb:
        raise HTTPException(status_code=404, detail="Herb not found")
    return herb
