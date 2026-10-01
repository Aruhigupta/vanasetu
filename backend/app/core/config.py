import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "HerbChain AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "herbchain-dev-secret-key-2026-vanasetu")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Dual database support: SQLite for dev, PostgreSQL for prod
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./herbchain.db")
    
    # Blockchain Settings (Polygon Amoy)
    POLYGON_RPC_URL: str = os.getenv("POLYGON_RPC_URL", "https://rpc-amoy.polygon.technology")
    POLYGON_CHAIN_ID: int = int(os.getenv("POLYGON_CHAIN_ID", "80002"))
    CONTRACT_ADDRESS: str = os.getenv("CONTRACT_ADDRESS", "0x3A9F56cB34720970C48483B462b48e3E43B33072")
    BLOCKCHAIN_PRIVATE_KEY: str = os.getenv("BLOCKCHAIN_PRIVATE_KEY", os.getenv("PRIVATE_KEY", ""))
    
    # IPFS Pinning Gateway
    IPFS_GATEWAY: str = os.getenv("IPFS_GATEWAY", "https://ipfs.io/ipfs/")
    PINATA_API_KEY: str = os.getenv("PINATA_API_KEY", "")
    PINATA_SECRET_KEY: str = os.getenv("PINATA_SECRET_KEY", "")
    PINATA_JWT: str = os.getenv("PINATA_JWT", "")
    
    NEXT_PUBLIC_APP_URL: str = os.getenv("NEXT_PUBLIC_APP_URL", "http://localhost:3000")
    SEED_DEMO_DATA: bool = os.getenv("SEED_DEMO_DATA", "true").lower() in ("true", "1", "yes")

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
