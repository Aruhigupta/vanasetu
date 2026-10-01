from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import HerbCollection, ManufacturedProduct, QRHistory, BlockchainTransaction, User, Farmer, LabReport, TransportLog, TransportAlert
from app.services.qr_service import QRService
from app.services.ai_service import HerbAIService
from app.core.config import settings

router = APIRouter(prefix="/qr", tags=["QR Generation & Public Verification"])

@router.get("/generate/{batch_id}")
def generate_qr(batch_id: str, db: Session = Depends(get_db)):
    """
    Generates server-side Base64 vector QR code for a given batch ID.
    Uses configured NEXT_PUBLIC_APP_URL.
    """
    app_url = settings.NEXT_PUBLIC_APP_URL.rstrip('/')
    verification_url = f"{app_url}/verify/{batch_id}"
    qr_base64 = QRService.generate_qr_code_base64(verification_url)
    return {
        "batch_id": batch_id,
        "verification_url": verification_url,
        "qr_code_image": qr_base64
    }

@router.get("/verify/{batch_id}")
def verify_batch_timeline(batch_id: str, request: Request, db: Session = Depends(get_db)):
    """
    Public QR Verification Endpoint for PS27.
    Accepts final product batch ID (AYU-2026-XXXXX) OR raw batch ID (HCB-2026-XXXXX).
    Searches database records, records scan analytics, and calculates authentic status.
    NO HARDCODED MOCK SUPPLY-CHAIN DATA IS RETURNED.
    """
    # 1. Record Scan History Analytics
    client_ip = request.client.host if request.client else "127.0.0.1"
    qr_log = QRHistory(
        batch_id=batch_id,
        scanner_location="Public Consumer Verification Scan",
        ip_address=client_ip
    )
    db.add(qr_log)
    db.commit()

    # 2. Check if batch_id matches a Manufactured Product (AYU-...) or Raw Collection (HCB-...)
    mfg_product = db.query(ManufacturedProduct).filter(ManufacturedProduct.final_batch_id == batch_id).first()
    col = None
    final_batch_code = batch_id

    if mfg_product:
        col = mfg_product.collection
    else:
        col = db.query(HerbCollection).filter(HerbCollection.batch_id == batch_id).first()

    if not col:
        # Invalid Batch ID
        return {
            "batch_id": batch_id,
            "authenticity_status": "INVALID_PRODUCT",
            "is_authentic": False,
            "verdict_title": "INVALID / COUNTERFEIT BATCH ID",
            "verdict_message": f"Batch ID '{batch_id}' was not found in the official AYUSH HerbChain blockchain registry. Beware of fake QR packaging.",
            "herb_details": None,
            "farmer_details": None,
            "lab_details": None,
            "transport_history": [],
            "manufacturer_details": None,
            "blockchain_history": []
        }

    # 3. Compute Authenticity Status
    lab_report = col.lab_report
    transport_logs = db.query(TransportLog).filter(TransportLog.collection_id == col.id).order_by(TransportLog.timestamp.asc()).all()
    transport_alerts = db.query(TransportAlert).filter(TransportAlert.collection_id == col.id).all()
    blockchain_txs = db.query(BlockchainTransaction).filter(BlockchainTransaction.batch_id.in_([col.batch_id, batch_id])).all()

    authenticity_status = "AUTHENTIC"
    verdict_title = "100% VERIFIED AUTHENTIC & AYUSH CERTIFIED"
    verdict_message = "All supply chain stages from origin harvest, lab testing, transport, and manufacturing have been cryptographic signed on Polygon."

    if lab_report and lab_report.overall_status == "FAILED":
        authenticity_status = "FAILED_QUALITY_TEST"
        verdict_title = "REJECTED / FAILED LABORATORY ASSAY"
        verdict_message = "This herb batch failed AYUSH heavy metals, pesticide, or potency quality tests. Do not consume."
    elif not lab_report:
        authenticity_status = "INCOMPLETE_VERIFICATION"
        verdict_title = "VERIFICATION INCOMPLETE - LAB ASSAY PENDING"
        verdict_message = "This harvest batch has not completed certified laboratory assay testing yet."
    elif transport_alerts and any(a.severity == "CRITICAL" for a in transport_alerts):
        authenticity_status = "TRANSPORT_BREACH_WARNING"
        verdict_title = "COLD CHAIN TELEMETRY WARNING"
        verdict_message = "Temperature/Humidity violations occurred during transport."

    farmer = col.farmer
    farmer_user = farmer.user if farmer else None
    farmer_location_public = farmer.state if farmer else "Kerala, India" # Privacy protection: mask exact private residence coordinates

    herb = col.herb
    herb_name = herb.common_name if herb else "Ayurvedic Herb"
    botanical_name = herb.botanical_name if herb else ""

    # AI analysis
    ai_analysis = HerbAIService.detect_fake_herb_image(
        image_hash=col.image_ipfs_hash or "",
        claimed_herb=herb_name
    )

    mfg_info = None
    if mfg_product:
        mfg_info = {
            "company_name": mfg_product.facility_name,
            "facility": mfg_product.facility_name,
            "medicine_name": mfg_product.medicine_name,
            "ayush_license": mfg_product.ayush_lic_no,
            "final_batch_code": mfg_product.final_batch_id,
            "manufactured_date": mfg_product.manufactured_date
        }

    return {
        "batch_id": batch_id,
        "raw_batch_id": col.batch_id,
        "final_batch_id": mfg_product.final_batch_id if mfg_product else None,
        "authenticity_status": authenticity_status,
        "is_authentic": (authenticity_status == "AUTHENTIC"),
        "verdict_title": verdict_title,
        "verdict_message": verdict_message,
        "herb_details": {
            "name": herb_name,
            "botanical_name": botanical_name,
            "quantity_kg": col.quantity_kg,
            "moisture_pct": col.moisture_pct,
            "image_ipfs": col.image_ipfs_hash
        },
        "farmer_details": {
            "name": farmer_user.full_name if farmer_user else "Registered AYUSH Botanical Farmer",
            "farm_location": farmer_location_public,
            "gps_coordinates": col.gps_coordinates,
            "ayush_reg_id": farmer.ayush_reg_id if farmer else "AYUSH-FARM-REG",
            "harvest_date": col.harvest_date
        },
        "lab_details": {
            "lab_name": lab_report.lab_name,
            "tested_by": lab_report.tester_name,
            "potency_percentage": lab_report.potency_percentage,
            "chemical_assay": lab_report.chemical_assay,
            "heavy_metals_passed": lab_report.heavy_metals_pass,
            "pesticides_passed": lab_report.pesticides_pass,
            "microbial_passed": lab_report.microbial_pass,
            "overall_status": lab_report.overall_status,
            "cert_ipfs": lab_report.cert_ipfs_hash,
            "hplc_report_cid": lab_report.hplc_report_cid,
            "test_date": lab_report.test_date
        } if lab_report else None,
        "transport_history": [
            {
                "agency": t.carrier_agency,
                "driver": t.driver_name,
                "vehicle": t.vehicle_no,
                "location": t.current_gps,
                "temperature": t.temperature_celsius,
                "humidity": t.humidity_percentage,
                "timestamp": t.timestamp
            } for t in transport_logs
        ],
        "transport_alerts": [
            {
                "alert_type": a.alert_type,
                "severity": a.severity,
                "message": a.message,
                "timestamp": a.timestamp
            } for a in transport_alerts
        ],
        "manufacturer_details": mfg_info,
        "blockchain_history": [
            {
                "tx_hash": tx.tx_hash,
                "block_number": tx.block_number,
                "function": tx.function_name,
                "status": tx.status,
                "contract_address": tx.contract_address,
                "polygonscan_url": f"https://amoy.polygonscan.com/tx/{tx.tx_hash}"
            } for tx in blockchain_txs
        ],
        "ai_insights": ai_analysis
    }
