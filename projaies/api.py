import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
from datetime import datetime
from datetime import timezone
import threading
import pickle
import json
import numpy as np
import os
from kafka import KafkaProducer, KafkaConsumer
from typing import Dict, List, Optional





from feature_pipeline import transform_json_to_model_input
from typing import Dict, Any


# Kafka Configuration from Environment Variables
KAFKA_BOOTSTRAP_SERVERS = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'localhost:9092').split(',')
KAFKA_CONSUMER_TOPIC = os.getenv('KAFKA_CONSUMER_TOPIC', 'model-txn')
KAFKA_PRODUCER_TOPIC = os.getenv('KAFKA_PRODUCER_TOPIC', 'model-resp-txn')
KAFKA_CONSUMER_GROUP = os.getenv('KAFKA_CONSUMER_GROUP', 'my-group')

app = FastAPI(title="Fraud Detection API", version="1.0")
# Load the trained models and scaler
model = joblib.load("models/fraud_detection_model.pkl")
scaler = joblib.load("models/scaler.pkl")

@app.get("/health")
def health_check():
    """Health check endpoint for AWS ECS"""
    return {"status": "healthy", "service": "fraud-detection-api"}


class Transaction(BaseModel):
    Time: float
    V1: float
    V2: float
    V3: float
    V4: float
    V5: float
    V6: float
    V7: float
    V8: float
    V9: float
    V10: float
    V11: float
    V12: float
    V13: float
    V14: float
    V15: float
    V16: float
    V17: float
    V18: float
    V19: float
    V20: float
    V21: float
    V22: float
    V23: float
    V24: float
    V25: float
    V26: float
    V27: float
    V28: float
    Amount: float


import numpy as np
from datetime import datetime, timezone

from datetime import datetime
from typing import Dict, List, Optional
import numpy as np

from typing import Dict, Optional
import numpy as np


