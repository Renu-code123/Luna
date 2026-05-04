import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from joblib import dump
import os

# %% [markdown]
# # Configuration and File Paths
# Defines the input and output file paths for the datasets and generated files.

# %%
# --- Configuration ---
# Primary dataset path
DATASET_PATH = 'PCOS_data_without_infertility.xlsx - Full_new.csv'
# Secondary dataset path (for reference, not used in this primary pipeline)
DATASET_INFERTILITY_PATH = 'PCOS_infertility.csv' 

# Output paths for cleaned and split data
CLEANED_DATA_PATH = 'cleaned_pcos_data.csv'
TRAIN_DATA_PATH = 'pcos_train_data.csv'
TEST_DATA_PATH = 'pcos_test_data.csv'
SELECTED_FEATURES_PATH = 'selected_features.txt'

# %% [markdown]
# # 1. Data Cleaning and Missing Value Imputation
# Standardizes column names, handles known missing value indicators (like 1.99), 
# and imputes remaining NaNs using median (for continuous) or mode (for categorical).

# %%
def clean_data(df):
    """
    Cleans the PCOS dataset by standardizing column names, handling missing 
    values, and ensuring correct data types.
    """
    print("--- Starting Data Cleaning ---")
    
    # Standardize Column Names
    df.columns = df.columns.str.strip()
    df.columns = df.columns.str.replace(r'[^\w\s]', '', regex=True)
    df.columns = df.columns.str.replace(r'\s+', '_', regex=True)
    df.rename(columns={'PCOS_YN': 'PCOS'}, inplace=True)

    # Handle known data peculiarities (1.99 as NaN, BMI=0 as NaN)
    cols_to_check = [
        'I_betaHCGmIUmL', 'II_betaHCGmIUmL', 'AMHngmL', 'FSHmIUmL', 'LHmIUmL', 
        'FSHLH', 'TSHmIUL', 'PRLngmL', 'Vit_D3_ngmL', 'PRGngmL'
    ]
    df[cols_to_check] = df[cols_to_check].replace(1.99, np.nan)
    df['BMI'] = df['BMI'].replace(0, np.nan) 

    # Handle Missing Values (Imputation)
    print(f"Initial missing value count:\n{df.isnull().sum()[df.isnull().sum() > 0]}")

    # Median imputation for continuous variables
    imputation_cols_median = [
        'Age_yrs', 'Weight_Kg', 'HeightCm', 'BMI', 'Pulse_ratebpm', 'RR_breathsmin',
        'Hb_gdl', 'Cycle_lengthdays', 'Marraige_Status_Yrs', 'I_betaHCGmIUmL',
        'II_betaHCGmIUmL', 'FSHmIUmL', 'LHmIUmL', 'FSHLH', 'TSHmIUL', 'AMHngmL', 
        'PRLngmL', 'Vit_D3_ngmL', 'PRGngmL', 'RBSmgdl', 'BP_Systolic_mmHg', 
        'BP_Diastolic_mmHg', 'Follicle_No_L', 'Follicle_No_R', 
        'Avg_F_size_L_mm', 'Avg_F_size_R_mm', 'Endometrium_mm'
    ]
    for col in imputation_cols_median:
        if col in df.columns:
            df[col].fillna(df[col].median(), inplace=True)

    # Mode imputation for categorical/binary features
    categorical_cols_mode = ['Blood_Group', 'Cycle_RI', 'PregnantYN', 'Weight_gainYN', 
                        'hair_growthYN', 'Skin_darkening_YN', 'Hair_lossYN', 
                        'PimplesYN', 'Fast_food_YN', 'Reg_ExerciseYN']
    for col in categorical_cols_mode:
        if col in df.columns:
            df[col].fillna(df[col].mode()[0], inplace=True)
            
    # Drop Irrelevant Columns
    cols_to_drop = ['Sl_No', 'Patient_File_No'] 
    df.drop(columns=cols_to_drop, inplace=True, errors='ignore')
    
    # Type conversion
    df['PCOS'] = df['PCOS'].astype(int)

    print(f"\nMissing value count after cleaning:\n{df.isnull().sum()[df.isnull().sum() > 0]}")
    print(f"\nCleaned data shape: {df.shape}")
    print("--- Data Cleaning Complete ---")
    return df

# %% [markdown]
# # 2. Feature Engineering and Exploratory Data Analysis (EDA)
# Creates composite features and calculates correlation with the target variable (`PCOS`).

# %%
def feature_engineering_and_eda(X, y):
    """
    Performs feature engineering and prints feature correlation for EDA.
    Returns the dataframe with new engineered features.
    """
    print("\n--- Feature Engineering ---")
    
    # 1. Create Total Follicle Count (PCOM indicator)
    X['Follicle_No_Total'] = X['Follicle_No_L'] + X['Follicle_No_R']
    
    # 2. Create Average Follicle Size
    X['Avg_F_size_Mean'] = (X['Avg_F_size_L_mm'] + X['Avg_F_size_R_mm']) / 2
    
    # Prepare 'Blood_Group' for later encoding (It's not 0/1 binary)
    X['Blood_Group'] = X['Blood_Group'].astype(str) 

    print("New features created: 'Follicle_No_Total', 'Avg_F_size_Mean'")

    # --- EDA: Correlation Check ---
    print("\n--- Exploratory Data Analysis: Correlation with PCOS ---")
    
    # Recombine X and y to calculate correlation (only using numerical features for simplicity)
    df_temp = pd.concat([X.select_dtypes(include=np.number), y], axis=1)
    
    # Calculate correlation matrix
    correlations = df_temp.corr()['PCOS'].sort_values(ascending=False)
    
    # Print top 15 most relevant features
    print("\nTop 15 Features by Absolute Correlation with PCOS:")
    # Remove 'PCOS' itself and sort by absolute value
    top_correlations = correlations.drop('PCOS').abs().sort_values(ascending=False).head(15)
    print(top_correlations.to_string()) 
    
    return X

