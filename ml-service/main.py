from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import joblib
import json
import shap
import numpy as np

app = FastAPI(title="BNPL Risk ML Service")

# Load artifacts
try:
    model = joblib.load('xgboost_model.pkl')
    scaler = joblib.load('scaler.pkl')
    with open('feature_names.json', 'r') as f:
        feature_names = json.load(f)
        
    # Initialize SHAP explainer
    explainer = shap.TreeExplainer(model)
except Exception as e:
    print(f"Warning: Could not load model artifacts. Error: {e}")
    model = None
    scaler = None
    feature_names = None
    explainer = None

from typing import List, Optional

class CustomerIdentity(BaseModel):
    first_name: Optional[str] = "Unknown"
    age: float
    income: float
    credit_score: float
    months_employed: float
    num_active_loans: float
    debt_to_income_ratio: float

class AddressData(BaseModel):
    billing_zip: str = ""
    shipping_zip: str = ""

class CartItem(BaseModel):
    name: str = ""
    category: str = ""
    price: float = 0

class CartData(BaseModel):
    total_value: float
    currency: str = "INR"
    items: List[CartItem] = []

class Telemetry(BaseModel):
    ip_address: str = ""
    vpn_detected: bool = False

class B2BPayload(BaseModel):
    customer_identity: CustomerIdentity
    address_data: AddressData
    cart_data: CartData
    telemetry: Telemetry

@app.post("/predict")
async def predict(data: B2BPayload):
    if not model or not scaler or not feature_names:
        raise HTTPException(status_code=500, detail="Model artifacts not loaded. Please run train.py first.")
        
    # ==========================================
    # STAGE 1: RULE-BASED FRAUD ENGINE
    # ==========================================
    fraud_flags = []
    if data.telemetry.vpn_detected:
        fraud_flags.append("High-risk IP routing (VPN/Proxy detected)")
    if data.address_data.billing_zip and data.address_data.shipping_zip and data.address_data.billing_zip != data.address_data.shipping_zip:
        fraud_flags.append("Billing and Shipping address mismatch")
    
    # If severe fraud signals, hard decline immediately
    if len(fraud_flags) >= 2 or data.telemetry.vpn_detected:
        return {
            "decision": "DECLINED",
            "risk_probability": 0.99,
            "fraud_flags": fraud_flags,
            "shap_explanations": [{"feature": "Fraud Engine", "value": 1, "impact": 9.99}]
        }

    # ==========================================
    # STAGE 2: XGBOOST CREDIT ENGINE
    # ==========================================
    # Extract just the credit features required by the Kaggle-trained XGBoost model
    ml_input_dict = data.customer_identity.dict()
    ml_input_dict['loan_amount'] = data.cart_data.total_value
    
    input_data = pd.DataFrame([ml_input_dict])
    
    # Ensure correct order
    input_data = input_data[feature_names]
    
    # Scale features
    input_scaled = scaler.transform(input_data)
    input_scaled_df = pd.DataFrame(input_scaled, columns=feature_names)
    
    # Predict
    prob = model.predict_proba(input_scaled_df)[0][1]
    
    # Decision boundaries
    if prob > 0.40:
        decision = "DECLINED"
    elif prob > 0.30:
        decision = "COUNTER_OFFER"
    else:
        decision = "APPROVED"
    
    # Calculate SHAP values
    shap_values = explainer.shap_values(input_scaled_df)
    
    # Format SHAP values for frontend
    shap_reasons = []
    # Note: explainer.shap_values for binary classification sometimes returns a list of arrays (one per class)
    # or a single array depending on the xgboost version and shap explainer type.
    # We take the values for class 1 if it's a list.
    sv = shap_values[1] if isinstance(shap_values, list) else shap_values
    
    for i, feature in enumerate(feature_names):
        shap_reasons.append({
            "feature": feature,
            "value": float(input_data.iloc[0][feature]),
            "impact": float(sv[0][i])
        })
        
    # Sort by absolute impact
    shap_reasons.sort(key=lambda x: abs(x["impact"]), reverse=True)
    
    return {
        "decision": decision,
        "risk_probability": float(prob),
        "fraud_flags": fraud_flags,
        "shap_explanations": shap_reasons
    }

@app.get("/health")
def health():
    return {"status": "ok"}
