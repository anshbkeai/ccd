# feature_pipeline.py
import pandas as pd
import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import joblib
from datetime import datetime
from datetime import timezone
import json

# --- Part 1: Feature Engineering ---
# This function extracts flat, numerical features from the complex JSON

# In feature_pipeline.py

# In feature-pipeline.py
# In feature-pipeline.py

# In feature-pipeline.py

# def create_features_from_json(transaction_json):
#     """
#     Takes the raw transaction JSON and engineers a flat feature set.
#     This version is robust and handles multiple date formats.
#     """
#     features = {}

#     current_event = transaction_json['currentTransctionEvent']
#     features['Amount'] = current_event['paymentInfo']['instructedAmount']['amount']

#     # --- ROBUST DATE PARSING LOGIC ---
#     raw_date = current_event['transactionDate']
#     try:
#         # Try to treat it as a number (Unix timestamp) first
#         transaction_date = datetime.fromtimestamp(float(raw_date))
#     except (ValueError, TypeError):
#         # If that fails, it must be an ISO string
#         transaction_date = datetime.fromisoformat(raw_date.replace('Z', '+00:00'))

#     start_date = datetime(2025, 1, 1) # A fixed point for calculating 'Time'
#     features['Time'] = (transaction_date - start_date).total_seconds()

#     debtor_history = transaction_json['modelDebtor']['last10TransctionEventsDebits']
#     if debtor_history:
#         amounts = [t['paymentInfo']['instructedAmount']['amount'] for t in debtor_history]
#         features['avg_debit_amount_last_10'] = np.mean(amounts)
#         features['std_debit_amount_last_10'] = np.std(amounts)
#         features['num_debits_last_10'] = len(amounts)

#         # --- APPLY ROBUST PARSING TO HISTORICAL DATE AS WELL ---
#         raw_last_date = debtor_history[0]['transactionDate']
#         try:
#             last_txn_date = datetime.fromtimestamp(float(raw_last_date))
#         except (ValueError, TypeError):
#             last_txn_date = datetime.fromisoformat(raw_last_date.replace('Z', '+00:00'))

#         features['time_since_last_debit_seconds'] = (transaction_date - last_txn_date).total_seconds()
#     else:
#         # Handle cases with no history
#         features['avg_debit_amount_last_10'] = 0
#         features['std_debit_amount_last_10'] = 0
#         features['num_debits_last_10'] = 0
#         features['time_since_last_debit_seconds'] = 3600 * 24 * 30

#     creditor_history = transaction_json['modelCreditor']['last10TransctionEventsDebits']
#     if creditor_history:
#         creditor_amounts = [t['paymentInfo']['instructedAmount']['amount'] for t in creditor_history]
#         features['avg_creditor_inflow_last_10'] = np.mean(creditor_amounts)
#         features['num_creditor_txns_last_10'] = len(creditor_amounts)
#     else:
#         features['avg_creditor_inflow_last_10'] = 0
#         features['num_creditor_txns_last_10'] = 0

#     features['hour_of_day'] = transaction_date.hour

#     num_engineered_features = len(features) - 2
#     if num_engineered_features < 28:
#         num_fillers_needed = 28 - num_engineered_features
#         for i in range(num_fillers_needed):
#             features[f'filler_feature_{i+1}'] = np.random.randn()

#     return features


# def train_and_save_simulated_pca(sample_json, n_features=28, n_samples=100):
#     """
#     Generates mock data from a sample JSON, trains a PCA models on it,
#     and saves the PCA models for later use.
#     """
#     print("--- Training a simulated PCA models ---")
#     # Generate a small dataset by varying the sample JSON
#     mock_data = []
#     for i in range(n_samples):
#         # Create small variations
#         sample_json['currentTransctionEvent']['paymentInfo']['instructedAmount']['amount'] *= (1 + np.random.normal(0, 0.1))
#         features = create_features_from_json(sample_json)
#         mock_data.append(features)

