from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import HerbCollection, Farmer, Collector, BlockchainTransaction, LabReport, QRHistory, ManufacturedProduct

router = APIRouter(prefix="/dashboard", tags=["Admin & Executive Dashboard Analytics"])

@router.get("/metrics")
def get_dashboard_metrics(db: Session = Depends(get_db)):
    """
    Returns live metrics strictly calculated from actual database records.
    NO FAKE MOCK METRICS ARE FABRICATED.
    """
    total_collections = db.query(HerbCollection).all()
    total_farmers = db.query(Farmer).count()
    total_collectors = db.query(Collector).count()
    total_txs = db.query(BlockchainTransaction).count()
    total_lab_reports = db.query(LabReport).count()
    total_qr_scans = db.query(QRHistory).count()
    total_manufactured = db.query(ManufacturedProduct).count()

    total_herbs_kg = sum(c.quantity_kg for c in total_collections) if total_collections else 0.0

    passed_labs = db.query(LabReport).filter(LabReport.overall_status == "PASSED").count()
    pass_rate_pct = round((passed_labs / total_lab_reports * 100), 1) if total_lab_reports > 0 else 0.0

    # Supply Chain Status Split calculated from DB
    status_split = [
        {"status": "COLLECTED", "count": db.query(HerbCollection).filter(HerbCollection.status == "COLLECTED").count()},
        {"status": "TESTED_PASSED", "count": db.query(HerbCollection).filter(HerbCollection.status == "TESTED_PASSED").count()},
        {"status": "TESTED_FAILED", "count": db.query(HerbCollection).filter(HerbCollection.status == "TESTED_FAILED").count()},
        {"status": "IN_TRANSIT", "count": db.query(HerbCollection).filter(HerbCollection.status == "IN_TRANSIT").count()},
        {"status": "MANUFACTURED", "count": total_manufactured},
    ]

    # State-wise Distribution calculated from Farmers DB table
    state_counts = {}
    farmers = db.query(Farmer).all()
    for f in farmers:
        st = f.state or "Unknown State"
        state_counts[st] = state_counts.get(st, 0) + 1

    state_collections = [
        {"state": st, "collections": count} for st, count in state_counts.items()
    ] if state_counts else []

    # Recent Blockchain Activity Stream from DB
    recent_txs = db.query(BlockchainTransaction).order_by(BlockchainTransaction.timestamp.desc()).limit(5).all()
    recent_activity = [
        {
            "time": tx.timestamp.strftime("%H:%M:%S UTC"),
            "action": f"Batch {tx.batch_id} - Method '{tx.function_name}' ({tx.status})",
            "role": "Polygon Ledger"
        } for tx in recent_txs
    ]

    return {
        "summary": {
            "total_herbs_collected_kg": round(total_herbs_kg, 1),
            "total_farmers": total_farmers,
            "total_collectors": total_collectors,
            "total_blockchain_txs": total_txs,
            "total_lab_reports": total_lab_reports,
            "total_consumer_scans": total_qr_scans,
            "total_manufactured_batches": total_manufactured,
            "quality_pass_rate_pct": pass_rate_pct
        },
        "state_collections": state_collections,
        "supply_chain_status": status_split,
        "recent_activity": recent_activity
    }
