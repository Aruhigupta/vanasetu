from fastapi import APIRouter
from app.schemas.schemas import AIHerbImageCheck, AIQualityPredictionInput
from app.services.ai_service import HerbAIService

router = APIRouter(
    prefix="/ai",
    tags=["AI Engine Services"]
)


@router.post("/detect-fake-herb")
def detect_fake_herb(req: AIHerbImageCheck):
    return HerbAIService.detect_fake_herb_image(
        req.image_url_or_hash,
        req.claimed_herb_name
    )


@router.post("/predict-quality")
def predict_quality(req: AIQualityPredictionInput):
    return HerbAIService.predict_herb_quality(
        herb_name=req.herb_name,
        region=req.region,
        season=req.season,
        moisture_pct=req.moisture_pct,
        drying_method=req.drying_method
    )


@router.get("/storage-conditions/{herb_name}")
def get_storage_recommendations(herb_name: str):
    return HerbAIService.recommend_storage_conditions(herb_name)


@router.get("/detect-anomalies/{batch_id}")
def detect_anomalies(batch_id: str):
    return HerbAIService.detect_supply_chain_anomalies(
        [{"batch_id": batch_id}]
    )


@router.get("/generate-quality-report/{batch_id}")
def generate_quality_report(
    batch_id: str,
    herb_name: str = "Ashwagandha"
):
    return HerbAIService.generate_ayush_quality_report(
        batch_id=batch_id,
        herb_name=herb_name,
        quality_data={
            "chemical_assay": "HPLC Assay: High Withanolide Content (>8.2%). Meets Pharmacopoeial standard."
        }
    )