#     df = pd.DataFrame(mock_data).drop(['Time', 'Amount'], axis=1) # PCA is on engineered features only

#     # Scale the data before PCA
#     scaler = StandardScaler()
#     scaled_data = scaler.fit_transform(df)

#     # Train PCA to create the V-features
#     pca = PCA(n_components=n_features)
#     pca.fit(scaled_data)

#     # Save the PCA models and the scaler for the engineered features
#     joblib.dump(pca, 'models/simulated_pca.pkl')
#     joblib.dump(scaler, 'models/feature_engineering_scaler.pkl')
#     print("Simulated PCA models and feature scaler saved.")
#     return pca, scaler


# # --- Part 3: The Main Mediator Function ---

# def transform_json_to_model_input(transaction_json):
#     """
#     The complete pipeline: JSON -> Engineered Features -> PCA -> Model-ready Input
#     """
#     # 1. Engineer features from the raw JSON
#     engineered_features = create_features_from_json(transaction_json)

#     # 2. Separate Time/Amount from other features that need PCA
#     time_feature = engineered_features.pop('Time')
#     amount_feature = engineered_features.pop('Amount')

#     # 3. Load our simulated PCA models and its corresponding scaler
#     try:
#         pca = joblib.load('models/simulated_pca.pkl')
#         feature_scaler = joblib.load('models/feature_engineering_scaler.pkl')
#     except FileNotFoundError:
#         print("PCA models not found. Run train_and_save_simulated_pca first.")
#         return None

#     # 4. Scale and transform the engineered features
#     engineered_df = pd.DataFrame([engineered_features])
#     scaled_engineered_features = feature_scaler.transform(engineered_df)
#     v_features = pca.transform(scaled_engineered_features)

#     # 5. Assemble the final DataFrame for the fraud models
#     v_feature_names = [f'V{i+1}' for i in range(v_features.shape[1])]
#     final_df = pd.DataFrame(v_features, columns=v_feature_names)

#     # Add back the Time and Amount (these will be scaled later by the API)
#     final_df['Time'] = time_feature
#     final_df['Amount'] = amount_feature

#     return final_df

def create_features_from_json(transaction_json):
    """
    Takes the raw transaction JSON and engineers a flat feature set.
    This version is robust and handles multiple date formats.
    """
    features = {}

    current_event = transaction_json['currentTransctionEvent']
    features['Amount'] = current_event['paymentInfo']['instructedAmount']['amount']

    # --- ROBUST DATE PARSING LOGIC ---
    raw_date = current_event['transactionDate']
    try:
        # Try to treat it as a number (Unix timestamp) first
        transaction_date = datetime.fromtimestamp(float(raw_date), tz=timezone.utc)
    except (ValueError, TypeError):
        # If that fails, it must be an ISO string
        transaction_date = datetime.fromisoformat(raw_date.replace('Z', '+00:00'))

    # Make start_date timezone-aware to match transaction_date
    start_date = datetime(2025, 1, 1, tzinfo=timezone.utc)
    features['Time'] = (transaction_date - start_date).total_seconds()

    debtor_history = transaction_json['modelDebtor']['last10TransctionEventsDebits']
    if debtor_history:
        amounts = [t['paymentInfo']['instructedAmount']['amount'] for t in debtor_history]
        features['avg_debit_amount_last_10'] = np.mean(amounts)
        features['std_debit_amount_last_10'] = np.std(amounts)
        features['num_debits_last_10'] = len(amounts)

        # --- APPLY ROBUST PARSING TO HISTORICAL DATE AS WELL ---
        raw_last_date = debtor_history[0]['transactionDate']
        try:
            last_txn_date = datetime.fromtimestamp(float(raw_last_date), tz=timezone.utc)
        except (ValueError, TypeError):
            last_txn_date = datetime.fromisoformat(raw_last_date.replace('Z', '+00:00'))

        features['time_since_last_debit_seconds'] = (transaction_date - last_txn_date).total_seconds()
    else:
        # Handle cases with no history
        features['avg_debit_amount_last_10'] = 0
        features['std_debit_amount_last_10'] = 0
        features['num_debits_last_10'] = 0
        features['time_since_last_debit_seconds'] = 3600 * 24 * 30

    creditor_history = transaction_json['modelCreditor']['last10TransctionEventsDebits']
    if creditor_history:
        creditor_amounts = [t['paymentInfo']['instructedAmount']['amount'] for t in creditor_history]
        features['avg_creditor_inflow_last_10'] = np.mean(creditor_amounts)
        features['num_creditor_txns_last_10'] = len(creditor_amounts)
    else:
        features['avg_creditor_inflow_last_10'] = 0
        features['num_creditor_txns_last_10'] = 0

    features['hour_of_day'] = transaction_date.hour

    num_engineered_features = len(features) - 2
    if num_engineered_features < 28:
        num_fillers_needed = 28 - num_engineered_features
        for i in range(num_fillers_needed):
            features[f'filler_feature_{i+1}'] = np.random.randn()

    return features


