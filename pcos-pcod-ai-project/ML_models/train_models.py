import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib
import os

# Define paths
DATASET_DIR = '../Dataset/'
MODEL_DIR = 'models/'

if not os.path.exists(MODEL_DIR):
    os.makedirs(MODEL_DIR)

def clean_boolean(val):
    if isinstance(val, str):
        val = val.strip().upper()
        if val == 'Y' or val == 'YES' or val == '1' or val == '1.0':
            return 1
        return 0
    try:
        if float(val) == 1.0:
            return 1
    except:
        pass
    return 0

def train_pcos_model():
    print("Training PCOS Model...")
    df = pd.read_csv(os.path.join(DATASET_DIR, 'PCOS_data.csv'))
    
    # Features requested: Age, BMI, Weight, Cycle length, Irregular periods, LH, FSH, Insulin, Acne, Hair growth
    pcos_features = [
        'Age (yrs)', 'Weight (Kg)', 'Height(Cm)', 'BMI', 'Blood Group', 
        'Pulse rate(bpm) ', 'RR (breaths/min)', 'Hb(g/dl)', 'Cycle(R/I)', 
        'Cycle length(days)', 'Marraige Status (Y/N)', 'Pregnant(Y/N)', 
        'No. of aborptions', 'FSH(mIU/mL)', 'LH(mIU/mL)', 'FSH/LH', 
        'Hip(inch)', 'Waist(inch)', 'Waist:Hip Ratio', 'TSH (mIU/L)', 
        'AMH(ng/mL)', 'PRL(ng/mL)', 'Vit D3 (ng/mL)', 'PRG(ng/mL)', 
        'RBS(mg/dl)', 'Weight gain(Y/N)', 'hair growth(Y/N)', 'Skin darkening (Y/N)', 
        'Hair loss(Y/N)', 'Pimples(Y/N)', 'Fast food (Y/N)', 'Reg.Exercise(Y/N)', 
        'BP _Systolic (mmHg)', 'BP _Diastolic (mmHg)', 'Follicle No. (L)', 'Follicle No. (R)'
    ]
    
    # Filter only available columns
    available_features = [f for f in pcos_features if f in df.columns]
    
    X = df[available_features].copy()
    y = df['PCOS (Y/N)']
    
    # Basic cleaning
    X = X.apply(pd.to_numeric, errors='coerce')
    X = X.fillna(X.median())
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    joblib.dump(model, os.path.join(MODEL_DIR, 'pcos_model.joblib'))
    joblib.dump(available_features, os.path.join(MODEL_DIR, 'pcos_features.joblib'))
    print(f"PCOS Model saved. Accuracy: {model.score(X_test, y_test):.2f}")

def train_diabetes_model():
    print("Training Diabetes Model...")
    df = pd.read_csv(os.path.join(DATASET_DIR, 'diabetes.csv'))
    features = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']
    X = df[features]
    y = df['Outcome']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    joblib.dump(model, os.path.join(MODEL_DIR, 'diabetes_model.joblib'))
    joblib.dump(features, os.path.join(MODEL_DIR, 'diabetes_features.joblib'))
    print(f"Diabetes Model saved. Accuracy: {model.score(X_test, y_test):.2f}")

def train_heart_model():
    print("Training Heart Model...")
    df = pd.read_csv(os.path.join(DATASET_DIR, 'cardio_train.csv'), sep=';')
    df['age'] = df['age'] / 365.25
    features = ['age', 'gender', 'height', 'weight', 'ap_hi', 'ap_lo', 'cholesterol', 'gluc', 'smoke', 'alco', 'active']
    X = df[features]
    y = df['cardio']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    joblib.dump(model, os.path.join(MODEL_DIR, 'heart_model.joblib'))
    joblib.dump(features, os.path.join(MODEL_DIR, 'heart_features.joblib'))
    print(f"Heart Model saved. Accuracy: {model.score(X_test, y_test):.2f}")

def train_obesity_model():
    print("Training Obesity Model...")
    df = pd.read_csv(os.path.join(DATASET_DIR, 'obesity_level.csv'))
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
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    joblib.dump(model, os.path.join(MODEL_DIR, 'obesity_model.joblib'))
    joblib.dump(features, os.path.join(MODEL_DIR, 'obesity_features.joblib'))
    joblib.dump(le_dict, os.path.join(MODEL_DIR, 'obesity_encoders.joblib'))
    joblib.dump(target_le, os.path.join(MODEL_DIR, 'obesity_target_encoder.joblib'))
    print(f"Obesity Model saved. Accuracy: {model.score(X_test, y_test):.2f}")

def train_infertility_model():
    print("Training Infertility Model...")
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
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    joblib.dump(model, os.path.join(MODEL_DIR, 'infertility_model.joblib'))
    joblib.dump(features, os.path.join(MODEL_DIR, 'infertility_features.joblib'))
    joblib.dump(le_dict, os.path.join(MODEL_DIR, 'infertility_encoders.joblib'))
    joblib.dump(target_le, os.path.join(MODEL_DIR, 'infertility_target_encoder.joblib'))
    print(f"Infertility Model saved. Accuracy: {model.score(X_test, y_test):.2f}")

if __name__ == "__main__":
    train_pcos_model()
    train_diabetes_model()
    train_heart_model()
    train_obesity_model()
    train_infertility_model()
    print("All models trained and saved in models/ directory.")
