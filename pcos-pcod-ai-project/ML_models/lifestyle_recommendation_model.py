import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.neighbors import NearestNeighbors
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import os
import matplotlib.pyplot as plt
import seaborn as sns
import json

# Configuration
MODEL_OUTPUT_PATH = 'lifestyle_recommendation_model.joblib'
RECOMMENDATIONS_DB_PATH = 'lifestyle_recommendations_db.json'
RESULTS_PATH = 'lifestyle_model_evaluation_results.txt'

# Define the lifestyle factors and their possible values
LIFESTYLE_FACTORS = {
    'exercise': ['none', 'light', 'moderate', 'intense'],
    'diet': ['balanced', 'vegetarian', 'vegan', 'keto', 'high_carb', 'high_protein', 'low_fat'],
    'stress': ['low', 'medium', 'high'],
    'sleep': ['poor', 'average', 'good'],
    'weight_status': ['underweight', 'normal', 'overweight', 'obese'],
    'pcos_severity': ['mild', 'moderate', 'severe']
}

# Define the recommendation categories
RECOMMENDATION_CATEGORIES = ['diet', 'exercise', 'stress_management', 'sleep', 'supplements']

def create_synthetic_dataset(num_samples=500):
    """
    Create a synthetic dataset for lifestyle recommendations
    """
    print("Creating synthetic dataset...")
    
    np.random.seed(42)
    
    # Generate random lifestyle factors
    data = {
        'user_id': range(1, num_samples + 1),
        'exercise': np.random.choice(LIFESTYLE_FACTORS['exercise'], num_samples),
        'diet': np.random.choice(LIFESTYLE_FACTORS['diet'], num_samples),
        'stress': np.random.choice(LIFESTYLE_FACTORS['stress'], num_samples),
        'sleep': np.random.choice(LIFESTYLE_FACTORS['sleep'], num_samples),
        'weight_status': np.random.choice(LIFESTYLE_FACTORS['weight_status'], num_samples),
        'pcos_severity': np.random.choice(LIFESTYLE_FACTORS['pcos_severity'], num_samples)
    }
    
    # Generate synthetic health outcomes based on lifestyle factors
    # Higher score is better
    data['symptom_improvement'] = np.zeros(num_samples)
    
    # Exercise impact (more exercise = better outcomes)
    exercise_impact = {'none': 0, 'light': 1, 'moderate': 2, 'intense': 2.5}
    for i in range(num_samples):
        data['symptom_improvement'][i] += exercise_impact[data['exercise'][i]]
    
    # Diet impact
    diet_impact = {
        'balanced': 2.5, 
        'vegetarian': 2, 
        'vegan': 2, 
        'keto': 1.5, 
        'high_carb': 0.5, 
        'high_protein': 1.5, 
        'low_fat': 1
    }
    for i in range(num_samples):
        data['symptom_improvement'][i] += diet_impact[data['diet'][i]]
    
    # Stress impact (less stress = better outcomes)
    stress_impact = {'low': 2, 'medium': 1, 'high': 0}
    for i in range(num_samples):
        data['symptom_improvement'][i] += stress_impact[data['stress'][i]]
    
    # Sleep impact (better sleep = better outcomes)
    sleep_impact = {'poor': 0, 'average': 1, 'good': 2}
    for i in range(num_samples):
        data['symptom_improvement'][i] += sleep_impact[data['sleep'][i]]
    
    # Weight status impact (normal weight = better outcomes)
    weight_impact = {'underweight': 1, 'normal': 2, 'overweight': 0.5, 'obese': 0}
    for i in range(num_samples):
        data['symptom_improvement'][i] += weight_impact[data['weight_status'][i]]
    
    # PCOS severity impact (more severe = harder to improve)
    severity_impact = {'mild': 1, 'moderate': 0.5, 'severe': 0}
    for i in range(num_samples):
        data['symptom_improvement'][i] += severity_impact[data['pcos_severity'][i]]
    
    # Add some random variation
    data['symptom_improvement'] += np.random.normal(0, 0.5, num_samples)
    
    # Scale to 0-10 range
    min_val = min(data['symptom_improvement'])
    max_val = max(data['symptom_improvement'])
    data['symptom_improvement'] = 10 * (data['symptom_improvement'] - min_val) / (max_val - min_val)
    
    # Create DataFrame
    df = pd.DataFrame(data)
    
    print(f"Synthetic dataset created with {num_samples} samples")
    return df

