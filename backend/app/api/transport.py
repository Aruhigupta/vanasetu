from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from app.core.database import get_db
from app.models.models import TransportLog, TransportAlert, HerbCollection, BlockchainTransaction, User
from app.services.blockchain_service import BlockchainService
from app.api.deps import get_current_user, require_roles

router = APIRouter(prefix="/transport", tags=["Logistics & Cold-Chain Transport"])

class TransportCreateRequest(BaseModel):
    batch_id: str
    carrier_agency: str
    driver_name: str
    vehicle_no: str
    current_gps: str
    temperature_celsius: float
    humidity_percentage: float
    status_notes: Optional[str] = None

# Temperature & Humidity Configured Safe Ranges
TEMP_MIN_C = 15.0
TEMP_MAX_C = 25.0
HUMIDITY_MIN_PCT = 30.0
HUMIDITY_MAX_PCT = 60.0

@router.post("")
def update_transport(
    trans_in: TransportCreateRequest,
    current_user: User = Depends(require_roles("transport", "admin")),
    db: Session = Depends(get_db)
):
    """
    Logs cold-chain transport checkpoint telemetry.
    Checks temperature & humidity thresholds and creates alert records on breach.
    """
    col = db.query(HerbCollection).filter(HerbCollection.batch_id == trans_in.batch_id).first()
    if not col:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Batch ID '{trans_in.batch_id}' not found in database."
        )

    # Verify eligibility for transport (Must not be TESTED_FAILED)
    if col.status == "TESTED_FAILED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Transport Blocked: Batch '{trans_in.batch_id}' failed quality testing and cannot be shipped."
        )

    log = TransportLog(
        collection_id=col.id,
        transporter_user_id=current_user.id,
        carrier_agency=trans_in.carrier_agency,
        driver_name=trans_in.driver_name,
        vehicle_no=trans_in.vehicle_no,
        current_gps=trans_in.current_gps,
        temperature_celsius=trans_in.temperature_celsius,
        humidity_percentage=trans_in.humidity_percentage,
        status_notes=trans_in.status_notes
    )
    db.add(log)
    col.status = "IN_TRANSIT"

    # Check for telemetry breaches & log alerts
    alerts_created = []
    if trans_in.temperature_celsius < TEMP_MIN_C or trans_in.temperature_celsius > TEMP_MAX_C:
        alert = TransportAlert(
            collection_id=col.id,
            alert_type="TEMPERATURE_BREACH",
            current_value=trans_in.temperature_celsius,
            threshold_range=f"{TEMP_MIN_C}°C - {TEMP_MAX_C}°C",
            severity="WARNING" if 10.0 <= trans_in.temperature_celsius <= 30.0 else "CRITICAL",
            message=f"Temperature Breach Detected! Recorded: {trans_in.temperature_celsius}°C (Allowed range: {TEMP_MIN_C}°C to {TEMP_MAX_C}°C)"
        )
        db.add(alert)
        alerts_created.append("TEMPERATURE_BREACH")

    if trans_in.humidity_percentage < HUMIDITY_MIN_PCT or trans_in.humidity_percentage > HUMIDITY_MAX_PCT:
        alert = TransportAlert(
            collection_id=col.id,
            alert_type="HUMIDITY_BREACH",
            current_value=trans_in.humidity_percentage,
            threshold_range=f"{HUMIDITY_MIN_PCT}% - {HUMIDITY_MAX_PCT}%",
            severity="WARNING",
            message=f"Humidity Breach Detected! Recorded: {trans_in.humidity_percentage}% (Allowed range: {HUMIDITY_MIN_PCT}% to {HUMIDITY_MAX_PCT}%)"
        )
        db.add(alert)
        alerts_created.append("HUMIDITY_BREACH")

    tx_hash = None
    try:
        tx_result = BlockchainService.execute_contract_transaction(
            "updateTransportStatus",
            [
                trans_in.batch_id,
                trans_in.carrier_agency,
                trans_in.vehicle_no,
                trans_in.current_gps,
                int(trans_in.temperature_celsius),
                int(trans_in.humidity_percentage)
            ]
        )
        tx_hash = tx_result["tx_hash"]
        bc_tx = BlockchainTransaction(
            batch_id=trans_in.batch_id,
            tx_hash=tx_result["tx_hash"],
            block_number=tx_result["block_number"],
            function_name="updateTransportStatus",
            sender_address=tx_result["sender_address"],
            status=tx_result["status"],
            contract_address=tx_result.get("contract_address")
        )
        db.add(bc_tx)
    except HTTPException:
        pass

    db.commit()

    return {
        "message": "Transport telemetry checkpoint logged successfully",
        "batch_id": trans_in.batch_id,
        "status": col.status,
        "alerts": alerts_created,
        "tx_hash": tx_hash
    }

@router.get("/{batch_id}")
def get_transport_logs(batch_id: str, db: Session = Depends(get_db)):
    col = db.query(HerbCollection).filter(HerbCollection.batch_id == batch_id).first()
    if not col:
        raise HTTPException(status_code=404, detail=f"Batch ID '{batch_id}' not found")

    logs = db.query(TransportLog).filter(TransportLog.collection_id == col.id).order_by(TransportLog.timestamp.asc()).all()
    alerts = db.query(TransportAlert).filter(TransportAlert.collection_id == col.id).order_by(TransportAlert.timestamp.asc()).all()

    return {
        "batch_id": batch_id,
        "logs": logs,
        "alerts": alerts
    }
