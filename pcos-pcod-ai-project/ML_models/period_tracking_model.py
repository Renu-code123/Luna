import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from statsmodels.tsa.arima.model import ARIMA
from sklearn.metrics import mean_absolute_error
import matplotlib.pyplot as plt
import joblib
import json
import os

# Configuration
MODEL_OUTPUT_PATH = 'period_tracking_model.joblib'
RESULTS_PATH = 'period_model_evaluation_results.txt'

class PeriodTrackingModel:
    """
    Time Series Forecasting model for predicting menstrual cycles
    """
    def __init__(self):
        self.model = None
        self.cycle_stats = None
        self.period_stats = None
        self.regularity_score = None
    
    def create_synthetic_dataset(self, num_users=50, cycles_per_user=12):
        """
        Create a synthetic dataset of menstrual cycles for multiple users
        """
        print("Creating synthetic menstrual cycle dataset...")
        
        np.random.seed(42)
        
        # Define possible cycle patterns
        cycle_patterns = {
            'regular': {'mean': 28, 'std': 2},
            'slightly_irregular': {'mean': 30, 'std': 4},
            'irregular': {'mean': 32, 'std': 7},
            'pcos_like': {'mean': 38, 'std': 10}
        }
        
        # Define possible period length patterns
        period_patterns = {
            'short': {'mean': 3, 'std': 1},
            'medium': {'mean': 5, 'std': 1},
            'long': {'mean': 7, 'std': 2}
        }
        
        # Generate data for multiple users
        all_data = []
        
        for user_id in range(1, num_users + 1):
            # Assign a cycle pattern to this user
            pattern_type = np.random.choice(list(cycle_patterns.keys()))
            period_type = np.random.choice(list(period_patterns.keys()))
            
            cycle_params = cycle_patterns[pattern_type]
            period_params = period_patterns[period_type]
            
            # Generate cycle data
            start_date = datetime(2022, 1, 1) + timedelta(days=np.random.randint(0, 28))
            
            user_cycles = []
            
            for i in range(cycles_per_user):
                # Add some trend/seasonality for more realistic data
                seasonal_effect = 0
                if pattern_type != 'regular':
                    # Add seasonal variation (e.g., stress periods, seasonal changes)
                    seasonal_effect = np.sin(i / 3) * 3 if i > 0 else 0
                
                # Calculate cycle length with some randomness
                if i == 0:
                    cycle_length = 0  # First cycle starts at start_date
                else:
                    cycle_length = max(21, int(np.random.normal(
                        cycle_params['mean'] + seasonal_effect, 
                        cycle_params['std']
                    )))
                
                # Calculate period length
                period_length = max(2, int(np.random.normal(
                    period_params['mean'], 
                    period_params['std']
                )))
                
                # Calculate dates
                if i == 0:
                    cycle_start = start_date
                else:
                    cycle_start = user_cycles[-1]['end_date'] + timedelta(days=cycle_length)
                
                cycle_end = cycle_start + timedelta(days=period_length)
                
                # Add symptoms (more likely during irregular cycles)
                symptoms = []
                symptom_options = ['cramps', 'bloating', 'headache', 'fatigue', 'mood swings']
                symptom_count = np.random.randint(0, 4)
                if pattern_type in ['irregular', 'pcos_like']:
                    symptom_count += 1  # More symptoms for irregular cycles
                
                if symptom_count > 0:
                    symptoms = np.random.choice(symptom_options, symptom_count, replace=False).tolist()
                
                # Add mood
                mood_options = ['irritable', 'tired', 'emotional', 'normal', 'energetic']
                mood = np.random.choice(mood_options)
                
                user_cycles.append({
                    'user_id': user_id,
                    'cycle_number': i + 1,
                    'start_date': cycle_start,
                    'end_date': cycle_end,
                    'cycle_length': cycle_length if i > 0 else None,
                    'period_length': period_length,
                    'symptoms': symptoms,
                    'mood': mood,
                    'pattern_type': pattern_type
                })
            
            all_data.extend(user_cycles)
        
        # Convert to DataFrame
        df = pd.DataFrame(all_data)
        
        # Convert dates to string format for easier handling
        df['start_date'] = df['start_date'].dt.strftime('%Y-%m-%d')
        df['end_date'] = df['end_date'].dt.strftime('%Y-%m-%d')
        
        print(f"Synthetic dataset created with {len(df)} cycle records for {num_users} users")
        return df
    
    def prepare_data_for_user(self, df, user_id):
        """
        Prepare time series data for a specific user
        """
        user_data = df[df['user_id'] == user_id].sort_values('cycle_number')
        
        # Calculate cycle statistics
        cycle_lengths = user_data['cycle_length'].dropna().tolist()
        period_lengths = user_data['period_length'].tolist()
        
        if len(cycle_lengths) < 2:
            return None, None, None, 50  # Not enough data
        
        # Calculate basic statistics
        cycle_stats = {
            'min': min(cycle_lengths),
            'max': max(cycle_lengths),
            'avg': sum(cycle_lengths) / len(cycle_lengths),
            'stdDev': np.std(cycle_lengths)
        }
        
        period_stats = {
            'min': min(period_lengths),
            'max': max(period_lengths),
            'avg': sum(period_lengths) / len(period_lengths),
            'stdDev': np.std(period_lengths)
        }
        
        # Calculate regularity score (0-100)
        # Lower standard deviation means more regular cycles
        normalized_std_dev = min(cycle_stats['stdDev'], 10)
        regularity_score = int(100 - (normalized_std_dev * 10))
        
        return cycle_lengths, cycle_stats, period_stats, regularity_score
    
    def train_model(self, cycle_lengths, order=(1,0,0)):
        """
        Train an ARIMA model on cycle length data
        """
        if len(cycle_lengths) < 3:
            return None
        
        try:
            # Fit ARIMA model
            model = ARIMA(cycle_lengths, order=order)
            model_fit = model.fit()
            return model_fit
        except:
            # Fallback to simpler model if ARIMA fails
            return None
    
    def predict_next_cycles(self, model, cycle_lengths, period_stats, n_cycles=3, base_date=None):
        """
        Predict the next n cycles using the trained model or fallback method
        """
        if base_date is None:
            # Fallback to now - last cycle length if no base_date provided
            last_cycle_length = cycle_lengths[-1] if cycle_lengths else 28
            current_date = datetime.now() - timedelta(days=last_cycle_length)
        else:
            current_date = base_date

        predictions = []
        
        if model is not None:
            # Use ARIMA model for predictions
            try:
                forecast = model.forecast(steps=n_cycles)
                predicted_lengths = [max(21, min(45, int(round(x)))) for x in forecast]
            except:
                # Fallback to weighted average if prediction fails
                predicted_lengths = self._predict_with_weighted_average(cycle_lengths, n_cycles)
        else:
            # Use weighted average method
            predicted_lengths = self._predict_with_weighted_average(cycle_lengths, n_cycles)
        
        # Calculate regularity score based on cycle lengths
        cycle_std_dev = np.std(cycle_lengths) if cycle_lengths else 0
        normalized_std_dev = min(cycle_std_dev, 10)
        regularity_score = int(100 - (normalized_std_dev * 10))
        for i in range(n_cycles):
            cycle_length = predicted_lengths[i]
            next_date = current_date + timedelta(days=cycle_length)
            period_length = max(2, int(round(period_stats['avg'])))
            end_date = next_date + timedelta(days=period_length)
            
            # Calculate fertile window (typically 12-16 days before next period)
            fertile_start = next_date - timedelta(days=16)
            fertile_end = next_date - timedelta(days=12)
            
            # Calculate confidence (decreases for further predictions)
            confidence = max(50, regularity_score - (i * 10))
            
            predictions.append({
                'predicted': True,
                'cycle_number': i + 1,
                'start_date': next_date.strftime('%Y-%m-%d'),
                'end_date': end_date.strftime('%Y-%m-%d'),
                'cycle_length': cycle_length,
                'period_length': period_length,
                'fertile_window_start': fertile_start.strftime('%Y-%m-%d'),
                'fertile_window_end': fertile_end.strftime('%Y-%m-%d'),
                'confidence': confidence
            })
            
            current_date = next_date
        
        return predictions
    
    def _predict_with_weighted_average(self, cycle_lengths, n_cycles):
        """
        Predict cycle lengths using weighted average (fallback method)
        """
        # Use weighted average, giving more weight to recent cycles
        weights = list(range(1, len(cycle_lengths) + 1))
        weighted_avg = sum(x * w for x, w in zip(cycle_lengths, weights)) / sum(weights)
        
        # Add some small random variation for each prediction
        return [max(21, min(45, int(round(weighted_avg + np.random.normal(0, 1))))) for _ in range(n_cycles)]
    
    def evaluate_model(self, df):
        """
        Evaluate the model on multiple users
        """
        print("Evaluating period tracking model...")
        
        results = []
        
        # Select a subset of users for evaluation
        user_ids = df['user_id'].unique()
        eval_users = np.random.choice(user_ids, min(5, len(user_ids)), replace=False)
        
        for user_id in eval_users:
            user_data = df[df['user_id'] == user_id].sort_values('cycle_number')
            
            if len(user_data) < 6:  # Need at least 6 cycles for train/test
                continue
            
            # Split into train/test
            train_data = user_data.iloc[:-3]
            test_data = user_data.iloc[-3:]
            
            # Prepare training data
            cycle_lengths = train_data['cycle_length'].dropna().tolist()
            
            if len(cycle_lengths) < 3:
                continue
                
            # Calculate statistics
            cycle_stats, period_stats, regularity_score = self._calculate_stats(cycle_lengths, train_data['period_length'].tolist())
            
            # Train model
            model = self.train_model(cycle_lengths)
            
            # Make predictions
            predictions = self.predict_next_cycles(model, cycle_lengths, period_stats, n_cycles=3)
            
            # Compare with actual data
            actual_cycles = test_data['cycle_length'].tolist()
            predicted_cycles = [p['cycle_length'] for p in predictions]
            
            # Calculate error metrics
            if len(actual_cycles) > 0 and len(predicted_cycles) > 0:
                mae = mean_absolute_error(actual_cycles[:len(predicted_cycles)], predicted_cycles[:len(actual_cycles)])
            else:
                mae = None
            
            results.append({
                'user_id': int(user_id),
                'pattern_type': user_data['pattern_type'].iloc[0],
                'num_training_cycles': len(cycle_lengths),
                'regularity_score': regularity_score,
                'actual_cycles': actual_cycles,
                'predicted_cycles': predicted_cycles,
                'mae': mae
            })
        
        # Save evaluation results
        with open(RESULTS_PATH, 'w') as f:
            f.write("Period Tracking Model Evaluation\n")
            f.write("===============================\n\n")
            
            for result in results:
                f.write(f"User ID: {result['user_id']}\n")
                f.write(f"Pattern Type: {result['pattern_type']}\n")
                f.write(f"Number of Training Cycles: {result['num_training_cycles']}\n")
                f.write(f"Regularity Score: {result['regularity_score']}\n")
                f.write(f"Actual Cycles: {result['actual_cycles']}\n")
                f.write(f"Predicted Cycles: {result['predicted_cycles']}\n")
                if result['mae'] is not None:
                    f.write(f"Mean Absolute Error: {result['mae']:.2f} days\n")
                f.write("\n")
            
            # Calculate overall metrics
            valid_maes = [r['mae'] for r in results if r['mae'] is not None]
            if valid_maes:
                avg_mae = sum(valid_maes) / len(valid_maes)
                f.write(f"Overall Mean Absolute Error: {avg_mae:.2f} days\n")
        
        print(f"Evaluation results saved to {RESULTS_PATH}")
        return results
    
    def _calculate_stats(self, cycle_lengths, period_lengths):
        """
        Calculate statistics for cycle and period lengths
        """
        cycle_stats = {
            'min': min(cycle_lengths),
            'max': max(cycle_lengths),
            'avg': sum(cycle_lengths) / len(cycle_lengths),
            'stdDev': np.std(cycle_lengths)
        }
        
        period_stats = {
            'min': min(period_lengths),
            'max': max(period_lengths),
            'avg': sum(period_lengths) / len(period_lengths),
            'stdDev': np.std(period_lengths)
        }
        
        # Calculate regularity score
        normalized_std_dev = min(cycle_stats['stdDev'], 10)
        regularity_score = int(100 - (normalized_std_dev * 10))
        
        return cycle_stats, period_stats, regularity_score
    
    def fit(self, user_cycles):
        """
        Fit the model to a user's cycle data
        """
        if len(user_cycles) < 2:
            return {
                'success': False,
                'message': 'Not enough cycle data. Need at least 2 cycles.'
            }
        
        # Extract cycle lengths
        cycle_lengths = []
        period_lengths = []
        
        for i in range(1, len(user_cycles)):
            start_date1 = datetime.strptime(user_cycles[i-1]['startDate'], '%Y-%m-%d')
            start_date2 = datetime.strptime(user_cycles[i]['startDate'], '%Y-%m-%d')
            cycle_length = (start_date2 - start_date1).days
            cycle_lengths.append(cycle_length)
            
            if 'endDate' in user_cycles[i-1] and user_cycles[i-1]['endDate']:
                end_date = datetime.strptime(user_cycles[i-1]['endDate'], '%Y-%m-%d')
                period_length = (end_date - start_date1).days
                period_lengths.append(period_length)
            else:
                # Default period length if not available
                period_lengths.append(5)
        
        # Add the most recent period length
        if len(user_cycles) > 0 and 'endDate' in user_cycles[-1] and user_cycles[-1]['endDate']:
            start_date = datetime.strptime(user_cycles[-1]['startDate'], '%Y-%m-%d')
            end_date = datetime.strptime(user_cycles[-1]['endDate'], '%Y-%m-%d')
            period_lengths.append((end_date - start_date).days)
        
        # Calculate statistics
        self.cycle_stats, self.period_stats, self.regularity_score = self._calculate_stats(cycle_lengths, period_lengths)
        
        # Train model
        self.model = self.train_model(cycle_lengths)
        
        return {
            'success': True,
            'cycle_stats': self.cycle_stats,
            'period_stats': self.period_stats,
            'regularity_score': self.regularity_score
        }
    
    def predict(self, user_cycles, n_cycles=3):
        """
        Predict the next n cycles
        """
        if not self.cycle_stats:
            result = self.fit(user_cycles)
            if not result['success']:
                return {
                    'success': False,
                    'message': result['message']
                }
        
        # Extract cycle lengths for prediction
        cycle_lengths = []
        for i in range(1, len(user_cycles)):
            start_date1 = datetime.strptime(user_cycles[i-1]['startDate'], '%Y-%m-%d')
            start_date2 = datetime.strptime(user_cycles[i]['startDate'], '%Y-%m-%d')
            cycle_length = (start_date2 - start_date1).days
            cycle_lengths.append(cycle_length)
        
        # Make predictions starting from the last entry date
        last_start_date = datetime.strptime(user_cycles[-1]['startDate'], '%Y-%m-%d')
        predictions = self.predict_next_cycles(self.model, cycle_lengths, self.period_stats, n_cycles, base_date=last_start_date)
        
        # Generate chart data
        chart_data = self._generate_chart_data(cycle_lengths, predictions)
        
        return {
            'success': True,
            'predictions': predictions,
            'cycle_stats': self.cycle_stats,
            'period_stats': self.period_stats,
            'regularity_score': self.regularity_score,
            'chart_data': chart_data
        }
    
    def _generate_chart_data(self, cycle_lengths, predictions):
        """
        Generate chart data for visualization
        """
        # Combine actual and predicted cycle lengths
        all_cycle_lengths = cycle_lengths.copy()
        predicted_lengths = [p['cycle_length'] for p in predictions]
        
        # Generate labels (cycle numbers)
        labels = [f"Cycle {i+1}" for i in range(len(all_cycle_lengths) + len(predicted_lengths))]
        
        # Split data into actual and predicted
        actual_data = [{'x': labels[i], 'y': length} for i, length in enumerate(all_cycle_lengths)]
        
        predicted_data = [None] * len(all_cycle_lengths) + [
            {'x': labels[len(all_cycle_lengths) + i], 'y': length} 
            for i, length in enumerate(predicted_lengths)
        ]
        
        return {
            'labels': labels,
            'datasets': [
                {
                    'label': 'Actual Cycle Length',
                    'data': actual_data,
                    'borderColor': '#8A2BE2',
                    'backgroundColor': 'rgba(138, 43, 226, 0.2)',
                    'pointBackgroundColor': '#8A2BE2',
                    'tension': 0.4
                },
                {
                    'label': 'Predicted Cycle Length',
                    'data': predicted_data,
                    'borderColor': '#FF6384',
                    'backgroundColor': 'rgba(255, 99, 132, 0.2)',
                    'pointBackgroundColor': '#FF6384',
                    'borderDash': [5, 5],
                    'tension': 0.4
                }
            ]
        }
    
    def save_model(self):
        """
        Save the trained model to disk
        """
        model_data = {
            'model': self.model,
            'cycle_stats': self.cycle_stats,
            'period_stats': self.period_stats,
            'regularity_score': self.regularity_score
        }
        
        joblib.dump(model_data, MODEL_OUTPUT_PATH)
        print(f"Model saved to {MODEL_OUTPUT_PATH}")

