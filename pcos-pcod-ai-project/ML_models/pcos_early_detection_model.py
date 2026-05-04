import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
from sklearn.impute import SimpleImputer
import joblib
import os
import matplotlib.pyplot as plt
import seaborn as sns

# Configuration
MODEL_OUTPUT_PATH = 'pcos_early_detection_model.joblib'
RESULTS_PATH = 'model_evaluation_results.txt'
FEATURE_IMPORTANCE_PATH = 'feature_importance.png'

def load_and_prepare_data():
    """
    Load and prepare the PCOS dataset for model training
    """
    print("Loading and preparing data...")
    
    try:
        # Load the CSV file
        df = pd.read_csv('../Dataset/PCOS_infertility.csv')
        print("Loaded PCOS_infertility.csv")
        
        # Rename target column for consistency
        if 'PCOS (Y/N)' in df.columns:
            df.rename(columns={'PCOS (Y/N)': 'PCOS'}, inplace=True)
        
        # Drop ID columns
        df = df.drop(columns=['Sl. No', 'Patient File No.'], errors='ignore')
        
        # Handle missing values in hormone measurements
        # 1.99 is a placeholder for missing values in this dataset
        hormone_cols = ['  I   beta-HCG(mIU/mL)', 'II    beta-HCG(mIU/mL)', 'AMH(ng/mL)']
        for col in hormone_cols:
            df[col] = df[col].replace(1.99, np.nan)
        
        # Fill missing values with median
        for col in df.columns:
            if col != 'PCOS' and df[col].dtype in ['float64', 'int64']:
                df[col] = df[col].fillna(df[col].median())
        
        # Separate features and target
        X = df.drop(columns=['PCOS'])
        y = df['PCOS']
        
        print(f"Data loaded successfully. Features: {X.shape}, Target: {y.shape}")
        return X, y
        
    except Exception as e:
        print(f"Error loading data: {e}")
        return None, None

def build_model_pipeline(X):
    """
    Build a machine learning pipeline for PCOS early detection
    """
    # Identify numeric and categorical columns
    numeric_features = X.select_dtypes(include=['int64', 'float64']).columns
    categorical_features = X.select_dtypes(include=['object', 'category']).columns
    
    # Preprocessing for numerical features
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    
    # Preprocessing for categorical features
    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])
    
    # Combine preprocessing steps
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ])
    
    # Create the full pipeline with Random Forest classifier
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(random_state=42))
    ])
    
    return pipeline

def train_and_evaluate_model(X, y):
    """
    Train and evaluate the PCOS early detection model
    """
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    print(f"Training data shape: {X_train.shape}")
    print(f"Testing data shape: {X_test.shape}")
    
    # Build the pipeline
    pipeline = build_model_pipeline(X)
    
    # Define hyperparameters for grid search
    param_grid = {
        'classifier__n_estimators': [100, 200],
        'classifier__max_depth': [None, 10, 20],
        'classifier__min_samples_split': [2, 5]
    }
    
    # Perform grid search
    print("Performing grid search for hyperparameter tuning...")
    grid_search = GridSearchCV(pipeline, param_grid, cv=5, scoring='f1', n_jobs=-1)
    grid_search.fit(X_train, y_train)
    
    # Get the best model
    best_model = grid_search.best_estimator_
    print(f"Best parameters: {grid_search.best_params_}")
    
    # Make predictions
    y_pred = best_model.predict(X_test)
    y_prob = best_model.predict_proba(X_test)[:, 1]
    
    # Calculate metrics
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_prob)
    conf_matrix = confusion_matrix(y_test, y_pred)
    
    # Print and save results
    results = f"""
    PCOS Early Detection Model Evaluation Results:
    ---------------------------------------------
    Accuracy: {accuracy:.4f}
    Precision: {precision:.4f}
    Recall: {recall:.4f}
    F1 Score: {f1:.4f}
    ROC AUC: {roc_auc:.4f}
    
    Confusion Matrix:
    {conf_matrix}
    
    Best Model Parameters:
    {grid_search.best_params_}
    """
    
    print(results)
    
    # Save results to file
    with open(RESULTS_PATH, 'w') as f:
        f.write(results)
    
    # Extract feature importance if using Random Forest
    if isinstance(best_model.named_steps['classifier'], RandomForestClassifier):
        # Get feature names after preprocessing
        feature_names = []
        
        # For numeric features
        if hasattr(best_model.named_steps['preprocessor'].transformers_[0][1], 'get_feature_names_out'):
            feature_names.extend(
                best_model.named_steps['preprocessor'].transformers_[0][1].get_feature_names_out(
                    X.select_dtypes(include=['int64', 'float64']).columns
                )
            )
        else:
            feature_names.extend(X.select_dtypes(include=['int64', 'float64']).columns)
        
        # For categorical features (if any)
        if len(best_model.named_steps['preprocessor'].transformers_) > 1 and len(X.select_dtypes(include=['object', 'category']).columns) > 0:
            if hasattr(best_model.named_steps['preprocessor'].transformers_[1][1].named_steps['onehot'], 'get_feature_names_out'):
                feature_names.extend(
                    best_model.named_steps['preprocessor'].transformers_[1][1].named_steps['onehot'].get_feature_names_out(
                        X.select_dtypes(include=['object', 'category']).columns
                    )
                )
        
        # Get feature importances
        importances = best_model.named_steps['classifier'].feature_importances_
        
        # Plot feature importances
        plt.figure(figsize=(12, 8))
        if len(feature_names) == len(importances):
            indices = np.argsort(importances)[-20:]  # Get indices of top 20 features
            plt.title('Top 20 Feature Importances for PCOS Early Detection')
            plt.barh(range(len(indices)), importances[indices], align='center')
            plt.yticks(range(len(indices)), [feature_names[i] for i in indices])
            plt.xlabel('Relative Importance')
            plt.tight_layout()
            plt.savefig(FEATURE_IMPORTANCE_PATH)
            print(f"Feature importance plot saved to {FEATURE_IMPORTANCE_PATH}")
        else:
            print(f"Warning: Feature names ({len(feature_names)}) and importances ({len(importances)}) length mismatch")
    
    return best_model

def save_model(model):
    """
    Save the trained model to disk
    """
    joblib.dump(model, MODEL_OUTPUT_PATH)
    print(f"Model saved to {MODEL_OUTPUT_PATH}")

def main():
    """
    Main function to execute the PCOS early detection model pipeline
    """
    print("Starting PCOS Early Detection Model Development")
    
    # Load and prepare data
    X, y = load_and_prepare_data()
    if X is None or y is None:
        print("Failed to load or prepare data. Exiting.")
        return
    
    # Train and evaluate model
    model = train_and_evaluate_model(X, y)
    
    # Save the model
    save_model(model)
    
    print("PCOS Early Detection Model Development Complete")

if __name__ == "__main__":
    main()