import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score


from sklearn.ensemble import RandomForestClassifier

import xgboost as xgb



def load_and_preprocess_data():
    #Load the dataset
    data = pd.read_csv("creditcard.csv")

    print(data.head(15))
    print(data.describe())
    print(data.info())
    print(data.shape)
    print("Checking for null values :",data.isnull().sum())  #Check for missing values
    print(data['Class'].value_counts())
    print(data["Amount"])
    print(data["Amount"].values)


    # clean dataset : no missing values
    # very less fraud cases : imbalanced dataset

    # now we will scale the Amount and Time columns
    scaler = StandardScaler()
    data['scaled_Amount'] = scaler.fit_transform(data["Amount"].values.reshape(-1, 1))
    data["scaled_Time"] = scaler.fit_transform(data["Time"].values.reshape(-1,1))


    data.drop(['Time', 'Amount'], axis=1, inplace=True)
    print("Scaled data", data.head())

    # now spliting the data into features and target

    X = data.drop(["Class"], axis=1)
    y = data["Class"]

    # spliting the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    print("\nData has been preprocessed and split.")
    print(f"Training set shape: {X_train.shape}")
    print(f"Testing set shape: {X_test.shape}")
    print(f"Y trainf set shape: {y_test.shape}")

    return X_train, X_test, y_test, y_train



def train_lr_model(X_train, y_train, y_test):
    model = LogisticRegression()
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    print("\nLogistic Regression Classification Report:")
    print(classification_report(y_test, y_pred, target_names=['Legitimate (0)', 'Fraud (1)']))

def rf_model_train(X_train, y_train, y_test):
    print("\n--- Training Advanced Model: Random Forest ---")
    model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    print("\nRandom Forest Classification Report:")
    print(classification_report(y_test, y_pred, target_names=['Legitimate (0)', 'Fraud (1)']))
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))


def xgb_model_train(X_train, y_train, y_test):
    print("\n--- Training Advanced Model: XGBoost ---")

    # It tells the models to pay much more attention to the rare 'fraud' class
    scale_pos_weight = y_train.value_counts()[0] / y_train.value_counts()[1]

    model = xgb.XGBClassifier(
    objective='binary:logistic',
    scale_pos_weight=scale_pos_weight,
    use_label_encoder=False,
    eval_metric='logloss',
    random_state=42

)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    print("\nXGBoost Classification Report:")
    print(classification_report(y_test, y_pred, target_names=['Legitimate (0)', 'Fraud (1)']))
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))


if __name__ == "__main__":
   X_train, X_test, y_test, y_train =  load_and_preprocess_data()
   train_lr_model(X_train, y_train, y_test)
   rf_model_train(X_train, y_train, y_test)
   xgb_model_train(X_train, y_train, y_test)
