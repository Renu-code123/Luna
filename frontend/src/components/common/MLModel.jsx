import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const MLModel = ({ userData }) => {
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modelInsights, setModelInsights] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [featureImportance, setFeatureImportance] = useState({});

  // Mock ML model prediction function (in production, this would call the backend API)
  const runPredictionModel = async (data) => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock prediction algorithm based on user data
    const calculateRisk = () => {
      let score = 0;
      const factors = [];
      
      // Age factor (higher risk between 15-35)
      if (data.age >= 15 && data.age <= 35) {
        score += 10;
        factors.push('Age between 15-35');
      }
      
      // BMI factor
      if (data.bmi >= 25) {
        score += 15;
        factors.push('BMI above 25');
      }
      
      // Family history
      if (data.familyHistory) {
        score += 20;
        factors.push('Family history of PCOS/PCOD');
      }
      
      // Already diagnosed
      if (data.diagnosedWithPCOS) {
        score += 30;
        factors.push('Previous PCOS/PCOD diagnosis');
      }
      
      // Symptoms
      const highRiskSymptoms = ['Irregular periods', 'Excessive hair growth', 'Weight gain', 'Acne', 'Hair loss'];
      let symptomCount = 0;
      
      if (data.symptoms && data.symptoms.length > 0) {
        data.symptoms.forEach(symptom => {
          if (highRiskSymptoms.includes(symptom)) {
            symptomCount++;
          }
        });
        
        score += symptomCount * 5;
        
        if (symptomCount > 0) {
          factors.push(`${symptomCount} PCOS-related symptoms`);
        }
      }
      
      // Lifestyle factors
      if (data.lifestyleFactors) {
        if (!data.lifestyleFactors.exercise) {
          score += 5;
          factors.push('Sedentary lifestyle');
        }
        
        if (data.lifestyleFactors.stress && data.lifestyleFactors.stress > 7) {
          score += 5;
          factors.push('High stress levels');
        }
        
        if (data.lifestyleFactors.sleep && data.lifestyleFactors.sleep < 6) {
          score += 5;
          factors.push('Poor sleep habits');
        }
      }
      
      // Cap score at 100
      score = Math.min(score, 100);
      
      // Determine risk level
      let level;
      if (score < 30) {
        level = 'low';
      } else if (score < 60) {
        level = 'moderate';
      } else {
        level = 'high';
      }
      
      return {
        score,
        level,
        factors
      };
    };
    
    const result = calculateRisk();
    
    // Generate mock feature importance
    const mockFeatureImportance = {
      'BMI': 0.25,
      'Family History': 0.20,
      'Irregular Periods': 0.18,
      'Age': 0.12,
      'Hormone Levels': 0.10,
      'Lifestyle': 0.08,
      'Stress': 0.07
    };
    
    // Generate mock historical data (in production, this would come from the database)
    const mockHistoricalData = [
      { month: 'Jan', risk: 45 },
      { month: 'Feb', risk: 48 },
      { month: 'Mar', risk: 52 },
      { month: 'Apr', risk: 49 },
      { month: 'May', risk: result.score }
    ];
    
    // Generate model insights based on the prediction
    const generateInsights = (result) => {
      const insights = [];
      
      if (result.level === 'high') {
        insights.push('Your risk factors indicate a high likelihood of PCOS/PCOD. We recommend consulting with a specialist.');
        insights.push('Regular monitoring of hormone levels is advised.');
      } else if (result.level === 'moderate') {
        insights.push('You have some risk factors for PCOS/PCOD. Consider lifestyle modifications and regular check-ups.');
        insights.push('Track your symptoms closely to monitor any changes.');
      } else {
        insights.push('Your risk factors for PCOS/PCOD are currently low. Continue maintaining a healthy lifestyle.');
        insights.push('Regular check-ups are still recommended for early detection of any changes.');
      }
      
      // Add personalized insights based on specific factors
      if (result.factors.includes('BMI above 25')) {
        insights.push('Weight management could help reduce your PCOS/PCOD risk. Consider consulting with a nutritionist.');
      }
      
      if (result.factors.includes('Sedentary lifestyle')) {
        insights.push('Regular exercise can help manage PCOS/PCOD symptoms. Aim for at least 150 minutes of moderate activity per week.');
      }
      
      return insights;
    };
    
    setPredictionResult(result);
    setFeatureImportance(mockFeatureImportance);
    setHistoricalData(mockHistoricalData);
    setModelInsights(generateInsights(result));
    setLoading(false);
  };
  
  useEffect(() => {
    if (userData) {
      runPredictionModel(userData);
    }
  }, [userData]);
  
  // Chart data for doughnut chart
  const doughnutData = {
    labels: ['Risk Score', 'Remaining'],
    datasets: [
      {
        data: predictionResult ? [predictionResult.score, 100 - predictionResult.score] : [0, 100],
        backgroundColor: [
          predictionResult && predictionResult.level === 'high' ? '#FF6384' : 
          predictionResult && predictionResult.level === 'moderate' ? '#FFCE56' : '#36A2EB',
          '#E7E9ED'
        ],
        borderWidth: 0,
      },
    ],
  };
  
  // Chart data for line chart
  const lineData = {
    labels: historicalData.map(data => data.month),
    datasets: [
      {
        label: 'Risk Score Trend',
        data: historicalData.map(data => data.risk),
        borderColor: '#8A2BE2',
        backgroundColor: 'rgba(138, 43, 226, 0.2)',
        tension: 0.4,
      },
    ],
  };
  
  // Chart options
  const doughnutOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Risk Score: ${context.raw}%`;
          }
        }
      }
    },
  };
  
  const lineOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ccc',
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ccc',
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#fff',
        }
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <div className="neon-card">
        <h2 className="text-2xl font-bold text-neon-blue neon-text mb-6">AI-Powered PCOS/PCOD Risk Analysis</h2>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-neon-purple">Running advanced ML model...</p>
          </div>
        ) : predictionResult ? (
          <div className="space-y-8">
            {/* Risk Score Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center">
                <h3 className="text-xl text-neon-pink mb-4">Your Risk Score</h3>
                <div className="relative w-48 h-48">
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-4xl font-bold text-neon-pink">{predictionResult.score}%</span>
                    <span className="text-sm text-soft-white capitalize">{predictionResult.level} risk</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl text-neon-blue mb-4">Risk Factors</h3>
                <ul className="space-y-2">
                  {predictionResult.factors.map((factor, index) => (
                    <li key={index} className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-neon-pink rounded-full mr-2"></span>
                      <span className="text-soft-white">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Historical Data Section */}
            <div>
              <h3 className="text-xl text-neon-purple mb-4">Risk Score Trend</h3>
              <div className="bg-gray-900 p-4 rounded-lg">
                <Line data={lineData} options={lineOptions} />
              </div>
            </div>
            
            {/* Feature Importance Section */}
            <div>
              <h3 className="text-xl text-neon-blue mb-4">Feature Importance</h3>
              <div className="bg-gray-900 p-4 rounded-lg">
                <div className="space-y-3">
                  {Object.entries(featureImportance).map(([feature, importance]) => (
                    <div key={feature} className="flex flex-col">
                      <div className="flex justify-between mb-1">
                        <span className="text-soft-white">{feature}</span>
                        <span className="text-neon-pink">{Math.round(importance * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-neon-blue to-neon-pink h-2 rounded-full" 
                          style={{ width: `${importance * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Model Insights Section */}
            <div>
              <h3 className="text-xl text-neon-purple mb-4">AI-Generated Insights</h3>
              <div className="bg-gray-900 p-4 rounded-lg">
                <ul className="space-y-3">
                  {modelInsights.map((insight, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-6 h-6 bg-neon-purple text-dark rounded-full flex items-center justify-center mr-2 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-soft-white">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="text-center">
              <button className="neon-button neon-button-blue">
                Download Full Report
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-soft-white mb-4">Please complete your profile to generate a personalized risk assessment.</p>
            <button className="neon-button neon-button-pink">
              Complete Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MLModel;