import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False) # admin, farmer, collector, transport, lab, manufacturer, consumer
    wallet_address = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    farmer_profile = relationship("Farmer", back_populates="user", uselist=False)
    collector_profile = relationship("Collector", back_populates="user", uselist=False)
    manufacturer_profile = relationship("Manufacturer", back_populates="user", uselist=False)

class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    farm_name = Column(String(255), nullable=False)
    farm_location = Column(String(255), nullable=False)
    state = Column(String(100), nullable=False)
    gps_coordinates = Column(String(100), nullable=False)
    land_area_acres = Column(Float, nullable=False)
    ayush_reg_id = Column(String(100), unique=True, nullable=False)
    soil_type = Column(String(100), nullable=True)
    verified = Column(Boolean, default=True)

    user = relationship("User", back_populates="farmer_profile")
    collections = relationship("HerbCollection", back_populates="farmer")

class Collector(Base):
    __tablename__ = "collectors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    forest_region = Column(String(255), nullable=False)
    state = Column(String(100), nullable=False)
    permit_number = Column(String(100), nullable=False)
    authority_issued = Column(String(255), nullable=False)
    valid_from = Column(String(50), nullable=True, default="2025-01-01")
    valid_until = Column(String(50), nullable=False)
    permitted_species = Column(String(255), nullable=True, default="All Botanical Herbs")
    permitted_quantity_kg = Column(Float, nullable=True, default=500.0)

    user = relationship("User", back_populates="collector_profile")
    wild_collections = relationship("WildCollection", back_populates="collector")

class Herb(Base):
    __tablename__ = "herbs"

    id = Column(Integer, primary_key=True, index=True)
    common_name = Column(String(255), nullable=False)
    botanical_name = Column(String(255), unique=True, nullable=False)
    ayush_category = Column(String(100), nullable=False) # Rasayana, Balya, Deepana, etc.
    active_compounds = Column(String(255), nullable=False) # e.g. Withanolides, Curcumin
    description = Column(Text, nullable=True)
    standard_moisture_max = Column(Float, default=10.0)
    standard_purity_min = Column(Float, default=95.0)

class HerbCollection(Base):
    __tablename__ = "herb_collections"

    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(String(100), unique=True, index=True, nullable=False)
    herb_id = Column(Integer, ForeignKey("herbs.id"))
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=True)
    harvest_date = Column(DateTime, default=datetime.datetime.utcnow)
    quantity_kg = Column(Float, nullable=False)
    gps_coordinates = Column(String(100), nullable=False)
    location_address = Column(String(255), nullable=False)
    moisture_pct = Column(Float, nullable=False)
    image_ipfs_hash = Column(String(255), nullable=True)
    ai_authenticity_score = Column(Float, default=98.5)
    status = Column(String(50), default="COLLECTED") # REGISTERED, COLLECTED, LAB_PENDING, TESTED_PASSED, TESTED_FAILED, IN_TRANSIT, MANUFACTURED

    herb = relationship("Herb")
    farmer = relationship("Farmer", back_populates="collections")
    lab_report = relationship("LabReport", back_populates="collection", uselist=False)
    transport_logs = relationship("TransportLog", back_populates="collection")
    transport_alerts = relationship("TransportAlert", back_populates="collection")
    manufactured_product = relationship("ManufacturedProduct", back_populates="collection", uselist=False)

class WildCollection(Base):
    __tablename__ = "wild_collections"

    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(String(100), unique=True, index=True, nullable=False)
    collector_id = Column(Integer, ForeignKey("collectors.id"))
    herb_id = Column(Integer, ForeignKey("herbs.id"))
    forest_region = Column(String(255), nullable=False)
    permit_number = Column(String(100), nullable=False)
    collection_quantity_kg = Column(Float, nullable=False)
    gps_coordinates = Column(String(100), nullable=False)
    collection_date = Column(DateTime, default=datetime.datetime.utcnow)
    photo_cid = Column(String(255), nullable=True)
    permit_verified = Column(Boolean, default=True)
    geofence_verified = Column(Boolean, default=True)
    status = Column(String(50), default="COLLECTED")

    collector = relationship("Collector", back_populates="wild_collections")
    herb = relationship("Herb")

class ProcessingUnit(Base):
    __tablename__ = "processing_units"

    id = Column(Integer, primary_key=True, index=True)
    unit_name = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    gmp_certified = Column(Boolean, default=True)
    contact_person = Column(String(255), nullable=True)