def apply_rules_on_raw_json(transaction_json: dict) -> Optional[Dict]:
    """
    Applies a set of deterministic rules directly to the raw transaction JSON.
    This function is self-contained and extracts all necessary data.

    Args:
        transaction_json (dict): The complete raw JSON payload from the backend.

    Returns:
        A dictionary with the decision, or None if no rules are met.
    """

    # ============================================================================
    # CONFIGURATION CONSTANTS
    # ============================================================================
    HIGH_VALUE_THRESHOLD = 500000
    ANOMALY_STD_MULTIPLIER = 3
    MIN_HISTORY_FOR_STATS = 3
    RAPID_TRANSACTION_COUNT = 5

    # ============================================================================
    # HELPER FUNCTIONS
    # ============================================================================

    def safe_float(value, default=0.0):
        """Safely convert a value to float with fallback"""
        try:
            return float(value) if value is not None else default
        except (ValueError, TypeError):
            return default

    def extract_amounts_from_history(history):
        """Safely extract transaction amounts from history"""
        amounts = []
        for txn in history:
            try:
                amount = txn.get('paymentInfo', {}) \
                    .get('instructedAmount', {}) \
                    .get('amount')
                if amount is not None:
                    amounts.append(safe_float(amount))
            except (KeyError, TypeError, AttributeError):
                continue
        return amounts

    def calculate_statistics(amounts):
        """Calculate mean, median, and standard deviation with error handling"""
        if not amounts or len(amounts) < MIN_HISTORY_FOR_STATS:
            return 0.0, 0.0, 0.0

        try:
            mean_val = float(np.mean(amounts))
            median_val = float(np.median(amounts))
            std_val = float(np.std(amounts))
            return mean_val, median_val, std_val
        except (TypeError, ValueError):
            return 0.0, 0.0, 0.0

    def create_flag(reason, description, details=""):
        """Create a standardized flag response"""
        return {
            "flagged": True,
            "reason": reason,
            "reason_description": description,
            "details": details,
            "transactionEventId": transaction_id,
            "amount": amount,
            "currency": currency
        }

    # ============================================================================
    # DATA EXTRACTION
    # ============================================================================

    try:
        # Current transaction event
        current_event = transaction_json.get('currentTransctionEvent', {})
        if not current_event:
            return create_flag(
                "INVALID_DATA",
                "Missing transaction event data",
                "currentTransctionEvent is empty or missing"
            )

        transaction_id = current_event.get('id', 'UNKNOWN')

        # Payment information
        payment_info = current_event.get('paymentInfo', {})
        instructed_amount = payment_info.get('instructedAmount', {})
        amount = safe_float(instructed_amount.get('amount'))
        currency = instructed_amount.get('currency', 'UNKNOWN')

        # Debtor (sender) information
        model_debtor = transaction_json.get('modelDebtor', {})
        debtor_history = model_debtor.get('last10TransctionEventsDebits', [])
        if not isinstance(debtor_history, list):
            debtor_history = []

        # Creditor (receiver) information
        model_creditor = transaction_json.get('modelCreditor', {})
        creditor_history = model_creditor.get('last10TransctionEventsDebits', [])
        if not isinstance(creditor_history, list):
            creditor_history = []

    except Exception as e:
        return {
            "flagged": True,
            "reason": "PROCESSING_ERROR",
            "reason_description": f"Error extracting transaction data: {str(e)}",
            "transactionEventId": transaction_json.get('currentTransctionEvent', {}).get('id', 'UNKNOWN')
        }

    # ============================================================================
    # RULE 1: DATA VALIDITY CHECK
    # ============================================================================

    if amount <= 0:
        return create_flag(
            "INVALID_DATA",
            "Invalid or missing transaction amount",
            f"Amount value: {amount}"
        )

    # ============================================================================
    # RULE 2: HIGH-VALUE FIRST TRANSACTION
    # ============================================================================

    if len(debtor_history) == 0 and amount > HIGH_VALUE_THRESHOLD:
        return create_flag(
            "FIRST_TRANSACTION_HIGH_VALUE",
            "First transaction with unusually high amount",
            f"First transaction with amount {amount} {currency}"
        )

    # ============================================================================
    # RULE 3: HIGH-VALUE ANOMALY (Statistical Analysis)
    # ============================================================================

    if len(debtor_history) >= MIN_HISTORY_FOR_STATS:
        amounts = extract_amounts_from_history(debtor_history)

        if amounts and len(amounts) >= MIN_HISTORY_FOR_STATS:
            avg_amount, median_amount, std_amount = calculate_statistics(amounts)

            # Need meaningful standard deviation
            if std_amount > 0:
                # Check if amount exceeds mean + 3*std
                threshold_mean = avg_amount + (ANOMALY_STD_MULTIPLIER * std_amount)

                if amount > threshold_mean:
                    return create_flag(
                        "HIGH_VALUE_ANOMALY_MEAN",
                        "Transaction amount significantly exceeds historical average",
                        f"Amount {amount} exceeds threshold {threshold_mean:.2f} "
                        f"(avg: {avg_amount:.2f}, median: {median_amount:.2f}, std: {std_amount:.2f})"
                    )

                # Alternative check: amount is much higher than median
                if amount > median_amount * 5:  # 5x the median
                    return create_flag(
                        "HIGH_VALUE_ANOMALY_MEDIAN",
                        "Transaction amount is significantly higher than typical median",
                        f"Amount {amount} is {amount / median_amount:.1f}x the median "
                        f"(median: {median_amount:.2f}, avg: {avg_amount:.2f})"
                    )

    # ============================================================================
    # RULE 4: POTENTIAL MONEY MULE PATTERN (RECEIVER)
    # ============================================================================


    # ============================================================================
    # NO RULES TRIGGERED
    # ============================================================================

    return None

@app.post("/predict")
def predict(transaction: Transaction):

    #conver the incomic pydantic object to a dictonary
    transaction_data = transaction.dict()

    input_df = pd.DataFrame([transaction_data])

    input_df["scaled_Amount"] = scaler.transform(input_df[["Amount"]])
    input_df["scaled_Time"] = scaler.transform(input_df[["Time"]])
    input_df.drop(['Time', 'Amount'], axis=1, inplace=True)

    prediction = model.predict(input_df)
    prediction_proba = model.predict_proba(input_df)
    print(prediction_proba)

    return {
        "is_fraud": int(prediction[0]),
        "fraud_probability": float(prediction_proba[0][1])
    }


