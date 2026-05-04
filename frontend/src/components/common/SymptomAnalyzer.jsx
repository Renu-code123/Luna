import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const SymptomAnalyzer = ({ userSymptoms }) => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [correlations, setCorrelations] = useState([]);

  // Common PCOS/PCOD symptoms with their categories
  const symptomCategories = {
    'Irregular periods': 'Menstrual',
    'Missed periods': 'Menstrual',
    'Heavy bleeding': 'Menstrual',
    'Excessive hair growth': 'Hormonal',
    'Hair loss': 'Hormonal',
    'Acne': 'Hormonal',
    'Weight gain': 'Metabolic',
    'Difficulty losing weight': 'Metabolic',
    'Fatigue': 'Metabolic',
    'Mood swings': 'Psychological',
    'Anxiety': 'Psychological',
    'Depression': 'Psychological',
    'Pelvic pain': 'Physical',
    'Headaches': 'Physical',
    'Sleep problems': 'Physical',
    'Darkening of skin': 'Physical',
    'Fertility issues': 'Reproductive'
  };

  // Mock ML model for symptom analysis
  const analyzeSymptoms = async (symptoms) => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Count symptoms by category
    const categoryCounts = {
      'Menstrual': 0,
      'Hormonal': 0,
      'Metabolic': 0,
      'Psychological': 0,
      'Physical': 0,
      'Reproductive': 0
    };
    
    // Calculate severity score for each category
    symptoms.forEach(symptom => {
      const category = symptomCategories[symptom.name] || 'Physical';
      categoryCounts[category] += symptom.severity;
    });
    
    // Calculate overall severity (0-100)
    const maxPossibleScore = Object.keys(categoryCounts).length * 10; // Assuming max severity of 10 per category
    const totalSeverity = Object.values(categoryCounts).reduce((sum, val) => sum + val, 0);
    const overallSeverity = Math.min(Math.round((totalSeverity / maxPossibleScore) * 100), 100);
    
    // Generate symptom pattern data for radar chart
    const patternData = {
      labels: Object.keys(categoryCounts),
      datasets: [
        {
          label: 'Symptom Severity by Category',
          data: Object.values(categoryCounts),
          backgroundColor: 'rgba(138, 43, 226, 0.2)',
          borderColor: '#8A2BE2',
          borderWidth: 2,
          pointBackgroundColor: '#FF6384',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#FF6384'
        }
      ]
    };
    
    // Generate recommendations based on highest severity categories
    const generateRecommendations = () => {
      const recommendations = [];
      const sortedCategories = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
        .filter(([_, value]) => value > 0);
      
      // Add category-specific recommendations
      sortedCategories.forEach(([category, severity]) => {
        if (category === 'Menstrual' && severity > 0) {
          recommendations.push({
            category: 'Menstrual',
            text: 'Track your menstrual cycle consistently to identify patterns and share this data with your healthcare provider.',
            priority: severity > 5 ? 'high' : 'medium'
          });
        }
        
        if (category === 'Hormonal' && severity > 0) {
          recommendations.push({
            category: 'Hormonal',
            text: 'Consider asking your doctor about hormone testing and potential treatments to address hormonal imbalances.',
            priority: severity > 5 ? 'high' : 'medium'
          });
        }
        
        if (category === 'Metabolic' && severity > 0) {
          recommendations.push({
            category: 'Metabolic',
            text: 'Focus on a low-glycemic diet and regular exercise to help manage insulin resistance and metabolic symptoms.',
            priority: severity > 5 ? 'high' : 'medium'
          });
        }
        
        if (category === 'Psychological' && severity > 0) {
          recommendations.push({
            category: 'Psychological',
            text: 'Consider stress-reduction techniques like meditation, yoga, or speaking with a mental health professional.',
            priority: severity > 5 ? 'high' : 'medium'
          });
        }
        
        if (category === 'Physical' && severity > 0) {
          recommendations.push({
            category: 'Physical',
            text: 'Discuss pain management strategies with your healthcare provider and consider anti-inflammatory dietary changes.',
            priority: severity > 5 ? 'high' : 'medium'
          });
        }
        
        if (category === 'Reproductive' && severity > 0) {
          recommendations.push({
            category: 'Reproductive',
            text: 'Consult with a reproductive endocrinologist for specialized care related to fertility concerns.',
            priority: severity > 5 ? 'high' : 'medium'
          });
        }
      });
      
      // Add general recommendations
      if (overallSeverity > 60) {
        recommendations.push({
          category: 'General',
          text: 'Your symptom profile suggests significant PCOS/PCOD indicators. We strongly recommend consulting with a healthcare provider for proper diagnosis and treatment.',
          priority: 'high'
        });
      } else if (overallSeverity > 30) {
        recommendations.push({
          category: 'General',
          text: 'Your symptoms may be related to PCOS/PCOD. Consider scheduling an appointment with a healthcare provider for evaluation.',
          priority: 'medium'
        });
      } else {
        recommendations.push({
          category: 'General',
          text: 'Continue monitoring your symptoms and maintain a healthy lifestyle. If symptoms persist or worsen, consult with a healthcare provider.',
          priority: 'low'
        });
      }
      
      return recommendations;
    };
    
    // Generate symptom correlations
    const generateCorrelations = () => {
      // In a real ML model, this would identify patterns and correlations between symptoms
      const correlations = [];
      
      // Check for common PCOS symptom clusters
      const hasIrregularPeriods = symptoms.some(s => s.name === 'Irregular periods' || s.name === 'Missed periods');
      const hasHormonalSymptoms = symptoms.some(s => s.name === 'Excessive hair growth' || s.name === 'Acne');
      const hasMetabolicSymptoms = symptoms.some(s => s.name === 'Weight gain' || s.name === 'Difficulty losing weight');
      
      if (hasIrregularPeriods && hasHormonalSymptoms) {
        correlations.push({
          title: 'Hormonal Imbalance Pattern',
          description: 'Your combination of menstrual irregularities and hormonal symptoms suggests androgen excess, a common feature of PCOS.',
          confidence: 85
        });
      }
      
      if (hasIrregularPeriods && hasMetabolicSymptoms) {
        correlations.push({
          title: 'Metabolic Pattern',
          description: 'The combination of menstrual irregularities and metabolic symptoms may indicate insulin resistance, which is strongly associated with PCOS.',
          confidence: 80
        });
      }
      
      if (hasHormonalSymptoms && hasMetabolicSymptoms) {
        correlations.push({
          title: 'Classic PCOS Pattern',
          description: 'Your symptom pattern of hormonal and metabolic issues is highly characteristic of PCOS.',
          confidence: 90
        });
      }
      
      // If no specific patterns are found
      if (correlations.length === 0) {
        correlations.push({
          title: 'Mixed Symptom Pattern',
          description: 'Your symptoms show a mixed pattern that requires further evaluation by a healthcare provider.',
          confidence: 60
        });
      }
      
      return correlations;
    };
    
    const recommendations = generateRecommendations();
    const correlations = generateCorrelations();
    
    setAnalysisResult({
      overallSeverity,
      categoryCounts,
      patternData
    });
    
    setRecommendations(recommendations);
    setCorrelations(correlations);
    setLoading(false);
  };
  
  useEffect(() => {
    if (userSymptoms && userSymptoms.length > 0) {
      analyzeSymptoms(userSymptoms);
    }
  }, [userSymptoms]);
  
  // Chart options
  const chartOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 2,
          color: '#ccc'
        },
        pointLabels: {
          color: '#fff',
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#fff',
          font: {
            size: 14
          }
        }
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <div className="neon-card">
        <h2 className="text-2xl font-bold text-neon-pink neon-text mb-6">AI Symptom Analysis</h2>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-neon-pink border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-neon-pink">Analyzing your symptoms...</p>
          </div>
        ) : !userSymptoms || userSymptoms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-soft-white mb-4">Please log your symptoms to generate a personalized analysis.</p>
            <button className="neon-button neon-button-pink">
              Log Symptoms
            </button>
          </div>
        ) : analysisResult ? (
          <div className="space-y-8">
            {/* Severity Score */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center">
                <h3 className="text-xl text-neon-pink mb-4">Symptom Severity Score</h3>
                <div className="relative w-48 h-48">
                  <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                    <div 
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(
                          ${analysisResult.overallSeverity > 70 ? '#FF6384' : 
                            analysisResult.overallSeverity > 40 ? '#FFCE56' : '#36A2EB'} 
                          ${analysisResult.overallSeverity}%, 
                          #2D3748 0%
                        )`,
                        clipPath: 'circle(50% at center)'
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-4xl font-bold text-neon-pink">{analysisResult.overallSeverity}%</span>
                      <span className="text-sm text-soft-white">
                        {analysisResult.overallSeverity > 70 ? 'High' : 
                         analysisResult.overallSeverity > 40 ? 'Moderate' : 'Low'} Severity
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl text-neon-blue mb-4">Symptom Pattern</h3>
                <div className="bg-gray-900 p-4 rounded-lg h-64">
                  <Radar data={analysisResult.patternData} options={chartOptions} />
                </div>
              </div>
            </div>
            
            {/* Correlations Section */}
            <div>
              <h3 className="text-xl text-neon-purple mb-4">Symptom Correlations</h3>
              <div className="space-y-4">
                {correlations.map((correlation, index) => (
                  <div key={index} className="bg-gray-900 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-neon-purple">{correlation.title}</h4>
                      <span className="text-sm px-2 py-1 rounded-full bg-neon-purple/20 text-neon-purple">
                        {correlation.confidence}% confidence
                      </span>
                    </div>
                    <p className="text-soft-white">{correlation.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recommendations Section */}
            <div>
              <h3 className="text-xl text-neon-blue mb-4">Personalized Recommendations</h3>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="bg-gray-900 p-4 rounded-lg border-l-4 border-neon-blue">
                    <div className="flex items-center mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs mr-2 ${
                        rec.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {rec.priority.toUpperCase()}
                      </span>
                      <span className="text-neon-blue font-semibold">{rec.category}</span>
                    </div>
                    <p className="text-soft-white">{rec.text}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <button className="neon-button neon-button-blue">
                Save Analysis to Health Record
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-soft-white">Unable to analyze symptoms. Please try again.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomAnalyzer;