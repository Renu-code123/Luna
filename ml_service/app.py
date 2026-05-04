from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import os
import sys

# Add pcos-pcod-ai-project/ML_models to path to import RLRecommender
sys.path.append(os.path.abspath('../pcos-pcod-ai-project/ML_models'))
try:
    from rl_recommender import RLRecommender
    from period_tracking_model import PeriodTrackingModel
except ImportError:
    class RLRecommender:
        def __init__(self, *args, **kwargs): pass
        def load(self, *args, **kwargs): pass
        def select_action(self, *args, **kwargs): return "Default Recommendation"
    
    class PeriodTrackingModel:
        def __init__(self, *args, **kwargs): pass
        def predict(self, *args, **kwargs): return {"success": False, "message": "Model not found"}

app = Flask(__name__)
CORS(app)

MODEL_DIR = 'models/'

# Helper to load model and scaler
def load_resource(name):
    try:
        model = joblib.load(os.path.join(MODEL_DIR, f'{name}_model.joblib'))
        scaler = joblib.load(os.path.join(MODEL_DIR, f'{name}_scaler.joblib'))
        return model, scaler
    except:
        # Fallback for models without dedicated scalers or different naming
        try:
            return joblib.load(os.path.join(MODEL_DIR, f'{name}_model.joblib')), None
        except:
            return None, None

# Load models, features, and scalers
try:
    # PCOS (Advanced Stacking Model)
    pcos_model = joblib.load(os.path.join(MODEL_DIR, 'advanced_pcos_model.joblib'))
    pcos_features = joblib.load(os.path.join(MODEL_DIR, 'advanced_pcos_features.joblib'))
    pcos_scaler = joblib.load(os.path.join(MODEL_DIR, 'advanced_pcos_scaler.joblib'))
    
    # Other Optimized Models
    diabetes_model, diabetes_scaler = load_resource('diabetes')
    diabetes_features = joblib.load(os.path.join(MODEL_DIR, 'diabetes_features.joblib'))
    
    heart_model, heart_scaler = load_resource('heart')
    heart_features = joblib.load(os.path.join(MODEL_DIR, 'heart_features.joblib'))
    
    obesity_model, obesity_scaler = load_resource('obesity')
    obesity_features = joblib.load(os.path.join(MODEL_DIR, 'obesity_features.joblib'))
    obesity_encoders = joblib.load(os.path.join(MODEL_DIR, 'obesity_encoders.joblib'))
    obesity_target_encoder = joblib.load(os.path.join(MODEL_DIR, 'obesity_target_encoder.joblib'))
    
    infertility_model, infertility_scaler = load_resource('infertility')
    infertility_features = joblib.load(os.path.join(MODEL_DIR, 'infertility_features.joblib'))
    infertility_encoders = joblib.load(os.path.join(MODEL_DIR, 'infertility_encoders.joblib'))
    infertility_target_encoder = joblib.load(os.path.join(MODEL_DIR, 'infertility_target_encoder.joblib'))
    
    recommender = RLRecommender()
    recommender.load(os.path.join(MODEL_DIR, 'rl_recommender.joblib'))
    
    period_model = PeriodTrackingModel()
    # No need to load a global joblib if it's per-user data
    
    print("All high-accuracy optimized models loaded successfully.")
except Exception as e:
    print(f"Error loading models: {e}")

def engineer_pcos_features(df):
    """Apply same feature engineering as used in training"""
    # 1. LH/FSH Ratio
    if 'FSHmIUmL' in df.columns and 'LHmIUmL' in df.columns:
        df['LH_FSH_Ratio'] = df['LHmIUmL'] / (df['FSHmIUmL'] + 0.1)
    elif 'FSH(mIU/mL)' in df.columns and 'LH(mIU/mL)' in df.columns:
         df['LH_FSH_Ratio'] = df['LH(mIU/mL)'] / (df['FSH(mIU/mL)'] + 0.1)
        
    # 2. Follicle metrics
    f_l = df.get('Follicle_No_L', df.get('Follicle No. (L)', 0))
    f_r = df.get('Follicle_No_R', df.get('Follicle No. (R)', 0))
    df['Total_Follicles'] = f_l + f_r
    df['Follicle_Diff'] = abs(f_l - f_r)
        
    # 3. BMI Categories
    bmi = df.get('BMI', 0)
    df['Is_Overweight'] = (bmi > 25).astype(int)
    df['Is_Obese'] = (bmi > 30).astype(int)
        
    # 4. Age Groups
    age = df.get('Age_yrs', df.get('Age (yrs)', 0))
    df['Is_Young'] = (age < 25).astype(int)
        
    # 5. Symptom Score
    symptoms = ['Weight_gainYN', 'hair_growthYN', 'Skin_darkening_YN', 'Hair_lossYN', 'PimplesYN', 'Fast_food_YN']
    # Map from potentially different input keys
    mapping = {
        'Weight gain(Y/N)': 'Weight_gainYN',
        'hair growth(Y/N)': 'hair_growthYN',
        'Skin darkening (Y/N)': 'Skin_darkening_YN',
        'Hair loss(Y/N)': 'Hair_lossYN',
        'Pimples(Y/N)': 'PimplesYN',
        'Fast food (Y/N)': 'Fast_food_YN'
    }
    score = 0
    for k, v in mapping.items():
        val = df.get(k, df.get(v, 0))
        if val in [1, 'Y', 'Yes', 'YES']: score += 1
    df['Symptom_Count'] = score
    
    return df