def create_recommendation_database():
    """
    Create a database of lifestyle recommendations for PCOS/PCOD
    """
    recommendations = {
        'diet': {
            'balanced': [
                "Focus on a balanced diet with plenty of fruits, vegetables, lean proteins, and whole grains.",
                "Include anti-inflammatory foods like berries, fatty fish, and leafy greens.",
                "Aim for regular meal times to help regulate blood sugar levels."
            ],
            'vegetarian': [
                "Ensure adequate protein intake through beans, lentils, tofu, and dairy if consumed.",
                "Include iron-rich foods like spinach and fortified cereals.",
                "Consider vitamin B12 supplementation if not consuming dairy or eggs."
            ],
            'vegan': [
                "Focus on complete protein sources like quinoa, buckwheat, and combinations of legumes and grains.",
                "Include plant-based sources of omega-3 fatty acids like flaxseeds and walnuts.",
                "Consider supplements for vitamin B12, vitamin D, and iron."
            ],
            'keto': [
                "Choose healthy fats like avocados, olive oil, and nuts.",
                "Include plenty of non-starchy vegetables for fiber and nutrients.",
                "Monitor your ketone levels and consult with a healthcare provider regularly."
            ],
            'high_carb': [
                "Switch to complex carbohydrates like whole grains, beans, and vegetables.",
                "Pair carbohydrates with protein and healthy fats to slow glucose absorption.",
                "Consider reducing overall carbohydrate intake to help manage insulin levels."
            ],
            'high_protein': [
                "Choose lean protein sources to avoid excess saturated fat.",
                "Include plant-based proteins for additional fiber and nutrients.",
                "Ensure adequate carbohydrate intake for energy and brain function."
            ],
            'low_fat': [
                "Include some healthy fats for hormone production and nutrient absorption.",
                "Focus on lean proteins and complex carbohydrates.",
                "Consider increasing healthy fat intake if experiencing hormonal imbalances."
            ]
        },
        'exercise': {
            'none': [
                "Start with short, 10-minute walks and gradually increase duration.",
                "Try gentle yoga or stretching to improve flexibility and reduce stress.",
                "Consider water-based exercises which are low-impact and joint-friendly."
            ],
            'light': [
                "Gradually increase intensity with brisk walking or light jogging.",
                "Add resistance training 2-3 times per week to build muscle.",
                "Include flexibility exercises to improve overall mobility."
            ],
            'moderate': [
                "Maintain your current exercise routine with a mix of cardio and strength training.",
                "Consider adding high-intensity interval training (HIIT) 1-2 times per week.",
                "Include active recovery days with gentle movement like yoga or walking."
            ],
            'intense': [
                "Ensure adequate recovery between intense workouts.",
                "Monitor for signs of overtraining which can worsen hormonal imbalances.",
                "Include stress-reducing activities like yoga or tai chi to balance high-intensity exercise."
            ]
        },
        'stress_management': {
            'high': [
                "Practice daily mindfulness meditation for at least 10 minutes.",
                "Consider cognitive behavioral therapy (CBT) to develop coping strategies.",
                "Implement regular breaks throughout the day for deep breathing or short walks."
            ],
            'medium': [
                "Develop a regular relaxation practice like progressive muscle relaxation or guided imagery.",
                "Set boundaries on work hours and technology use.",
                "Engage in enjoyable activities or hobbies regularly."
            ],
            'low': [
                "Maintain your current stress management practices.",
                "Practice gratitude journaling to further enhance well-being.",
                "Consider teaching stress management techniques to others."
            ]
        },
        'sleep': {
            'poor': [
                "Establish a consistent sleep schedule, even on weekends.",
                "Create a relaxing bedtime routine without screens for 1 hour before bed.",
                "Make your bedroom cool, dark, and quiet for optimal sleep conditions."
            ],
            'average': [
                "Limit caffeine after noon and avoid alcohol close to bedtime.",
                "Consider a white noise machine or earplugs if noise disrupts your sleep.",
                "Aim to increase sleep duration by 30 minutes if currently sleeping less than 7 hours."
            ],
            'good': [
                "Maintain your current sleep habits.",
                "Consider tracking your sleep cycles to optimize wake times.",
                "If you experience occasional insomnia, try relaxation techniques rather than medication."
            ]
        },
        'supplements': {
            'mild': [
                "Consider inositol supplements which may help improve insulin sensitivity.",
                "Vitamin D supplementation if levels are low (get tested first).",
                "Magnesium may help with sleep and reduce sugar cravings."
            ],
            'moderate': [
                "N-acetylcysteine (NAC) may help reduce inflammation and improve insulin sensitivity.",
                "Omega-3 fatty acids can help reduce inflammation and improve hormone balance.",
                "Chromium may help with blood sugar regulation and reducing cravings."
            ],
            'severe': [
                "Consult with a healthcare provider about specific supplement needs.",
                "Consider berberine which has been shown to have similar effects to metformin.",
                "Alpha-lipoic acid may help improve insulin sensitivity and reduce inflammation."
            ]
        }
    }
    
    # Save to JSON file
    with open(RECOMMENDATIONS_DB_PATH, 'w') as f:
        json.dump(recommendations, f, indent=2)
    
    print(f"Recommendation database created and saved to {RECOMMENDATIONS_DB_PATH}")
    return recommendations

