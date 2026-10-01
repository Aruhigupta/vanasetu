import requests
from fastapi import HTTPException, status
from app.core.config import settings

class IPFSService:
    @staticmethod
    def upload_file(file_bytes: bytes, filename: str) -> dict:
        """
        Uploads a raw file (image, PDF report, document) to IPFS via Pinata API.
        Returns dict containing IpfsHash (CID) and gateway URL.
        Throws HTTPException 503 on failure.
        """
        if not (settings.PINATA_JWT or (settings.PINATA_API_KEY and settings.PINATA_SECRET_KEY)):
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="IPFS Service Unavailable: Pinata API credentials (PINATA_API_KEY / PINATA_JWT) are not configured in environment variables."
            )
        
        url = "https://api.pinata.cloud/pinning/pinFileToIPFS"
        headers = {}
        if settings.PINATA_JWT:
            headers["Authorization"] = f"Bearer {settings.PINATA_JWT}"
        else:
            headers["pinata_api_key"] = settings.PINATA_API_KEY
            headers["pinata_secret_api_key"] = settings.PINATA_SECRET_KEY

        files = {
            'file': (filename, file_bytes)
        }

        try:
            response = requests.post(url, files=files, headers=headers, timeout=15)
            if response.status_code == 200:
                data = response.json()
                cid = data.get("IpfsHash")
                return {
                    "cid": cid,
                    "ipfs_hash": cid,
                    "gateway_url": f"{settings.IPFS_GATEWAY.rstrip('/')}/{cid}",
                    "size": data.get("PinSize", len(file_bytes)),
                    "timestamp": data.get("Timestamp")
                }
            else:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail=f"IPFS Pinata upload failed with status {response.status_code}: {response.text}"
                )
        except requests.RequestException as e:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"IPFS Network Connection Failure: {str(e)}"
            )

    @staticmethod
    def upload_json(data: dict) -> dict:
        """
        Uploads JSON metadata to IPFS via Pinata API.
        Returns dict containing IpfsHash (CID) and gateway URL.
        """
        if not (settings.PINATA_JWT or (settings.PINATA_API_KEY and settings.PINATA_SECRET_KEY)):
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="IPFS Service Unavailable: Pinata API credentials are not configured in environment variables."
            )

        url = "https://api.pinata.cloud/pinning/pinJSONToIPFS"
        headers = {"Content-Type": "application/json"}
        if settings.PINATA_JWT:
            headers["Authorization"] = f"Bearer {settings.PINATA_JWT}"
        else:
            headers["pinata_api_key"] = settings.PINATA_API_KEY
            headers["pinata_secret_api_key"] = settings.PINATA_SECRET_KEY

        try:
            response = requests.post(url, json=data, headers=headers, timeout=15)
            if response.status_code == 200:
                res_data = response.json()
                cid = res_data.get("IpfsHash")
                return {
                    "cid": cid,
                    "ipfs_hash": cid,
                    "gateway_url": f"{settings.IPFS_GATEWAY.rstrip('/')}/{cid}"
                }
            else:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail=f"IPFS JSON upload failed with status {response.status_code}: {response.text}"
                )
        except requests.RequestException as e:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"IPFS Network Connection Failure: {str(e)}"
            )

    @staticmethod
    def get_gateway_url(ipfs_hash: str) -> str:
        if not ipfs_hash:
            return ""
        return f"{settings.IPFS_GATEWAY.rstrip('/')}/{ipfs_hash}"
