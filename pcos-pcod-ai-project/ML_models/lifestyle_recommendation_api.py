import os
import json
import joblib
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

# Load the model and recommendations database
MODEL_PATH = 'lifestyle_recommendation_model.joblib'
RECOMMENDATIONS_DB_PATH = 'lifestyle_recommendations_db.json'

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load model and recommendations database
def load_model_and_data():
    try:
        # Load the model
        model_data = joblib.load(MODEL_PATH)
        model = model_data['model']
        features = model_data['features']
        
        # Load recommendations database
        with open(RECOMMENDATIONS_DB_PATH, 'r') as f:
            recommendations_db = json.load(f)
            
        return model, features, recommendations_db
    except Exception as e:
        print(f"Error loading model or recommendations: {e}")
        return None, None, None

model, features, recommendations_db = load_model_and_data()

# Map frontend lifestyle factors to model factors
def map_lifestyle_factors(user_data):
    """
    Map frontend user data to the format expected by the model
    """
    # Default values
    mapped_data = {
        'exercise': 'none',
        'diet': 'balanced',
        'stress': 'medium',
        'sleep': 'average',
        'weight_status': 'normal',
        'pcos_severity': 'moderate'
    }
    
    # Map exercise level
    if 'lifestyleFactors' in user_data:
        if user_data.get('lifestyleFactors', {}).get('exercise') == True:
            mapped_data['exercise'] = 'moderate'
        if 'Sedentary lifestyle' in user_data.get('lifestyleFactors', []):
            mapped_data['exercise'] = 'none'
    
    # Map diet
    if 'High sugar diet' in user_data.get('lifestyleFactors', []):
        mapped_data['diet'] = 'high_carb'
    elif 'Poor dietary habits' in user_data.get('lifestyleFactors', []):
        mapped_data['diet'] = 'balanced'  # Default to balanced but with poor habits
    
    # Map stress level
    if 'lifestyleFactors' in user_data:
        stress_level = user_data.get('lifestyleFactors', {}).get('stress', 5)
        if isinstance(stress_level, (int, float)):
            if stress_level >= 7:
                mapped_data['stress'] = 'high'
            elif stress_level >= 4:
                mapped_data['stress'] = 'medium'
            else:
                mapped_data['stress'] = 'low'
    
    # Map sleep quality
    if 'lifestyleFactors' in user_data:
        sleep_quality = user_data.get('lifestyleFactors', {}).get('sleep', 5)
        if isinstance(sleep_quality, (int, float)):
            if sleep_quality >= 7:
                mapped_data['sleep'] = 'good'
            elif sleep_quality >= 4:
                mapped_data['sleep'] = 'average'
            else:
                mapped_data['sleep'] = 'poor'
    
    # Map weight status based on BMI
    bmi = user_data.get('bmi', 22)
    if isinstance(bmi, (int, float)):
        if bmi < 18.5:
            mapped_data['weight_status'] = 'underweight'
        elif bmi < 25:
            mapped_data['weight_status'] = 'normal'
        elif bmi < 30:
            mapped_data['weight_status'] = 'overweight'
        else:
            mapped_data['weight_status'] = 'obese'
    
    # Map PCOS severity based on symptoms count
    symptoms = user_data.get('symptoms', [])
    if len(symptoms) <= 2:
        mapped_data['pcos_severity'] = 'mild'
    elif len(symptoms) <= 5:
        mapped_data['pcos_severity'] = 'moderate'
    else:
        mapped_data['pcos_severity'] = 'severe'
    
    return mapped_data

def get_recommendations(user_profile):
    """
    Get personalized lifestyle recommendations for a user
    """
    if model is None or recommendations_db is None:
        return {"error": "Model or recommendations database not loaded"}
    
    # Convert user profile to DataFrame format
    user_df = pd.DataFrame([user_profile])
    
    # Get personalized recommendations based on user profile
    personalized_recommendations = {}
    
    # Diet recommendations based on current diet
    diet_key = user_profile['diet']
    personalized_recommendations['diet'] = recommendations_db['diet'][diet_key]
    
    # Exercise recommendations based on current exercise level
    exercise_key = user_profile['exercise']
    personalized_recommendations['exercise'] = recommendations_db['exercise'][exercise_key]
    
    # Stress management recommendations based on stress level
    stress_key = user_profile['stress']
    personalized_recommendations['stress_management'] = recommendations_db['stress_management'][stress_key]
    
    # Sleep recommendations based on sleep quality
    sleep_key = user_profile['sleep']
    personalized_recommendations['sleep'] = recommendations_db['sleep'][sleep_key]
    
    # Supplement recommendations based on PCOS severity
    severity_key = user_profile['pcos_severity']
    personalized_recommendations['supplements'] = recommendations_db['supplements'][severity_key]
    
    return personalized_recommendations

@app.route('/api/lifestyle-recommendations', methods=['POST'])
def get_lifestyle_recommendations():
    """
    API endpoint to get lifestyle recommendations
    """
    try:
        # Get user data from request
        user_data = request.json
        
        # Map user data to model format
        mapped_data = map_lifestyle_factors(user_data)
        
        # Get recommendations
        recommendations = get_recommendations(mapped_data)
        
        # Format recommendations for frontend
        formatted_recommendations = []
        for category, recs in recommendations.items():
            for rec in recs:
                formatted_recommendations.append({
                    'category': category.replace('_', ' ').title(),
                    'text': rec,
                    'priority': 'high' if category in ['diet', 'exercise'] else 'medium'
                })
        
        return jsonify({
            'success': True,
            'recommendations': formatted_recommendations,
            'user_profile': mapped_data
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)