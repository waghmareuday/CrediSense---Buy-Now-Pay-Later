import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import average_precision_score, f1_score, classification_report
import xgboost as xgb
import joblib
import json
import os

def load_and_preprocess_data():
    print("Loading Kaggle Home Credit dataset...")
    df = pd.read_csv('application_train.csv')
    
    # We want to map real columns to the features our frontend expects
    # Target variable is 'TARGET' (1 = default, 0 = repayment)
    
    print("Engineering features to match the checkout system...")
    
    # Age (DAYS_BIRTH is negative days)
    df['age'] = df['DAYS_BIRTH'] / -365.0
    
    # Income
    df['income'] = df['AMT_INCOME_TOTAL']
    
    # Loan Amount
    df['loan_amount'] = df['AMT_CREDIT']
    
    # Credit Score (We map EXT_SOURCE_2 which is 0-1 to a 300-850 scale)
    # Fill missing EXT_SOURCE_2 with median
    ext_src_2_median = df['EXT_SOURCE_2'].median()
    df['EXT_SOURCE_2'] = df['EXT_SOURCE_2'].fillna(ext_src_2_median)
    df['credit_score'] = (df['EXT_SOURCE_2'] * 550) + 300
    
    # Months Employed (DAYS_EMPLOYED is negative days. 365243 means unemployed/pensioner)
    df['DAYS_EMPLOYED'] = df['DAYS_EMPLOYED'].replace(365243, np.nan)
    df['DAYS_EMPLOYED'] = df['DAYS_EMPLOYED'].fillna(df['DAYS_EMPLOYED'].median())
    df['months_employed'] = df['DAYS_EMPLOYED'] / -30.0
    
    # Number of Active Loans 
    # (application_train doesn't have active loans from bureau. We'll use AMT_REQ_CREDIT_BUREAU_YEAR as a proxy)
    df['num_active_loans'] = df['AMT_REQ_CREDIT_BUREAU_YEAR'].fillna(0)
    
    # Debt to Income Ratio
    df['AMT_ANNUITY'] = df['AMT_ANNUITY'].fillna(df['AMT_ANNUITY'].median())
    df['debt_to_income_ratio'] = df['AMT_ANNUITY'] / df['AMT_INCOME_TOTAL']
    
    features = [
        'age', 'income', 'loan_amount', 'credit_score', 
        'months_employed', 'num_active_loans', 'debt_to_income_ratio'
    ]
    
    X = df[features]
    y = df['TARGET']
    
    # Handle any remaining NaNs
    X = X.fillna(X.median())
    
    return X, y

def evaluate_model(name, model, X_test, y_test):
    if hasattr(model, 'predict_proba'):
        y_prob = model.predict_proba(X_test)[:, 1]
    else:
        y_prob = model.predict(X_test)
        
    y_pred = model.predict(X_test)
    
    pr_auc = average_precision_score(y_test, y_prob)
    f1 = f1_score(y_test, y_pred)
    
    print(f"--- {name} ---")
    print(f"PR-AUC: {pr_auc:.4f}")
    print(f"F1-Score: {f1:.4f}")
    print(classification_report(y_test, y_pred))
    print()

def main():
    if not os.path.exists('application_train.csv'):
        print("Error: application_train.csv not found.")
        return
        
    X, y = load_and_preprocess_data()
    print(f"Dataset shape: {X.shape}")
    print(f"Class distribution: 0={sum(y==0)}, 1={sum(y==1)}")
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Scale numerical features
    print("Scaling features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # 1. Logistic Regression (Baseline - Interpretable)
    print("Training Logistic Regression...")
    lr = LogisticRegression(class_weight='balanced', random_state=42)
    lr.fit(X_train_scaled, y_train)
    evaluate_model("Logistic Regression", lr, X_test_scaled, y_test)
    
    # 2. Random Forest (Variance Reducer)
    print("Training Random Forest...")
    rf = RandomForestClassifier(class_weight='balanced', random_state=42, n_estimators=50, max_depth=10, n_jobs=-1)
    rf.fit(X_train_scaled, y_train)
    evaluate_model("Random Forest", rf, X_test_scaled, y_test)
    
    # 3. XGBoost (Production Engine)
    neg_count = sum(y_train == 0)
    pos_count = sum(y_train == 1)
    scale_pos_weight = neg_count / pos_count
    print(f"Training XGBoost (scale_pos_weight={scale_pos_weight:.2f})...")
    
    xgb_model = xgb.XGBClassifier(
        scale_pos_weight=scale_pos_weight,
        learning_rate=0.1,
        max_depth=6,
        n_estimators=150,
        random_state=42,
        eval_metric='logloss',
        n_jobs=-1
    )
    
    X_train_df = pd.DataFrame(X_train_scaled, columns=X.columns)
    X_test_df = pd.DataFrame(X_test_scaled, columns=X.columns)
    
    xgb_model.fit(X_train_df, y_train)
    evaluate_model("XGBoost", xgb_model, X_test_df, y_test)
    
    # Export XGBoost model and scaler
    print("Exporting model and scaler...")
    joblib.dump(xgb_model, 'xgboost_model.pkl')
    joblib.dump(scaler, 'scaler.pkl')
    
    # Save feature names to ensure order consistency
    with open('feature_names.json', 'w') as f:
        json.dump(list(X.columns), f)
        
    print("Training pipeline complete.")

if __name__ == "__main__":
    main()
