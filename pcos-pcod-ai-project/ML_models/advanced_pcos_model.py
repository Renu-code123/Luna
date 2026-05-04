import pandas as pd
import numpy as np
import os
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score, GridSearchCV
from sklearn.preprocessing import StandardScaler, RobustScaler
from sklearn.ensemble import RandomForestClassifier, StackingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, roc_auc_score, f1_score
from xgboost import XGBClassifier

# Configuration
DATASET_PATH = '../Dataset/PCOS_data.csv'
MODEL_OUTPUT_PATH = 'models/advanced_pcos_model.joblib'
FEATURES_OUTPUT_PATH = 'models/advanced_pcos_features.joblib'

def load_and_clean_data(path):
    print(f"Loading data from {path}...")
    df = pd.read_csv(path)
    
    # 1. Clean Column Names (Remove extra spaces and special characters)
    df.columns = df.columns.str.strip()
    df.columns = df.columns.str.replace(r'\s+', '_', regex=True)
    df.columns = df.columns.str.replace(r'[^\w\s]', '', regex=True)
    
    # Identify target
    target_col = 'PCOS_YN'
    if 'PCOS_YN' not in df.columns:
        # Try to find target if name changed
        possible_targets = [c for c in df.columns if 'PCOS' in c.upper()]
        if possible_targets:
            target_col = possible_targets[0]
            df.rename(columns={target_col: 'PCOS_YN'}, inplace=True)
            target_col = 'PCOS_YN'

    # 2. Handle missing values (1.99 is a known placeholder for NaN in this dataset)
    # Also handle '?' or other strings if present
    df = df.replace('1.99', np.nan)
    df = df.replace(1.99, np.nan)
    df = df.replace('?', np.nan)
    
    # Drop columns with too many missing values or ID columns
    cols_to_drop = ['Sl_No', 'Patient_File_No']
    df = df.drop(columns=[c for c in cols_to_drop if c in df.columns], errors='ignore')
    
    # Convert all to numeric where possible
    for col in df.columns:
        df[col] = pd.to_numeric(df[col], errors='coerce')
        
    # Impute missing values with Median (Robust to outliers)
    df = df.fillna(df.median())
    
    print(f"Data cleaned. Shape: {df.shape}")
    return df

def feature_engineering(df):
    print("Performing feature engineering...")
    
    # 1. Hormonal Ratios
    # FSH/LH is often provided but sometimes LH/FSH is more indicative of PCOS
    if 'FSHmIUmL' in df.columns and 'LHmIUmL' in df.columns:
        df['LH_FSH_Ratio'] = df['LHmIUmL'] / (df['FSHmIUmL'] + 0.1)
        
    # 2. Follicle metrics
    if 'Follicle_No_L' in df.columns and 'Follicle_No_R' in df.columns:
        df['Total_Follicles'] = df['Follicle_No_L'] + df['Follicle_No_R']
        df['Follicle_Diff'] = abs(df['Follicle_No_L'] - df['Follicle_No_R'])
        
    # 3. BMI Categories (Underweight, Normal, Overweight, Obese)
    if 'BMI' in df.columns:
        df['Is_Overweight'] = (df['BMI'] > 25).astype(int)
        df['Is_Obese'] = (df['BMI'] > 30).astype(int)
        
    # 4. Age Groups
    if 'Age_yrs' in df.columns:
        df['Is_Young'] = (df['Age_yrs'] < 25).astype(int)
        
    # 5. Symptom Score (Combining binary symptoms)
    symptom_cols = ['Weight_gainYN', 'hair_growthYN', 'Skin_darkening_YN', 'Hair_lossYN', 'PimplesYN', 'Fast_food_YN']
    available_symptoms = [c for c in symptom_cols if c in df.columns]
    if available_symptoms:
        df['Symptom_Count'] = df[available_symptoms].sum(axis=1)
        
    print(f"Feature engineering complete. New shape: {df.shape}")
    return df

def train_advanced_model():
    # Load and process
    df = load_and_clean_data(DATASET_PATH)
    df = feature_engineering(df)
    
    X = df.drop(columns=['PCOS_YN'])
    y = df['PCOS_YN']
    
    # Split data with stratification
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Scaling
    scaler = RobustScaler() # Better for data with outliers
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    print("Initializing Stacking Ensemble...")
    
    # Calculate scale_pos_weight for imbalance
    ratio = (len(y) - sum(y)) / sum(y)
    
    # Base Models
    base_models = [
        ('rf', RandomForestClassifier(n_estimators=300, max_depth=10, class_weight='balanced', random_state=42)),
        ('xgb', XGBClassifier(n_estimators=200, max_depth=6, learning_rate=0.05, scale_pos_weight=ratio, random_state=42, use_label_encoder=False, eval_metric='logloss'))
    ]
    
    # Stacking
    stack_model = StackingClassifier(
        estimators=base_models,
        final_estimator=LogisticRegression(),
        cv=StratifiedKFold(5)
    )
    
    # Cross Validation
    print("Performing 5-fold Cross Validation...")
    cv_scores = cross_val_score(stack_model, X_train_scaled, y_train, cv=5, scoring='f1')
    print(f"CV F1-Score: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
    
    # Fit
    print("Fitting final model...")
    stack_model.fit(X_train_scaled, y_train)
    
    # Evaluation
    y_pred = stack_model.predict(X_test_scaled)
    y_prob = stack_model.predict_proba(X_test_scaled)[:, 1]
    
    print("\n" + "="*30)
    print("MODEL PERFORMANCE REPORT")
    print("="*30)
    print(f"Accuracy:  {accuracy_score(y_test, y_pred):.4f}")
    print(f"F1-Score:  {f1_score(y_test, y_pred):.4f}")
    print(f"ROC AUC:   {roc_auc_score(y_test, y_prob):.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save Model
    if not os.path.exists('models'):
        os.makedirs('models')
        
    joblib.dump(stack_model, MODEL_OUTPUT_PATH)
    joblib.dump(X.columns.tolist(), FEATURES_OUTPUT_PATH)
    joblib.dump(scaler, 'models/advanced_pcos_scaler.joblib')
    
    print(f"\nModel saved to {MODEL_OUTPUT_PATH}")
    
    # Feature Importance (using RF from the base models for visualization)
    rf_temp = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_temp.fit(X_train, y_train)
    
    importances = pd.Series(rf_temp.feature_importances_, index=X.columns)
    plt.figure(figsize=(10, 8))
    importances.nlargest(15).plot(kind='barh')
    plt.title("Top 15 Features (Random Forest Importance)")
    plt.tight_layout()
    plt.savefig('models/advanced_feature_importance.png')
    print("Feature importance plot saved.")

if __name__ == "__main__":
    train_advanced_model()