def build_recommendation_model(df):
    """
    Build a recommendation model based on nearest neighbors
    """
    print("Building recommendation model...")
    
    # Extract features and target
    X = df.drop(columns=['user_id', 'symptom_improvement'])
    y = df['symptom_improvement']
    
    # Define categorical features
    categorical_features = X.columns.tolist()
    
    # Create preprocessor
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ])
    
    # Create pipeline with nearest neighbors model
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('model', NearestNeighbors(n_neighbors=5, metric='cosine'))
    ])
    
    # Fit the model
    pipeline.fit(X)
    
    print("Recommendation model built successfully")
    return pipeline, X

def evaluate_model(model, X, df):
    """
    Evaluate the recommendation model
    """
    print("Evaluating recommendation model...")
    
    # Sample a few test cases
    test_indices = np.random.choice(X.shape[0], 5, replace=False)
    
    results = []
    
    for idx in test_indices:
        test_user = X.iloc[idx:idx+1]
        test_user_data = {col: test_user[col].values[0] for col in test_user.columns}
        
        # Get nearest neighbors
        distances, indices = model.named_steps['model'].kneighbors(
            model.named_steps['preprocessor'].transform(test_user)
        )
        
        # Get the lifestyle factors of similar users
        similar_users = df.iloc[indices[0]]
        
        # Calculate average symptom improvement of similar users
        avg_improvement = similar_users['symptom_improvement'].mean()
        
        results.append({
            'user_id': df.iloc[idx]['user_id'],
            'lifestyle_factors': test_user_data,
            'similar_users': similar_users['user_id'].tolist(),
            'avg_symptom_improvement': avg_improvement
        })
    
    # Save evaluation results
    with open(RESULTS_PATH, 'w') as f:
        f.write("Lifestyle Recommendation Model Evaluation\n")
        f.write("=======================================\n\n")
        
        for i, result in enumerate(results):
            f.write(f"Test Case {i+1}:\n")
            f.write(f"User ID: {result['user_id']}\n")
            f.write("Lifestyle Factors:\n")
            for factor, value in result['lifestyle_factors'].items():
                f.write(f"  - {factor}: {value}\n")
            f.write(f"Similar Users: {result['similar_users']}\n")
            f.write(f"Average Symptom Improvement: {result['avg_symptom_improvement']:.2f}/10\n\n")
    
    print(f"Evaluation results saved to {RESULTS_PATH}")
    return results

def get_recommendations(user_profile, model, X, recommendations_db):
    """
    Get personalized lifestyle recommendations for a user
    """
    # Convert user profile to DataFrame format
    user_df = pd.DataFrame([user_profile])
    
    # Get nearest neighbors
    distances, indices = model.named_steps['model'].kneighbors(
        model.named_steps['preprocessor'].transform(user_df)
    )
    
    # Get personalized recommendations based on user profile
    personalized_recommendations = {}
    
    # Diet recommendations based on current diet and PCOS severity
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

def save_model(model, X):
    """
    Save the trained model to disk
    """
    # Save the model and the feature set
    joblib.dump({'model': model, 'features': X.columns.tolist()}, MODEL_OUTPUT_PATH)
    print(f"Model saved to {MODEL_OUTPUT_PATH}")

def main():
    """
    Main function to execute the lifestyle recommendation model pipeline
    """
    print("Starting Lifestyle Recommendation Model Development")
    
    # Create synthetic dataset
    df = create_synthetic_dataset()
    
    # Create recommendation database
    recommendations_db = create_recommendation_database()
    
    # Build recommendation model
    model, X = build_recommendation_model(df)
    
    # Evaluate model
    evaluate_model(model, X, df)
    
    # Save model
    save_model(model, X)
    
    # Test with a sample user
    sample_user = {
        'exercise': 'light',
        'diet': 'balanced',
        'stress': 'medium',
        'sleep': 'average',
        'weight_status': 'overweight',
        'pcos_severity': 'moderate'
    }
    
    recommendations = get_recommendations(sample_user, model, X, recommendations_db)
    
    print("\nSample Recommendations for Test User:")
    for category, recs in recommendations.items():
        print(f"\n{category.upper()}:")
        for rec in recs:
            print(f"- {rec}")
    
    print("\nLifestyle Recommendation Model Development Complete")

if __name__ == "__main__":
    main()