# 01_preprocess_data.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib # Used for saving python objects

print("--- Starting Data Preprocessing ---")

# 1. Load the dataset
data = pd.read_csv("creditcard.csv")

# 2. scale the amount and time columns, the v features V1 to V28 are already scaled
scaler = StandardScaler()
data['scaled_Amount'] = scaler.fit_transform(data["Amount"].values.reshape(-1, 1))
data["scaled_Time"] = scaler.fit_transform(data["Time"].values.reshape(-1,1))
data.drop(['Time', 'Amount'], axis=1, inplace=True)

# 3. Split data into features (X) and target (y)
X = data.drop(["Class"], axis=1)
y = data["Class"]

# 4. Split into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# 5. Save the processed data and the scaler
print("Saving processed data files...")
joblib.dump(X_train, 'data/X_train.pkl')
joblib.dump(X_test, 'data/X_test.pkl')
joblib.dump(y_train, 'data/y_train.pkl')
joblib.dump(y_test, 'data/y_test.pkl')

# CRITICAL: Save the scaler object. We will need it to process new, incoming data later.
joblib.dump(scaler, 'models/scaler.pkl')

print("--- Data Preprocessing Complete ---")
