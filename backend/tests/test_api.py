import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import Base, engine, SessionLocal
from app.models.models import User, Farmer, Herb

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ONLINE"
    assert "HerbChain AI" in data["project"]

def test_auth_and_protected_flow():
    # 1. Register Farmer
    register_payload = {
        "email": "test_farmer_auto@herbchain.ai",
        "password": "Password123!",
        "full_name": "Automated Test Farmer",
        "role": "farmer"
    }
    resp = client.post("/api/v1/auth/register", json=register_payload)
    assert resp.status_code in (200, 400) # 400 if already exists

    # 2. Login
    login_resp = client.post("/api/v1/auth/login", json={
        "email": "test_farmer_auto@herbchain.ai",
        "password": "Password123!"
    })
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    assert token is not None

    headers = {"Authorization": f"Bearer {token}"}

    # 3. GET /auth/me
    me_resp = client.get("/api/v1/auth/me", headers=headers)
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == "test_farmer_auto@herbchain.ai"

    # 4. GET /herbs
    herbs_resp = client.get("/api/v1/herbs")
    assert herbs_resp.status_code == 200
    herbs = herbs_resp.json()
    assert len(herbs) > 0

    # 5. Create Collection Batch
    col_payload = {
        "herb_id": herbs[0]["id"],
        "quantity_kg": 150.0,
        "gps_coordinates": "11.6854, 76.1320",
        "location_address": "Automated Farm, Kerala",
        "moisture_pct": 7.2
    }
    col_resp = client.post("/api/v1/collections", json=col_payload, headers=headers)
    assert col_resp.status_code == 200
    batch = col_resp.json()
    raw_batch_id = batch["batch_id"]
    assert raw_batch_id.startswith("HCB-")

    # 6. Register Lab User & Submit Lab Report
    lab_reg = client.post("/api/v1/auth/register", json={
        "email": "test_lab_auto@herbchain.ai",
        "password": "Password123!",
        "full_name": "Automated Test Lab",
        "role": "lab"
    })
    lab_login = client.post("/api/v1/auth/login", json={
        "email": "test_lab_auto@herbchain.ai",
        "password": "Password123!"
    })
    lab_token = lab_login.json()["access_token"]
    lab_headers = {"Authorization": f"Bearer {lab_token}"}

    lab_payload = {
        "batch_id": raw_batch_id,
        "lab_name": "Central Testing Lab",
        "tester_name": "Dr. Automated Tester",
        "chemical_assay": "HPLC Assay: 8.5% Withanolides. Meets Standards.",
        "heavy_metals_pass": True,
        "pesticides_pass": True,
        "microbial_pass": True,
        "potency_percentage": 8.5
    }
    lab_resp = client.post("/api/v1/lab", json=lab_payload, headers=lab_headers)
    assert lab_resp.status_code == 200
    assert lab_resp.json()["overall_status"] == "PASSED"

    # 7. Register Manufacturer User & Submit Manufacturing Batch
    mfg_reg = client.post("/api/v1/auth/register", json={
        "email": "test_mfr_auto@herbchain.ai",
        "password": "Password123!",
        "full_name": "Automated Test Manufacturer",
        "role": "manufacturer"
    })
    mfg_login = client.post("/api/v1/auth/login", json={
        "email": "test_mfr_auto@herbchain.ai",
        "password": "Password123!"
    })
    mfg_token = mfg_login.json()["access_token"]
    mfg_headers = {"Authorization": f"Bearer {mfg_token}"}

    mfg_payload = {
        "batch_id": raw_batch_id,
        "facility_name": "Automated Unit 1",
        "medicine_name": "Pure Ashwagandha Churna",
        "ayush_lic_no": "AYUSH-LIC-AUTO-100"
    }
    mfg_resp = client.post("/api/v1/manufacturers/batch", json=mfg_payload, headers=mfg_headers)
    assert mfg_resp.status_code == 200
    mfg_data = mfg_resp.json()
    final_batch_id = mfg_data["final_batch_id"]
    assert final_batch_id.startswith("AYU-")

    # 8. Verify QR Public Verification Endpoint
    verify_resp = client.get(f"/api/v1/qr/verify/{final_batch_id}")
    assert verify_resp.status_code == 200
    v_data = verify_resp.json()
    assert v_data["authenticity_status"] == "AUTHENTIC"
    assert v_data["raw_batch_id"] == raw_batch_id

def test_ai_quality_report():
    resp = client.get("/api/v1/ai/generate-quality-report/HCB-2025-ASH01")
    assert resp.status_code == 200
    data = resp.json()
    assert data["batch_id"] == "HCB-2025-ASH01"
    assert "ayush_monograph_compliance" in data

def test_dashboard_metrics():
    resp = client.get("/api/v1/dashboard/metrics")
    assert resp.status_code == 200
    data = resp.json()
    assert "summary" in data
    assert "total_blockchain_txs" in data["summary"]
