# HerbChain AI – Blockchain-Based Botanical Traceability System for Ayurvedic Herbs

**Smart India Hackathon 2025 Flagship Solution | Ministry of AYUSH**

 HerbChain AI is an enterprise-ready, blockchain-powered full-stack web platform engineered to deliver end-to-end traceability for Ayurvedic medicinal botanicals. From wild collectors and organic farmers to certified testing laboratories, pharmaceutical manufacturers, and retail consumers, HerbChain AI ensures **transparency, authenticity, anti-counterfeiting, and immutable record management**.

---

## 🌟 Key Capabilities & Features

1. **Polygon Blockchain Provenance**:
   - Solidity smart contract (`HerbChainTraceability.sol`) records every harvest, lab assay, cold transport checkpoint, and packaging event on-chain.
2. **AI Vision & Phytochemical Quality Engine**:
   - Leaf/root vision inspector to detect adulterated herb images.
   - Machine Learning regressor forecasting active compound potency (Withanolides %, Curcumin %, Eugenol %) based on harvest region & drying techniques.
3. **Geo-Tagging & Satellite Verification**:
   - GPS coordinate locking at harvest points to protect protected forest biodiversity zones.
4. **Decentralized IPFS Storage**:
   - High-resolution lab reports, HPLC chemical assays, and farm licenses uploaded to IPFS with CIDs stored on Polygon.
5. **Dynamic QR Code Generation & Public Verification**:
   - Every packaging batch receives a vector QR code. Scanning opens a public verification page displaying the complete supply chain timeline.
6. **Multi-Role Portals**:
   - Dedicated dashboards for **Admin, Farmers, Wild Collectors, AYUSH Labs, Transport Agencies, Manufacturers, and Consumers**.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion, Recharts, Leaflet Maps, Ethers.js / MetaMask Integration.
- **Backend**: FastAPI (Python 3.11), SQLAlchemy ORM, Pydantic v2, JWT Auth with passlib/bcrypt, NumPy, Scikit-learn.
- **Database**: PostgreSQL (Production) / SQLite (Zero-config local fallback).
- **Blockchain**: Solidity (`0.8.20`), Hardhat, Polygon Amoy Testnet (Chain ID `80002`).
- **Storage & QR**: IPFS Gateway, Vector QR Code Generator.
- **DevOps**: Docker, Docker Compose, GitHub Actions.

---

## 📂 Repository Structure

```
vanasetu/
├── backend/                  # FastAPI Python Application
│   ├── app/
│   │   ├── api/             # REST Routers (auth, herbs, collections, lab, transport, qr, ai, etc.)
│   │   ├── core/            # Config, security (JWT), database engine
│   │   ├── models/          # SQLAlchemy Models (12 tables)
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   ├── services/        # AI Service, IPFS connector, Web3 bridge, QR generator
│   │   ├── seed.py          # Pre-populated AYUSH database seed script
│   │   └── main.py          # FastAPI application entrypoint
│   ├── Dockerfile
│   └── requirements.txt
├── contracts/                # Polygon Solidity Smart Contracts
│   ├── HerbChainTraceability.sol
│   ├── hardhat.config.js
│   └── scripts/deploy.js
├── frontend/                 # Next.js 15 Web Application
│   ├── src/
│   │   ├── app/             # App Router Pages (Home, Verify, Dashboards, Explorer, Analytics)
│   │   ├── components/      # UI Navbar, Footer, QRModal, MapComponent, AIPanelWidget
│   │   ├── lib/             # API client & Web3 MetaMask connector
│   │   └── types/
│   ├── Dockerfile
│   ├── tailwind.config.ts
│   └── package.json
├── docker-compose.yml        # Multi-container orchestration (DB, Backend, Frontend)
├── .env.example
└── README.md
```

---

## ⚡ Quick Start Guide (Local Development)

### Option A: Using Docker Compose (Recommended)

```bash
# 1. Clone & navigate to project root
cd vanasetu

# 2. Start PostgreSQL, FastAPI Backend, and Next.js Frontend
docker-compose up --build
```
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API & Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Option B: Manual Setup

#### 1. Start FastAPI Backend
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# Install dependencies
pip install -r requirements.txt

# Run server with auto seed
uvicorn app.main:app --reload --port 8000
```

#### 2. Start Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Smart Contract Deployment (Polygon)

To compile and deploy smart contracts to Polygon Amoy Testnet:

```bash
cd contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network polygonAmoy
```

---

## 🔗 Key REST API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register new supply chain user (Farmer, Lab, Manufacturer) |
| `POST` | `/api/v1/auth/login` | Login and receive JWT bearer token |
| `GET` | `/api/v1/herbs` | List AYUSH botanical species catalog |
| `POST` | `/api/v1/collections` | Log new harvest batch & trigger Polygon transaction |
| `POST` | `/api/v1/lab` | Upload certified chemical assay & heavy metal test |
| `POST` | `/api/v1/transport` | Update cold-chain vehicle telemetry (Temp/Humidity) |
| `POST` | `/api/v1/manufacturers/batch` | Mint final Ayurvedic medicine batch & generate QR |
| `GET` | `/api/v1/qr/verify/{batch_id}` | Public endpoint for batch history lookup |
| `POST` | `/api/v1/ai/detect-fake-herb` | AI vision leaf inspection scan |
| `POST` | `/api/v1/ai/predict-quality` | Phytochemical active compound predictor |

---

## 🏆 Smart India Hackathon 2025 Impact

- **Anti-Counterfeiting**: Eliminates species substitution in high-value herbs like Ashwagandha and Wild Turmeric.
- **Fair Value for Farmers**: Connects indigenous tribal wild collectors directly with pharmaceutical buyers via verified blockchain records.
- **UN SDG Alignment**: Supports SDG 3 (Good Health & Well-being), SDG 12 (Responsible Production), and SDG 15 (Forest Conservation).

---
*Developed for Ministry of AYUSH • Smart India Hackathon 2025*