class Manufacturer(Base):
    __tablename__ = "manufacturers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    company_name = Column(String(255), nullable=False)
    license_no = Column(String(100), nullable=False)
    facility_address = Column(String(255), nullable=False)
    ayush_approval_no = Column(String(100), nullable=False)

    user = relationship("User", back_populates="manufacturer_profile")

class LabReport(Base):
    __tablename__ = "lab_reports"

    id = Column(Integer, primary_key=True, index=True)
    collection_id = Column(Integer, ForeignKey("herb_collections.id"))
    lab_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    lab_name = Column(String(255), nullable=False)
    tester_name = Column(String(255), nullable=False)
    chemical_assay = Column(Text, nullable=False)
    heavy_metals_pass = Column(Boolean, default=True)
    pesticides_pass = Column(Boolean, default=True)
    microbial_pass = Column(Boolean, default=True)
    potency_percentage = Column(Float, nullable=False)
    cert_ipfs_hash = Column(String(255), nullable=False)
    hplc_report_cid = Column(String(255), nullable=True)
    heavy_metal_report_cid = Column(String(255), nullable=True)
    pesticide_report_cid = Column(String(255), nullable=True)
    microbial_report_cid = Column(String(255), nullable=True)
    overall_status = Column(String(50), default="PASSED")
    test_date = Column(DateTime, default=datetime.datetime.utcnow)

    collection = relationship("HerbCollection", back_populates="lab_report")

class TransportLog(Base):
    __tablename__ = "transport_logs"

    id = Column(Integer, primary_key=True, index=True)
    collection_id = Column(Integer, ForeignKey("herb_collections.id"))
    transporter_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    carrier_agency = Column(String(255), nullable=False)
    driver_name = Column(String(255), nullable=False)
    vehicle_no = Column(String(100), nullable=False)
    current_gps = Column(String(100), nullable=False)
    temperature_celsius = Column(Float, default=22.5)
    humidity_percentage = Column(Float, default=45.0)
    status_notes = Column(String(255), nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    collection = relationship("HerbCollection", back_populates="transport_logs")

class TransportAlert(Base):
    __tablename__ = "transport_alerts"

    id = Column(Integer, primary_key=True, index=True)
    collection_id = Column(Integer, ForeignKey("herb_collections.id"))
    alert_type = Column(String(100), nullable=False) # TEMPERATURE_BREACH, HUMIDITY_BREACH
    current_value = Column(Float, nullable=False)
    threshold_range = Column(String(100), nullable=False)
    severity = Column(String(50), default="WARNING") # WARNING, CRITICAL
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    collection = relationship("HerbCollection", back_populates="transport_alerts")

class ManufacturedProduct(Base):
    __tablename__ = "manufactured_products"

    id = Column(Integer, primary_key=True, index=True)
    final_batch_id = Column(String(100), unique=True, index=True, nullable=False) # AYU-2026-XXXXX
    raw_batch_id = Column(String(100), index=True, nullable=False) # HCB-2026-XXXXX
    collection_id = Column(Integer, ForeignKey("herb_collections.id"))
    manufacturer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    facility_name = Column(String(255), nullable=False)
    medicine_name = Column(String(255), nullable=False)
    ayush_lic_no = Column(String(100), nullable=False)
    final_product_ipfs_hash = Column(String(255), nullable=True)
    qr_code_url = Column(String(255), nullable=True)
    manufactured_date = Column(DateTime, default=datetime.datetime.utcnow)

    collection = relationship("HerbCollection", back_populates="manufactured_product")

class QRHistory(Base):
    __tablename__ = "qr_history"

    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(String(100), index=True, nullable=False)
    scanned_at = Column(DateTime, default=datetime.datetime.utcnow)
    scanner_location = Column(String(255), default="Consumer App")
    ip_address = Column(String(100), nullable=True)

class BlockchainTransaction(Base):
    __tablename__ = "blockchain_transactions"

    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(String(100), nullable=False)
    tx_hash = Column(String(255), unique=True, nullable=False)
    block_number = Column(Integer, nullable=False)
    function_name = Column(String(100), nullable=False)
    sender_address = Column(String(255), nullable=False)
    status = Column(String(50), default="CONFIRMED")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    contract_address = Column(String(255), nullable=True)
    network = Column(String(100), default="Polygon Amoy Testnet (Chain ID 80002)")
    confirmations = Column(Integer, default=1)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="INFO") # INFO, WARNING, CRITICAL
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
