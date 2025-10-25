# 02_train_model.py
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
import xgboost as xgb
from sklearn.metrics import classification_report
import joblib

print("--- Starting Model Training ---")

# 1. Load the preprocessed data
X_train = joblib.load('data/X_train.pkl')
y_train = joblib.load('data/y_train.pkl')
X_test = joblib.load('data/X_test.pkl')
y_test = joblib.load('data/y_test.pkl')

# 2. Define functions to train and evaluate models

def train_lr_model(X_train, y_train, X_test, y_test):
    print("Training Logistic Regression...")
    model = LogisticRegression(max_iter=1000, random_state=42)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    report = classification_report(y_test, y_pred, target_names=['Legit', 'Fraud'], output_dict=True)
    return model, report

def train_rf_model(X_train, y_train, X_test, y_test):
    print("Training Random Forest...")
    model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    report = classification_report(y_test, y_pred, target_names=['Legit', 'Fraud'], output_dict=True)
    return model, report

def train_xgb_model(X_train, y_train, X_test, y_test):
    print("Training XGBoost...")
    scale_pos_weight = y_train.value_counts()[0] / y_train.value_counts()[1]
    model = xgb.XGBClassifier(
        objective='binary:logistic', scale_pos_weight=scale_pos_weight,
        use_label_encoder=False, eval_metric='logloss', random_state=42
    )
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    report = classification_report(y_test, y_pred, target_names=['Legit', 'Fraud'], output_dict=True)
    return model, report

# --- Main Training and Selection Logic ---
if __name__ == "__main__":
    # Train all models
    lr_model, lr_report = train_lr_model(X_train, y_train, X_test, y_test)
    rf_model, rf_report = train_rf_model(X_train, y_train, X_test, y_test)
    xgb_model, xgb_report = train_xgb_model(X_train, y_train, X_test, y_test)

    # Print a summary for comparison
    print(lr_report)
    print(rf_report)
    print(xgb_report)
    print("\n--- Model Comparison (Fraud Recall) ---")
    print(f"Logistic Regression: {lr_report['Fraud']['recall']:.4f}")
    print(f"Random Forest: {rf_report['Fraud']['recall']:.4f}")
    print(f"XGBoost: {xgb_report['Fraud']['recall']:.4f}")

    # Select the best models based on Fraud Recall



    best_recall = xgb_report['Fraud']['recall']
    best_model = xgb_model

    # Save the single best models
    if best_model:
        print(f"\nBest models is {type(best_model).__name__} with a fraud recall of {best_recall:.4f}")
        joblib.dump(best_model, 'models/fraud_detection_model.pkl')
        print("Best models saved to 'models/fraud_detection_model.pkl'")

    print("\n--- Model Training Complete ---")
