import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "HerbChain AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-herbchain-ayush-hackathon-key-2025-key-change-me")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # On Vercel serverless functions, write SQLite database to /tmp/herbchain.db
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:////tmp/herbchain.db")
    
    POLYGON_RPC_URL: str = os.getenv("POLYGON_RPC_URL", "https://rpc-amoy.polygon.technology")
    CONTRACT_ADDRESS: str = os.getenv("CONTRACT_ADDRESS", "0x3A9F56cB34720970C48483B462b48e3E43B33072")
    
    IPFS_GATEWAY: str = os.getenv("IPFS_GATEWAY", "https://ipfs.io/ipfs/")
    
    class Config:
        case_sensitive = True

settings = Settings()