@app.post("/predict_real_world")
def predict_real_world(transaction_json: Dict[Any, Any]):
    """
    Receives a raw, real-world JSON transaction, transforms it, and predicts fraud.
    """
    # 1. Use the mediator to convert the raw JSON to the V-feature format
    model_input_df = transform_json_to_model_input(transaction_json)

    if model_input_df is None:
        return {"error": "Failed to process transaction."}

    # The rest of the logic is the same as your /predict endpoint

    # 2. Scale Time and Amount using the ORIGINAL scaler for the final models
    model_input_df['scaled_Amount'] = scaler.transform(model_input_df[['Amount']])
    model_input_df['scaled_Time'] = scaler.transform(model_input_df[['Time']])
    model_input_df.drop(['Time', 'Amount'], axis=1, inplace=True)

    # 3. Ensure column order
    expected_order = model.get_booster().feature_names
    model_input_df = model_input_df[expected_order]

    # 4. Predict
    prediction = model.predict(model_input_df)[0]
    probability = model.predict_proba(model_input_df)[0][1]

    return {
        "is_fraud": bool(prediction),
        "fraud_probability": float(probability),
        "transaction_id": transaction_json['currentTransctionEvent']['id']
    }


producer = KafkaProducer(
    bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

def consume_and_predict():
    consumer = KafkaConsumer(
        KAFKA_CONSUMER_TOPIC,
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        value_deserializer=lambda v: json.loads(v.decode('utf-8')),
        group_id=KAFKA_CONSUMER_GROUP,
    )
    print(f"🚀 Kafka consumer started and listening to '{KAFKA_CONSUMER_TOPIC}'...")

    for msg in consumer:
        transaction = msg.value
        #print(f"\n📩 Received transaction: {transaction}")

        # Preprocess transaction
        model_input_df = transform_json_to_model_input(transaction)

        if model_input_df is None:
            return {"error": "Failed to process transaction."}

        # The rest of the logic is the same as your /predict endpoint

        # 2. Scale Time and Amount using the ORIGINAL scaler for the final models
        model_input_df['scaled_Amount'] = scaler.transform(model_input_df[['Amount']])
        model_input_df['scaled_Time'] = scaler.transform(model_input_df[['Time']])
        model_input_df.drop(['Time', 'Amount'], axis=1, inplace=True)

        # 3. Ensure column order
        expected_order = model.get_booster().feature_names
        model_input_df = model_input_df[expected_order]

        # 4. Predict
        prediction = model.predict(model_input_df)[0]
        probability = model.predict_proba(model_input_df)[0][1]

        model_response =  {
            "flagged": bool(prediction),
            "reason": "Test ",
            "transactionEventId": transaction['currentTransctionEvent']['id']
        }

        rule_repsonse = apply_rules_on_raw_json(transaction)

        if rule_repsonse is not None:
            final_decision = rule_repsonse
        else:
            # 3. Only if the rule engine cleared it, run the ML model.
            # ... (feature engineering and ML prediction logic here) ...
            # model_response = ...
            final_decision = model_response

        transaction['currentTransctionEvent']['flaged'] = bool(final_decision['flagged'])
        transaction['currentTransctionEvent']['reason'] = (final_decision['reason'])

        print(json.dumps(model_response, indent=4))
        print(json.dumps(rule_repsonse, indent=4))

        print(transaction['currentTransctionEvent'])

        event = transaction['currentTransctionEvent']
        event['transactionDate'] = datetime.now(timezone.utc).isoformat()

        producer.send(KAFKA_PRODUCER_TOPIC, value=event)


@app.on_event("startup")
def startup_event():
    consumer_thread = threading.Thread(target=consume_and_predict, daemon=True)
    consumer_thread.start()
    print("✅ Kafka consumer thread started on startup")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