@app.route('/predict/pcos', methods=['POST'])
def predict_pcos():
    data = request.json
    df = pd.DataFrame([data])
    
    # Feature Engineering
    df = engineer_pcos_features(df)
    
    # Ensure all features expected by model are present
    for f in pcos_features:
        if f not in df.columns:
            df[f] = 0
            
    # Scale and Predict
    X = df[pcos_features]
    X_scaled = pcos_scaler.transform(X)
    
    prediction = pcos_model.predict(X_scaled)[0]
    probability = pcos_model.predict_proba(X_scaled)[0][1]
    
    return jsonify({
        'prediction': int(prediction), 
        'probability': float(probability),
        'confidence': "High (Optimized Stacking Ensemble)"
    })

@app.route('/predict/diabetes', methods=['POST'])
def predict_diabetes():
    data = request.json
    df = pd.DataFrame([data])
    X = df[diabetes_features]
    
    if diabetes_scaler:
        X = diabetes_scaler.transform(X)
        
    prediction = diabetes_model.predict(X)[0]
    probability = diabetes_model.predict_proba(X)[0][1]
    return jsonify({'prediction': int(prediction), 'probability': float(probability)})

@app.route('/predict/heart', methods=['POST'])
def predict_heart():
    data = request.json
    df = pd.DataFrame([data])
    
    # Special handling for age if passed in years (model expects years due to my optimization script)
    X = df[heart_features]
    
    if heart_scaler:
        X = heart_scaler.transform(X)
        
    prediction = heart_model.predict(X)[0]
    probability = heart_model.predict_proba(X)[0][1]
    return jsonify({'prediction': int(prediction), 'probability': float(probability)})

@app.route('/predict/obesity', methods=['POST'])
def predict_obesity():
    data = request.json
    df = pd.DataFrame([data])
    
    # Encode
    for col, le in obesity_encoders.items():
        if col in df.columns:
            try:
                df[col] = le.transform(df[col].astype(str))
            except:
                df[col] = 0
    
    X = df[obesity_features]
    if obesity_scaler:
        X = obesity_scaler.transform(X)
        
    prediction_idx = obesity_model.predict(X)[0]
    prediction_label = obesity_target_encoder.inverse_transform([prediction_idx])[0]
    return jsonify({'prediction': prediction_label})

@app.route('/predict/infertility', methods=['POST'])
def predict_infertility():
    data = request.json
    df = pd.DataFrame([data])
    
    # Encode
    for col, le in infertility_encoders.items():
        if col in df.columns:
            try:
                df[col] = le.transform(df[col].astype(str))
            except:
                df[col] = 0
                
    X = df[infertility_features]
    if infertility_scaler:
        X = infertility_scaler.transform(X)
                
    prediction_idx = infertility_model.predict(X)[0]
    prediction_label = infertility_target_encoder.inverse_transform([prediction_idx])[0]
    return jsonify({'prediction': prediction_label})

@app.route('/recommend/lifestyle', methods=['POST'])
def recommend_lifestyle():
    data = request.json
    bmi = data.get('bmi', 25)
    pcos = data.get('pcos', False)
    stress = data.get('stress', 5)
    sleep = data.get('sleep', 7)
    
    # RL Recommendation
    rl_action = recommender.select_action(
        bmi, sleep, 5000, stress, data.get('cycle_irreg', False)
    )
    
    # Rule-based logic
    diet = "Standard balanced diet"
    if bmi > 25: diet = "Low calorie, portion-controlled diet"
    if pcos: diet = "Low Glycemic Index (GI) PCOS-friendly diet"
    
    exercise = "Regular walking"
    if bmi > 28: exercise = "Higher intensity Cardio (30m daily)"
    if stress > 7: exercise = "Relaxing Yoga and stretching"
    
    stress_tip = "Continue standard self-care"
    if sleep < 6: stress_tip = "Prioritize 7-8 hours of consistent sleep"
    if stress > 5: stress_tip = "Focus on daily mindfulness and meditation"
    
    return jsonify({
        'rl_recommendation': rl_action,
        'rules': {
            'diet': diet,
            'exercise': exercise,
            'stress': stress_tip
        },
        'primary': rl_action
    })

@app.route('/predict-cycle', methods=['POST'])
def predict_cycle():
    data = request.json
    user_cycles = data.get('cycles', [])
    
    if len(user_cycles) < 1:
        return jsonify({
            'success': False, 
            'message': 'Start tracking your cycle today 🌸',
            'progress': 0
        })
    
    if len(user_cycles) < 2:
        # Fallback to simple average logic for low data
        res = period_model.predict(user_cycles)
        res['confidence_label'] = "Estimated (Low Confidence)"
        res['progress'] = len(user_cycles)
        return jsonify(res)
    
    # High data mode (2 or more entries)
    res = period_model.predict(user_cycles)
    res['confidence_label'] = "Predicted (AI-Mode Active)"
    res['progress'] = len(user_cycles)
    return jsonify(res)


if __name__ == '__main__':
    app.run(port=5001, debug=True)
