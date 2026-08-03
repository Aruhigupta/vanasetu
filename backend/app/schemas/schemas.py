from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Auth & User Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str
    wallet_address: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

# Herb Schemas
class HerbCreate(BaseModel):
    common_name: str
    botanical_name: str
    ayush_category: str
    active_compounds: str
    description: Optional[str] = None
    standard_moisture_max: float = 10.0
    standard_purity_min: float = 95.0

class HerbResponse(HerbCreate):
    id: int
    class Config:
        from_attributes = True

# Collection Schemas
class CollectionCreate(BaseModel):
    herb_id: int
    quantity_kg: float
    gps_coordinates: str
    location_address: str
    moisture_pct: float
    image_ipfs_hash: Optional[str] = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"

class CollectionResponse(BaseModel):
    id: int
    batch_id: str
    herb_id: int
    farmer_id: int
    harvest_date: datetime
    quantity_kg: float
    gps_coordinates: str
    location_address: str
    moisture_pct: float
    image_ipfs_hash: Optional[str]
    ai_authenticity_score: float
    status: str
    class Config:
        from_attributes = True

# Lab Report Schemas
class LabReportCreate(BaseModel):
    batch_id: str
    lab_name: str
    tester_name: str
    chemical_assay: str
    heavy_metals_pass: bool = True
    pesticides_pass: bool = True
    microbial_pass: bool = True
    potency_percentage: float
    cert_ipfs_hash: Optional[str] = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG"

class TransportCreate(BaseModel):
    batch_id: str
    carrier_agency: str
    driver_name: str
    vehicle_no: str
    current_gps: str
    temperature_celsius: float
    humidity_percentage: float
    status_notes: Optional[str] = "In Transit - Cold Chain Maintained"

# AI Service Schemas
class AIHerbImageCheck(BaseModel):
    image_url_or_hash: str
    claimed_herb_name: str

class AIQualityPredictionInput(BaseModel):
    herb_name: str
    region: str
    season: str
    moisture_pct: float
    drying_method: str