# %% [markdown]
# # 3. Feature Selection
# Uses a Random Forest Classifier to determine feature importance and selects the top features.

# %%
def select_features_by_importance(X, y, k=15):
    """Trains a quick Random Forest model to determine feature importance."""
    print(f"\n--- Feature Selection: Identifying Top {k} Features ---")
    
    # Temporarily drop 'Blood_Group' for this simple importance check (as it's categorical)
    # We will include it back if it's not present in the top K for OHE later.
    X_temp = X.drop(columns=['Blood_Group']) 
    
    # Quick fit of a Random Forest Classifier
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(X_temp, y)
    
    # Get feature importance
    feature_importances = pd.Series(rf.feature_importances_, index=X_temp.columns)
    
    # Select the top K features
    top_features = feature_importances.nlargest(k).index.tolist()
    
    # Ensure 'Blood_Group' is always included as it is a unique nominal variable
    if 'Blood_Group' not in top_features:
        top_features.append('Blood_Group')
        top_features = list(dict.fromkeys(top_features)) # Ensure uniqueness

    print(f"\nTop {len(top_features)} selected features:")
    for i, feature in enumerate(top_features):
        print(f"{i+1}. {feature}")
        
    return top_features

# %% [markdown]
# # 4. Data Splitting and Saving
# Splits the cleaned data into training and testing sets (80/20 split) using stratification 
# and saves all output files.
# 
# **Output File Explanation:**
# 
# 1.  **`cleaned_pcos_data.csv` (100% of Data):** The complete dataset after cleaning, imputation, and feature engineering. This is the **archive** of the final, processed population data, containing only the selected features.
# 2.  **`pcos_train_data.csv` (~80% of Data):** The crucial subset of data used exclusively to **train** the Machine Learning model. The model learns patterns only from this file.
# 3.  **`pcos_test_data.csv` (~20% of Data):** The subset of data kept strictly separate, used only once at the end to provide an **unbiased evaluation** of the final model's performance.

# %%
def split_data(df, target_col='PCOS', test_size=0.2, random_state=42):
    """
    Splits the cleaned data into training and testing sets using stratified sampling.
    """
    print("\n--- Splitting Data into Training and Testing Sets ---")
    
    # Separate features (X) and target (y)
    X = df.drop(columns=[target_col])
    y = df[target_col]
    
    # Use stratified split to maintain the ratio of PCOS/Non-PCOS in both sets
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, 
        test_size=test_size, 
        random_state=random_state, 
        stratify=y 
    )
    
    # Recombine X and y for saving as complete CSV files
    df_train = pd.concat([X_train, y_train], axis=1)
    df_test = pd.concat([X_test, y_test], axis=1)
    
    print(f"Training Data Shape: {df_train.shape}")
    print(f"Testing Data Shape: {df_test.shape}")
    return df_train, df_test

# %% [markdown]
# # Main Execution Block

# %%
if __name__ == '__main__':
    try:
        # 1. Load the primary dataset
        df = pd.read_csv(DATASET_PATH)
        print(f"Successfully loaded dataset from: {DATASET_PATH}")
        print(f"Original shape: {df.shape}")

        # 2. Clean the data
        cleaned_df = clean_data(df.copy())
        
        # 3. Separate features (X) and target (y)
        X_full = cleaned_df.drop(columns=['PCOS'])
        y = cleaned_df['PCOS']

        # 4. Feature Engineering and EDA
        X_engineered = feature_engineering_and_eda(X_full, y)
        
        # 5. Feature Selection
        selected_features = select_features_by_importance(X_engineered, y)
        
        # Filter the DataFrame to include ONLY the selected features plus the target
        df_selected = X_engineered[selected_features].copy()
        df_selected['PCOS'] = y 
        
        # 6. Split the selected data
        df_train, df_test = split_data(df_selected)
        
        # 7. Save all resulting dataframes and feature list
        df_selected.to_csv(CLEANED_DATA_PATH, index=False)
        df_train.to_csv(TRAIN_DATA_PATH, index=False)
        df_test.to_csv(TEST_DATA_PATH, index=False)
        
        # Save the list of selected features for use in the model training script
        with open(SELECTED_FEATURES_PATH, 'w') as f:
            for item in selected_features:
                f.write(f"{item}\n")

        print("\n--- Data Saving Status ---")
        print(f"Full cleaned dataset (selected features only) saved successfully to: {CLEANED_DATA_PATH}")
        print(f"Training dataset saved successfully to: {TRAIN_DATA_PATH}")
        print(f"Testing dataset saved successfully to: {TEST_DATA_PATH}")
        print(f"Selected features list saved to: {SELECTED_FEATURES_PATH}")

    except FileNotFoundError:
        print(f"Error: Dataset not found at {DATASET_PATH}. Please check the file path.")
    except Exception as e:
        print(f"An error occurred during data preparation and feature selection: {e}")