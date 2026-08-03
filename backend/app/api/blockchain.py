from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import BlockchainTransaction

router = APIRouter(prefix="/blockchain", tags=["Polygon Explorer & Transactions"])

@router.get("/transactions")
def get_recent_transactions(limit: int = 20, db: Session = Depends(get_db)):
    txs = db.query(BlockchainTransaction).order_by(BlockchainTransaction.timestamp.desc()).limit(limit).all()
    return txs

@router.get("/status")
def get_blockchain_network_status():
    return {
        "network": "Polygon Amoy Testnet (Chain ID 80002)",
        "contract_address": "0x3A9F56cB34720970C48483B462b48e3E43B33072",
        "current_block": 45809124,
        "avg_block_time": "2.1s",
        "gas_fee_gwei": 32.5,
        "total_contract_transactions": 1428,
        "status": "HEALTHY & SYNCHRONIZED"
    }
