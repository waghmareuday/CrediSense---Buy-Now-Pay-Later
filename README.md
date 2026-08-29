# CrediSense: B2B Buy Now, Pay Later API 🚀

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://credisense-buynowpaylater.vercel.app/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]()
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)]()
[![XGBoost](https://img.shields.io/badge/Machine_Learning-XGBoost-F37626?style=for-the-badge)]()

CrediSense is a robust, microservices-based FinTech platform that provides real-time B2B **Buy Now, Pay Later (BNPL)** credit risk assessments for e-commerce merchants.

Unlike standard consumer-facing lending apps, CrediSense acts as an **API Gateway**, allowing external e-commerce platforms to request instant split-payment decisions based on applicant financial history and cart telemetry. 

## ✨ Key Features

- **Two-Stage Risk Engine:** Filters transactions via lightning-fast fraud heuristics (VPN detection, cart metadata) before executing heavy ML model inference to save compute costs.
- **XGBoost Credit Classifier:** Evaluates default probability by analyzing 6 core financial indicators (Debt-to-Income, Active Loans, Income, etc.), trained on over 300,000+ historical records.
- **Explainable AI (SHAP):** Fully compliant with FinTech regulations (ECOA / GDPR Art. 22). The platform exposes SHAP (SHapley Additive exPlanations) values to explain exactly *why* a customer was approved or declined.
- **Dynamic Decision Tiers:** Instead of binary Approve/Decline responses, the model calculates dynamic thresholds to offer high-risk customers a **Counter-Offer** (e.g., 50% upfront down-payment).
- **Merchant Sandbox:** A stunning React dashboard allowing developers to simulate API payloads, read documentation, and monitor live application SHAP metrics.

---

## 🏗️ Architecture

The platform is split into a **3-tier microservice architecture**, communicating via RESTful APIs and secured by merchant API keys.

1. **The Merchant Sandbox (Frontend):** Built with React + Vite. Deployed on **Vercel**.
2. **The API Gateway (Backend):** Built with Node.js + Express. Handles API key authentication, routes telemetry data, and logs decisions to a **PostgreSQL (Supabase)** database. Deployed on **Render**.
3. **The Risk Engine (ML Service):** Built with Python + FastAPI. Houses the compiled XGBoost model (`.pkl`) and Scaler. Executes inference and SHAP calculations in sub-50ms. Deployed on **Render (Docker)**.

---

## 🚀 API Documentation

Merchants integrate with CrediSense by making a single `POST` request to the backend Gateway from their checkout flow.

**POST** `/api/checkout`
```json
// Request Headers:
{ "x-api-key": "cs_live_your_secret_key" }

// Request Body:
{
  "customer_identity": {
    "age": 28,
    "income": 850000,
    "credit_score": 720,
    "months_employed": 24,
    "num_active_loans": 1,
    "debt_to_income_ratio": 0.3
  },
  "cart_data": {
    "total_value": 125000,
    "items": [{ "name": "MacBook Pro M3", "price": 125000 }]
  },
  "telemetry": {
    "ip_address": "192.168.1.1",
    "vpn_detected": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "decision": "APPROVED", // Or DECLINED, or COUNTER_OFFER
  "transaction_id": 42,
  "message": "Your BNPL request was approved!"
}
```

---

## 🛠️ Local Development Setup

To run the entire microservices architecture locally, you will need 3 separate terminal windows.

### 1. Database & Backend
```bash
cd backend
npm install
# Set DATABASE_URL and ML_SERVICE_URL in your .env
npm start
```

### 2. Machine Learning API
```bash
cd ml-service
python -m venv venv
source venv/Scripts/activate # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Frontend Sandbox
```bash
cd frontend
npm install
npm run dev
```

---

*Designed and developed by [Uday Waghmare](https://github.com/waghmareuday).*