def train_and_save_simulated_pca(sample_json, n_features=28, n_samples=100):
    """
    Generates mock data from a sample JSON, trains a PCA models on it,
    and saves the PCA models for later use.
    """
    print("--- Training a simulated PCA models ---")
    # Generate a small dataset by varying the sample JSON
    mock_data = []
    for i in range(n_samples):
        # Create small variations
        sample_json['currentTransctionEvent']['paymentInfo']['instructedAmount']['amount'] *= (1 + np.random.normal(0, 0.1))
        features = create_features_from_json(sample_json)
        mock_data.append(features)

    df = pd.DataFrame(mock_data).drop(['Time', 'Amount'], axis=1) # PCA is on engineered features only

    # Scale the data before PCA
    scaler = StandardScaler()
    scaled_data = scaler.fit_transform(df)

    # Train PCA to create the V-features
    pca = PCA(n_components=n_features)
    pca.fit(scaled_data)

    # Save the PCA models and the scaler for the engineered features
    joblib.dump(pca, 'models/simulated_pca.pkl')
    joblib.dump(scaler, 'models/feature_engineering_scaler.pkl')
    print("Simulated PCA models and feature scaler saved.")
    return pca, scaler


# --- Part 3: The Main Mediator Function ---

def transform_json_to_model_input(transaction_json):
    """
    The complete pipeline: JSON -> Engineered Features -> PCA -> Model-ready Input
    """
    # 1. Engineer features from the raw JSON
    engineered_features = create_features_from_json(transaction_json)

    # 2. Separate Time/Amount from other features that need PCA
    time_feature = engineered_features.pop('Time')
    amount_feature = engineered_features.pop('Amount')

    # 3. Load our simulated PCA models and its corresponding scaler
    try:
        pca = joblib.load('models/simulated_pca.pkl')
        feature_scaler = joblib.load('models/feature_engineering_scaler.pkl')
    except FileNotFoundError:
        print("PCA models not found. Run train_and_save_simulated_pca first.")
        return None

    # 4. Scale and transform the engineered features
    engineered_df = pd.DataFrame([engineered_features])
    scaled_engineered_features = feature_scaler.transform(engineered_df)
    v_features = pca.transform(scaled_engineered_features)

    # 5. Assemble the final DataFrame for the fraud models
    v_feature_names = [f'V{i+1}' for i in range(v_features.shape[1])]
    final_df = pd.DataFrame(v_features, columns=v_feature_names)

    # Add back the Time and Amount (these will be scaled later by the API)
    final_df['Time'] = time_feature
    final_df['Amount'] = amount_feature

    return final_df



if __name__ == '__main__':
    # Use your sample JSON as a template to train the PCA models
    with open('sample_transaction.json', 'r') as f:
        sample_json = json.load(f)
    train_and_save_simulated_pca(sample_json)