def main():
    """
    Main function to execute the period tracking model pipeline
    """
    print("Starting Period Tracking Model Development")
    
    # Create model instance
    model = PeriodTrackingModel()
    
    # Create synthetic dataset
    df = model.create_synthetic_dataset()
    
    # Evaluate model on multiple users
    model.evaluate_model(df)
    
    # Example of using the model for a single user
    user_id = df['user_id'].iloc[0]
    user_data = df[df['user_id'] == user_id].sort_values('cycle_number')
    
    # Convert to format expected by the model
    user_cycles = []
    for _, row in user_data.iterrows():
        user_cycles.append({
            'startDate': row['start_date'],
            'endDate': row['end_date'],
            'symptoms': row['symptoms'],
            'mood': row['mood']
        })
    
    # Fit model and make predictions
    model.fit(user_cycles)
    result = model.predict(user_cycles)
    
    if result['success']:
        print("\nSample Prediction Results:")
        print(f"Regularity Score: {result['regularity_score']}")
        print(f"Average Cycle Length: {result['cycle_stats']['avg']:.1f} days")
        print(f"Average Period Length: {result['period_stats']['avg']:.1f} days")
        
        print("\nNext 3 Cycle Predictions:")
        for i, pred in enumerate(result['predictions']):
            print(f"Cycle {i+1}:")
            print(f"  Start Date: {pred['start_date']}")
            print(f"  End Date: {pred['end_date']}")
            print(f"  Fertile Window: {pred['fertile_window_start']} to {pred['fertile_window_end']}")
            print(f"  Confidence: {pred['confidence']}%")
    
    # Save the model
    model.save_model()
    
    print("\nPeriod Tracking Model Development Complete")

if __name__ == "__main__":
    main()