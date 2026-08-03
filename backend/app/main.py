from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.seed import seed_db

# Include Routers
from app.api import auth, herbs, collections, lab, transport, manufacturers, qr, blockchain, dashboard, ai

# Initialize DB tables automatically on startup
Base.metadata.create_all(bind=engine)
try:
    seed_db()
except Exception as e:
    print(f"Seed info: {e}")

app = FastAPI(
    title="HerbChain AI API",
    description="Blockchain-Based Botanical Traceability System for Ayurvedic Herbs (Smart India Hackathon 2025 - Ministry of AYUSH)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(herbs.router, prefix=settings.API_V1_STR)
app.include_router(collections.router, prefix=settings.API_V1_STR)
app.include_router(lab.router, prefix=settings.API_V1_STR)
app.include_router(transport.router, prefix=settings.API_V1_STR)
app.include_router(manufacturers.router, prefix=settings.API_V1_STR)
app.include_router(qr.router, prefix=settings.API_V1_STR)
app.include_router(blockchain.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "project": "HerbChain AI",
        "system": "Blockchain-Based Botanical Traceability System for Ayurvedic Herbs",
        "hackathon": "Smart India Hackathon 2025 (Ministry of AYUSH)",
        "status": "ONLINE",
        "documentation": "/docs"
    }
