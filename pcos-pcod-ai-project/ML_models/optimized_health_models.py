import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold
from sklearn.preprocessing import StandardScaler, LabelEncoder, RobustScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, classification_report
from xgboost import XGBClassifier

# Configuration
DATASET_DIR = '../Dataset/'
MODEL_DIR = 'models/'

if not os.path.exists(MODEL_DIR):
    os.makedirs(MODEL_DIR)

def tune_and_save(model_name, X, y, param_grid, is_multiclass=False):
    print(f"\n--- Optimizing {model_name} Model ---")
    
    # Scaling
    scaler = RobustScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42, stratify=y)
    
    # Determine Model Type
    if is_multiclass:
        base_model = XGBClassifier(random_state=42, eval_metric='mlogloss')
    else:
        # Calculate scale_pos_weight for binary imbalance
        ratio = (len(y) - sum(y)) / (sum(y) + 1e-6)
        base_model = XGBClassifier(random_state=42, scale_pos_weight=ratio, eval_metric='logloss')
    
    # Grid Search with 5-Fold Cross Validation
    print(f"Running GridSearchCV for {model_name}...")
    grid_search = GridSearchCV(
        estimator=base_model,
        param_grid=param_grid,
        cv=StratifiedKFold(5),
        scoring='f1_weighted' if is_multiclass else 'f1',
        n_jobs=-1,
        verbose=1
    )
    
    grid_search.fit(X_train, y_train)
    
    best_model = grid_search.best_estimator_
    print(f"Best Parameters: {grid_search.best_params_}")
    
    # Evaluation
    y_pred = best_model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Test Accuracy: {acc:.4f}")
    print(f"Mean CV Score: {grid_search.best_score_:.4f}")
    
    # Save
    joblib.dump(best_model, os.path.join(MODEL_DIR, f'{model_name.lower()}_model.joblib'))
    joblib.dump(scaler, os.path.join(MODEL_DIR, f'{model_name.lower()}_scaler.joblib'))
    
    return acc

def optimize_diabetes():
    df = pd.read_csv(os.path.join(DATASET_DIR, 'diabetes.csv'))
    features = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']
    X = df[features]
    y = df['Outcome']
    
    param_grid = {
        'n_estimators': [100, 200],
        'max_depth': [3, 5, 7],
        'learning_rate': [0.01, 0.1]
    }
    
    optimize_diabetes.accuracy = tune_and_save('Diabetes', X, y, param_grid)

def optimize_heart():
    df = pd.read_csv(os.path.join(DATASET_DIR, 'cardio_train.csv'), sep=';')
    # age is in days, convert to years
    df['age'] = df['age'] / 365.25
    features = ['age', 'gender', 'height', 'weight', 'ap_hi', 'ap_lo', 'cholesterol', 'gluc', 'smoke', 'alco', 'active']
    X = df[features]
    y = df['cardio']
    
    param_grid = {
        'n_estimators': [100, 200],
        'max_depth': [5, 7],
        'learning_rate': [0.1]
    }
    
    optimize_heart.accuracy = tune_and_save('Heart', X, y, param_grid)

def optimize_obesity():
    df = pd.read_csv(os.path.join(DATASET_DIR, 'obesity_level.csv'))
    # Preprocessing
    df['0be1dad'] = df['0be1dad'].replace('0rmal_Weight', 'Normal_Weight')
    
    cat_cols = ['Gender', 'family_history_with_overweight', 'FAVC', 'CAEC', 'SMOKE', 'SCC', 'CALC', 'MTRANS']
    le_dict = {}
    for col in cat_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col].astype(str))
        le_dict[col] = le
        
    target_le = LabelEncoder()
    y = target_le.fit_transform(df['0be1dad'].astype(str))
    
    features = ['Gender', 'Age', 'Height', 'Weight', 'family_history_with_overweight', 'FAVC', 'FCVC', 'NCP', 'CAEC', 'SMOKE', 'CH2O', 'SCC', 'FAF', 'TUE', 'CALC', 'MTRANS']
    X = df[features]
    
    param_grid = {
        'n_estimators': [100, 200],
        'max_depth': [7, 10],
        'learning_rate': [0.1]
    }
    
    joblib.dump(le_dict, os.path.join(MODEL_DIR, 'obesity_encoders.joblib'))
    joblib.dump(target_le, os.path.join(MODEL_DIR, 'obesity_target_encoder.joblib'))
    joblib.dump(features, os.path.join(MODEL_DIR, 'obesity_features.joblib'))
    
    optimize_obesity.accuracy = tune_and_save('Obesity', X, y, param_grid, is_multiclass=True)

def optimize_infertility():
    df = pd.read_csv(os.path.join(DATASET_DIR, 'fertility.csv'))
    
    cat_cols = ['Season', 'Childish diseases', 'Accident or serious trauma', 'Surgical intervention', 'High fevers in the last year', 'Frequency of alcohol consumption', 'Smoking habit']
    le_dict = {}
    for col in cat_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col].astype(str))
        le_dict[col] = le
        
    target_le = LabelEncoder()
    y = target_le.fit_transform(df['Diagnosis'].astype(str))
    
    features = ['Season', 'Age', 'Childish diseases', 'Accident or serious trauma', 'Surgical intervention', 'High fevers in the last year', 'Frequency of alcohol consumption', 'Smoking habit', 'Number of hours spent sitting per day']
    X = df[features]
    
    param_grid = {
        'n_estimators': [50, 100],
        'max_depth': [3, 5],
        'learning_rate': [0.05, 0.1]
    }
    
    joblib.dump(le_dict, os.path.join(MODEL_DIR, 'infertility_encoders.joblib'))
    joblib.dump(target_le, os.path.join(MODEL_DIR, 'infertility_target_encoder.joblib'))
    joblib.dump(features, os.path.join(MODEL_DIR, 'infertility_features.joblib'))
    
    optimize_infertility.accuracy = tune_and_save('Infertility', X, y, param_grid)

if __name__ == "__main__":
    optimize_diabetes()
    optimize_heart()
    optimize_obesity()
    optimize_infertility()
    print("\nAll models optimized and saved in models/ directory.")
