import datetime
from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.core.config import settings
from app.models.models import User, Farmer, Collector, Herb, HerbCollection, LabReport, TransportLog, Manufacturer, ManufacturedProduct, BlockchainTransaction, QRHistory

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # 1. Always seed botanical species catalog if empty
    if db.query(Herb).count() == 0:
        print("Seeding AYUSH Herb Pharmacopoeia Species Catalog...")
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
        db.add_all(herbs)
        db.commit()

    # 2. Always seed default role user accounts if empty
    if db.query(User).count() == 0:
        print("Seeding Default Role User Accounts...")
        admin_user = User(
            email="admin@herbchain.ai",
            hashed_password=get_password_hash("admin123"),
            full_name="Dr. Rajesh V. Sharma (AYUSH Director)",
            role="admin"
        )
        farmer_user = User(
            email="farmer@herbchain.ai",
            hashed_password=get_password_hash("farmer123"),
            full_name="Ramesh Gowda",
            role="farmer"
        )
        collector_user = User(
            email="collector@herbchain.ai",
            hashed_password=get_password_hash("collector123"),
            full_name="Sunil Kulkarni",
            role="collector"
        )
        lab_user = User(
            email="lab@herbchain.ai",
            hashed_password=get_password_hash("lab123"),
            full_name="Dr. Priya Nambiar",
            role="lab"
        )
        transporter_user = User(
            email="transport@herbchain.ai",
            hashed_password=get_password_hash("transport123"),
            full_name="Rajesh Kumar Logistics",
            role="transport"
        )
        mfr_user = User(
            email="manufacturer@herbchain.ai",
            hashed_password=get_password_hash("mfr123"),
            full_name="Dabur Central Plant Lead",
            role="manufacturer"
        )
        db.add_all([admin_user, farmer_user, collector_user, lab_user, transporter_user, mfr_user])
        db.commit()

        # Create linked profiles
        farmer_profile = Farmer(
            user_id=farmer_user.id,
            farm_name="Western Ghats Bio-Organic Herb Estate",
            farm_location="Wayanad District, Kerala",
            state="Kerala",
            gps_coordinates="11.6854, 76.1320",
            land_area_acres=12.5,
            ayush_reg_id="AYUSH-FARM-KL-9042",
            soil_type="Rich Volcanic Red Loam",
            verified=True
        )
        collector_profile = Collector(
            user_id=collector_user.id,
            forest_region="Bandipur Reserved Forest Zone B",
            state="Karnataka",
            permit_number="FOREST-PERMIT-KA-2025-089",
            authority_issued="Karnataka Forest Department",
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

    # 3. Seed Sample Demo Batch ONLY if SEED_DEMO_DATA=true in env
    if settings.SEED_DEMO_DATA and db.query(HerbCollection).filter(HerbCollection.batch_id == "HCB-2025-ASH01").count() == 0:
        print("SEED_DEMO_DATA=true: Inserting isolated demo test batch 'HCB-2025-ASH01'...")
        ashwa = db.query(Herb).filter(Herb.common_name == "Ashwagandha").first()
        farmer = db.query(Farmer).first()

        sample_raw_batch = "HCB-2025-ASH01"
        sample_final_batch = "AYU-2025-00041"

        col = HerbCollection(
            batch_id=sample_raw_batch,
            herb_id=ashwa.id if ashwa else 1,
            farmer_id=farmer.id if farmer else None,
            harvest_date=datetime.datetime.utcnow() - datetime.timedelta(days=14),
            quantity_kg=250.0,
            gps_coordinates="11.6854, 76.1320",
            location_address="Wayanad Bio-Organic Farm #4, Kerala",
            moisture_pct=6.8,
            image_ipfs_hash="QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
            ai_authenticity_score=98.8,
            status="MANUFACTURED"
        )
        db.add(col)
        db.commit()

        lab = LabReport(
            collection_id=col.id,
            lab_name="AYUSH National Central Testing Laboratory",
            tester_name="Dr. Priya Nambiar",
            chemical_assay="HPLC Assay: High Withanolide Content (8.65% vs API min 5.0%).",
            heavy_metals_pass=True,
            pesticides_pass=True,
            microbial_pass=True,
            potency_percentage=8.65,
            cert_ipfs_hash="QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
            overall_status="PASSED",
            test_date=datetime.datetime.utcnow() - datetime.timedelta(days=10)
        )
        db.add(lab)

        tlog = TransportLog(
            collection_id=col.id,
            carrier_agency="AYUSH Express Cold-Chain Logistics",
            driver_name="Rajesh Kumar",
            vehicle_no="KA-01-HC-9042",
            current_gps="12.9716, 77.5946",
            temperature_celsius=18.5,
            humidity_percentage=42.0,
            status_notes="Cold chain maintained",
            timestamp=datetime.datetime.utcnow() - datetime.timedelta(days=5)
        )
        db.add(tlog)

        mfg = ManufacturedProduct(
            final_batch_id=sample_final_batch,
            raw_batch_id=sample_raw_batch,
            collection_id=col.id,
            facility_name="Dabur Haridwar Unit 4",
            medicine_name="Pure Premium Ashwagandha Churna 100g",
            ayush_lic_no="AYUSH-MFG-LIC-2025-4401",
            qr_code_url=f"{settings.NEXT_PUBLIC_APP_URL.rstrip('/')}/verify/{sample_final_batch}"
        )
        db.add(mfg)
        db.commit()

    db.close()

if __name__ == "__main__":
    seed_db()
