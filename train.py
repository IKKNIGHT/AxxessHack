import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score
from sklearn.ensemble import RandomForestClassifier
from imblearn.over_sampling import SMOTE

# 1. Load Dataset
DATA_PATH = "database/Framingham Dataset.csv"
try:
    df = pd.read_csv(DATA_PATH)
    print(f"Dataset Loaded. Shape: {df.shape}")
except FileNotFoundError:
    print(f"Error: Could not find {DATA_PATH}.")
    exit()

# 2. Remove Leakage Columns
leakage_columns = [
    'RANDID', 'TIME', 'TIMEAP', 'TIMEMI', 'TIMEMIFC', 'TIMECHD',
    'TIMESTRK', 'TIMECVD', 'TIMEDTH', 'TIMEHYP',
    'DEATH', 'ANGINA', 'HOSPMI', 'MI_FCHD', 'ANYCHD', 'STROKE'
]
df = df.drop(columns=[col for col in leakage_columns if col in df.columns])

# 3. Handle Missing Values
df = df.fillna(df.median())

# 4. Define Features and Target
TARGET = "CVD"
X = df.drop(columns=[TARGET])
y = df[TARGET]
feature_names = X.columns.tolist()

# 5. Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

# 6. Apply SMOTE
smote = SMOTE(random_state=42)
X_train_res, y_train_res = smote.fit_resample(X_train, y_train)

# 7. Train Random Forest
model = RandomForestClassifier(
    n_estimators=400,
    max_depth=None,
    min_samples_split=5,
    random_state=42
)
model.fit(X_train_res, y_train_res)
print("Model training complete.")

# 8. Evaluation
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]
print("\nClassification Report:\n", classification_report(y_test, y_pred))
print("ROC-AUC Score:", round(roc_auc_score(y_test, y_prob), 4))

# 9. Save Model & Feature Names
joblib.dump(model, "framingham_rf_model.pkl")
joblib.dump(feature_names, "feature_names.pkl")
print("\nModel and features saved successfully.")

# 10. Feature Importance Plot
importances = model.feature_importances_
indices = np.argsort(importances)[::-1]
plt.figure(figsize=(10, 6))
plt.title("Feature Importance")
plt.bar(range(len(importances)), importances[indices])
plt.xticks(range(len(importances)), np.array(feature_names)[indices], rotation=90)
plt.tight_layout()
plt.savefig("feature_importance.png")
print("Importance graph saved as 'feature_importance.png'")