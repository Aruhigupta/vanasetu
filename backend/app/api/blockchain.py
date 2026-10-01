from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import BlockchainTransaction
from app.services.blockchain_service import BlockchainService

router = APIRouter(prefix="/blockchain", tags=["Polygon Explorer & Transactions"])

@router.get("/transactions")
def get_recent_transactions(limit: int = 20, db: Session = Depends(get_db)):
    txs = db.query(BlockchainTransaction).order_by(BlockchainTransaction.timestamp.desc()).limit(limit).all()
    return txs

@router.get("/status")
def get_blockchain_network_status():
    """
    Returns live Polygon network status or 'Network status unavailable'.
    No fake block numbers or gas fees are fabricated.
    """
    return BlockchainService.get_network_status()
