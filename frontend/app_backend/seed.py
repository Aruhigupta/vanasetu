from app_backend.core.database import SessionLocal, engine, Base
from app_backend.core.security import get_password_hash
from app_backend.models.models import User, Farmer, Collector, Herb, HerbCollection, LabReport, TransportLog, Manufacturer, BlockchainTransaction, QRHistory
import datetime

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(Herb).count() > 0:
        db.close()
        return

    herbs = [
        Herb(
            common_name="Ashwagandha",
            botanical_name="Withania somnifera",
            ayush_category="Rasayana (Rejuvenative)",
            active_compounds="Withanolides, Withaferin A",
            description="Adaptogenic root herb extensively used in traditional Ayurveda for vitality and immunity.",
            standard_moisture_max=8.5,
            standard_purity_min=98.0
        ),
        Herb(
            common_name="Tulsi (Holy Basil)",
            botanical_name="Ocimum sanctum",
            ayush_category="Pranada (Life-giving)",
            active_compounds="Eugenol, Ursolic Acid, Carvacrol",
            description="Sacred medicinal herb noted for respiratory and adaptogenic therapeutic properties.",
            standard_moisture_max=10.0,
            standard_purity_min=96.5
        ),
        Herb(
            common_name="Giloy (Guduchi)",
            botanical_name="Tinospora cordifolia",
            ayush_category="Vayasthapana (Anti-aging)",
            active_compounds="Tinosporoside, Berberine, Cordifolioside",
            description="Stem-extracted immunomodulator and antipyretic in classical Ayurvedic formulations.",
            standard_moisture_max=9.0,
            standard_purity_min=97.0
        ),
        Herb(
            common_name="Haridra (Wild Turmeric)",
            botanical_name="Curcuma longa",
            ayush_category="Kandughna (Anti-inflammatory)",
            active_compounds="Curcuminoids, Curcumin, Demethoxycurcumin",
            description="Potent antioxidant and anti-inflammatory root collected across Western Ghats & Assam.",
            standard_moisture_max=7.5,
            standard_purity_min=99.0
        ),
        Herb(
            common_name="Shatavari",
            botanical_name="Asparagus racemosus",
            ayush_category="Balya (Strength-promoting)",
            active_compounds="Shatavarins (I-IV), Sarsasapogenin",
            description="Rejuvenative herb for hormonal balance and cellular longevity.",
            standard_moisture_max=9.5,
            standard_purity_min=96.0
        ),
        Herb(
            common_name="Brahmi",
            botanical_name="Bacopa monnieri",
            ayush_category="Medhya (Nootropic / Brain tonic)",
            active_compounds="Bacosides A & B",
            description="Aquatic herb prized for cognitive enhancement and memory preservation.",
            standard_moisture_max=10.5,
            standard_purity_min=95.0
        )
    ]
    for h in herbs:
        db.add(h)
    db.commit()

    admin_user = User(
        email="admin@herbchain.ai",
        hashed_password=get_password_hash("admin123"),
        full_name="Dr. Rajesh V. Sharma (AYUSH Director)",
        role="admin",
        wallet_address="0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7"
    )
    farmer_user = User(
        email="farmer@herbchain.ai",
        hashed_password=get_password_hash("farmer123"),
        full_name="Ramesh Gowda",
        role="farmer",
        wallet_address="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
    )
    collector_user = User(
        email="collector@herbchain.ai",
        hashed_password=get_password_hash("collector123"),
        full_name="Sunil Kulkarni",
        role="collector",
        wallet_address="0x3C44CdD46a935571ed359B5753C402f1a6fB6b87"
    )
    lab_user = User(
        email="lab@herbchain.ai",
        hashed_password=get_password_hash("lab123"),
        full_name="Dr. Priya Nambiar",
        role="lab",
        wallet_address="0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB"
    )
    mfr_user = User(
        email="manufacturer@herbchain.ai",
        hashed_password=get_password_hash("mfr123"),
        full_name="Dabur Central Plant Lead",
        role="manufacturer",
        wallet_address="0x58303A293720775Ef925354921C5e85304ec51e6"
    )
    db.add_all([admin_user, farmer_user, collector_user, lab_user, mfr_user])
    db.commit()

    farmer_profile = Farmer(
        user_id=farmer_user.id,
        farm_name="Western Ghats Bio-Organic Herb Estate",
        farm_location="Wayanad District, Kerala",
        state="Kerala",
        gps_coordinates="11.6854° N, 76.1320° E",
        land_area_acres=12.5,
        ayush_reg_id="AYUSH-FARM-KL-9042",
        soil_type="Rich Volcanic Red Loam",
        verified=True
    )
    collector_profile = Collector(
        user_id=collector_user.id,
        forest_region="Bandipur Reserved Tribal Forest Zone",
        state="Karnataka",
        permit_number="FOREST-PERMIT-KA-2025-089",
        authority_issued="Karnataka Forest & Botanical Department",
        valid_until="2027-03-31"
    )
    mfr_profile = Manufacturer(
        user_id=mfr_user.id,
        company_name="Dabur AYUSH Botanicals Ltd",
        license_no="AYUSH-MFG-LIC-2025-4401",
        facility_address="Haridwar Industrial Estate, Uttarakhand",
        ayush_approval_no="AYUSH-GOV-APP-9981"
    )
    db.add_all([farmer_profile, collector_profile, mfr_profile])
    db.commit()

    sample_batch_id = "HCB-2025-ASH01"
    ashwa_herb = db.query(Herb).filter(Herb.common_name == "Ashwagandha").first()
    
    collection = HerbCollection(
        batch_id=sample_batch_id,
        herb_id=ashwa_herb.id,
        farmer_id=farmer_profile.id,
        harvest_date=datetime.datetime.utcnow() - datetime.timedelta(days=14),
        quantity_kg=250.0,
        gps_coordinates="11.6854° N, 76.1320° E",
        location_address="Wayanad Bio-Organic Farm #4, Kerala",
        moisture_pct=6.8,
        image_ipfs_hash="QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
        ai_authenticity_score=98.8,
        status="MANUFACTURED"
    )
    db.add(collection)
    db.commit()

    lab_report = LabReport(
        collection_id=collection.id,
        lab_name="AYUSH National Central Botanical Testing Lab",
        tester_name="Dr. Priya Nambiar",
        chemical_assay="HPLC Assay: High Withanolide Content (8.65% vs API standard min 5.0%). Meets all AYUSH Pharmacopoeial Standards.",
        heavy_metals_pass=True,
        pesticides_pass=True,
        microbial_pass=True,
        potency_percentage=8.65,
        cert_ipfs_hash="QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
        overall_status="PASSED",
        test_date=datetime.datetime.utcnow() - datetime.timedelta(days=10)
    )
    db.add(lab_report)

    tlog = TransportLog(
        collection_id=collection.id,
        carrier_agency="AYUSH Express Cold-Chain Logistics",
        driver_name="Rajesh Kumar",
        vehicle_no="KA-01-HC-9042",
        current_gps="12.9716° N, 77.5946° E (Bengaluru Depot)",
        temperature_celsius=18.5,
        humidity_percentage=42.0,
        status_notes="In Transit - Cold Chain Temperature maintained at 18.5°C",
        timestamp=datetime.datetime.utcnow() - datetime.timedelta(days=5)
    )
    db.add(tlog)

    txs = [
        BlockchainTransaction(
            batch_id=sample_batch_id,
            tx_hash="0x9a8f4c2e1b3d5a7f9e8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e",
            block_number=45802105,
            function_name="registerHerb",
            sender_address="0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
            status="CONFIRMED"
        ),
        BlockchainTransaction(
            batch_id=sample_batch_id,
            tx_hash="0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c",
            block_number=45803410,
            function_name="addLabReport",
            sender_address="0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB",
            status="CONFIRMED"
        ),
        BlockchainTransaction(
            batch_id=sample_batch_id,
            tx_hash="0x5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e",
            block_number=45805120,
            function_name="updateManufacturing",
            sender_address="0x58303A293720775Ef925354921C5e85304ec51e6",
            status="CONFIRMED"
        )
    ]
    for tx in txs:
        db.add(tx)

    qr_h = QRHistory(
        batch_id=sample_batch_id,
        scanned_at=datetime.datetime.utcnow(),
        scanner_location="Public Consumer Scan (New Delhi)",
        ip_address="103.21.124.5"
    )
    db.add(qr_h)

    db.commit()
    db.close()
