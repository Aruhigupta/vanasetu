import hashlib
import time

class IPFSService:
    @staticmethod
    def upload_file_or_data(content: str | bytes) -> str:
        if isinstance(content, str):
            content_bytes = content.encode('utf-8')
        else:
            content_bytes = content
            
        digest = hashlib.sha256(content_bytes + str(time.time()).encode()).hexdigest()
        return f"Qm{digest[:44]}"

    @staticmethod
    def get_gateway_url(ipfs_hash: str) -> str:
        return f"https://ipfs.io/ipfs/{ipfs_hash}"
