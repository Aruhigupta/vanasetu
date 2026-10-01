from typing import Dict, Any
import requests
from fastapi import HTTPException, status
from app.core.config import settings
from app.core.abi import HERBCHAIN_CONTRACT_ABI

class BlockchainService:
    @staticmethod
    def get_w3():
        """
        Returns initialized Web3 instance connected to Polygon Amoy.
        """
        try:
            from web3 import Web3
            w3 = Web3(Web3.HTTPProvider(settings.POLYGON_RPC_URL))
            return w3
        except Exception as e:
            return None

    @staticmethod
    def get_network_status() -> Dict[str, Any]:
        """
        Queries live Polygon Amoy Testnet RPC for block height and status.
        Never returns fabricated numbers.
        """
        try:
            w3 = BlockchainService.get_w3()
            if w3 and w3.is_connected():
                latest_block = w3.eth.block_number
                gas_price_wei = w3.eth.gas_price
                gas_price_gwei = round(gas_price_wei / 1e9, 2)
                return {
                    "network": "Polygon Amoy Testnet (Chain ID 80002)",
                    "contract_address": settings.CONTRACT_ADDRESS,
                    "current_block": latest_block,
                    "gas_fee_gwei": gas_price_gwei,
                    "status": "HEALTHY & SYNCHRONIZED",
                    "connected": True
                }
            else:
                # Direct JSON-RPC fallback query via requests
                payload = {"jsonrpc": "2.0", "method": "eth_blockNumber", "params": [], "id": 1}
                res = requests.post(settings.POLYGON_RPC_URL, json=payload, timeout=5)
                if res.status_code == 200:
                    data = res.json()
                    hex_block = data.get("result", "0x0")
                    latest_block = int(hex_block, 16)
                    return {
                        "network": "Polygon Amoy Testnet (Chain ID 80002)",
                        "contract_address": settings.CONTRACT_ADDRESS,
                        "current_block": latest_block,
                        "status": "CONNECTED via RPC",
                        "connected": True
                    }
        except Exception as e:
            pass

        return {
            "network": "Polygon Amoy Testnet (Chain ID 80002)",
            "contract_address": settings.CONTRACT_ADDRESS,
            "status": "Network status unavailable - Polygon RPC Offline",
            "connected": False
        }

    @staticmethod
    def execute_contract_transaction(function_name: str, args: list) -> Dict[str, Any]:
        """
        Executes real transaction on Polygon Amoy Smart Contract using Web3.
        Requires BLOCKCHAIN_PRIVATE_KEY and CONTRACT_ADDRESS.
        Throws HTTPException 503 if wallet or RPC connection is missing or fails.
        NO FAKE TRANSACTION HASHES ARE GENERATED.
        """
        if not settings.BLOCKCHAIN_PRIVATE_KEY:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Blockchain Transaction Failed: BLOCKCHAIN_PRIVATE_KEY is not configured in backend environment variables."
            )

        if not settings.CONTRACT_ADDRESS or settings.CONTRACT_ADDRESS == "0x0000000000000000000000000000000000000000":
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Blockchain Transaction Failed: CONTRACT_ADDRESS is not configured."
            )

        w3 = BlockchainService.get_w3()
        if not w3 or not w3.is_connected():
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Blockchain Network Error: Unable to connect to Polygon Amoy RPC ({settings.POLYGON_RPC_URL})"
            )

        try:
            account = w3.eth.account.from_key(settings.BLOCKCHAIN_PRIVATE_KEY)
            sender_address = account.address
            contract = w3.eth.contract(address=w3.to_checksum_address(settings.CONTRACT_ADDRESS), abi=HERBCHAIN_CONTRACT_ABI)

            # Get contract function object
            func_to_call = getattr(contract.functions, function_name)
            tx_data = func_to_call(*args)

            nonce = w3.eth.get_transaction_count(sender_address, 'pending')
            gas_price = w3.eth.gas_price

            # Estimate gas or fallback
            try:
                estimated_gas = tx_data.estimate_gas({'from': sender_address})
                gas_limit = int(estimated_gas * 1.3)
            except Exception:
                gas_limit = 500000

            unsigned_tx = tx_data.build_transaction({
                'chainId': settings.POLYGON_CHAIN_ID,
                'gas': gas_limit,
                'gasPrice': gas_price,
                'nonce': nonce,
                'from': sender_address
            })

            signed_tx = w3.eth.account.sign_transaction(unsigned_tx, settings.BLOCKCHAIN_PRIVATE_KEY)
            tx_hash_bytes = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
            tx_hash = w3.to_hex(tx_hash_bytes)

            # Wait for receipt
            receipt = w3.eth.wait_for_transaction_receipt(tx_hash_bytes, timeout=30)
            block_number = receipt.get("blockNumber", 0)

            return {
                "tx_hash": tx_hash,
                "block_number": block_number,
                "sender_address": sender_address,
                "polygonscan_url": f"https://amoy.polygonscan.com/tx/{tx_hash}",
                "status": "CONFIRMED" if receipt.get("status") == 1 else "REVERTED",
                "contract_address": settings.CONTRACT_ADDRESS
            }
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Polygon Smart Contract Transaction Execution Failed: {str(e)}"
            )
