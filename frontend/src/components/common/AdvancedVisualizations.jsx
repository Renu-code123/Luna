import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  LineElement, 
  BarElement, 
  PointElement, 
  BarController, 
  BubbleController, 
  DoughnutController, 
  LineController, 
  PieController, 
  PolarAreaController, 
  RadarController, 
  ScatterController, 
  CategoryScale, 
  LinearScale, 
  LogarithmicScale, 
  RadialLinearScale, 
  TimeScale, 
  TimeSeriesScale, 
  Decimation, 
  Filler, 
  Legend, 
  Title, 
  Tooltip, 
  SubTitle 
} from 'chart.js';
import { Doughnut, Line, Bar, Radar } from 'react-chartjs-2';
import 'chart.js/auto';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  LineElement, 
  BarElement, 
  PointElement, 
  BarController, 
  BubbleController, 
  DoughnutController, 
  LineController, 
  PieController, 
  PolarAreaController, 
  RadarController, 
  ScatterController, 
  CategoryScale, 
  LinearScale, 
  LogarithmicScale, 
  RadialLinearScale, 
  TimeScale, 
  TimeSeriesScale, 
  Decimation, 
  Filler, 
  Legend, 
  Title, 
  Tooltip, 
  SubTitle
);

const AdvancedVisualizations = ({ userData, cycleHistory, symptoms }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // Generate mock data for visualizations
  useEffect(() => {
    // Simulate loading
    setLoading(true);
    
    setTimeout(() => {
      const data = generateDashboardData(userData, cycleHistory, symptoms);
      setDashboardData(data);
      setLoading(false);
    }, 1000);
  }, [userData, cycleHistory, symptoms]);

  const generateDashboardData = (userData, cycleHistory, symptoms) => {
    // Generate comprehensive dashboard data
    return {
      healthTrends: generateHealthTrends(cycleHistory, symptoms),
      symptomCorrelations: generateSymptomCorrelations(symptoms),
      hormonalBalance: generateHormonalBalanceData(userData),
      lifestyleImpact: generateLifestyleImpactData(userData, symptoms),
      treatmentEffectiveness: generateTreatmentData(cycleHistory, symptoms)
    };
  };

  const generateHealthTrends = (cycleHistory, symptoms) => {
    // Generate health trends over time
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    const labels = Array(6).fill().map((_, i) => {
      const monthIndex = (currentMonth - 5 + i + 12) % 12;
      return months[monthIndex];
    });

    return {
      labels,
      datasets: [
        {
          label: 'Symptom Severity',
          data: [7, 6.5, 8, 5, 4, 3],
          borderColor: '#FF6EC7',
          backgroundColor: 'rgba(255, 110, 199, 0.2)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Cycle Regularity',
          data: [5, 6, 7, 7.5, 8, 8.5],
          borderColor: '#3CFBFF',
          backgroundColor: 'rgba(60, 251, 255, 0.2)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Overall Wellbeing',
          data: [4, 4.5, 5, 6, 7, 8],
          borderColor: '#A020F0',
          backgroundColor: 'rgba(160, 32, 240, 0.2)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  };

  const generateSymptomCorrelations = (symptoms) => {
    // Generate symptom correlation data
    return {
      labels: ['Irregular Periods', 'Acne', 'Hair Loss', 'Weight Gain', 'Mood Changes', 'Fatigue'],
      datasets: [
        {
          label: 'Correlation Strength',
          data: [8, 7, 6, 9, 7, 8],
          backgroundColor: [
            'rgba(255, 110, 199, 0.7)',
            'rgba(160, 32, 240, 0.7)',
            'rgba(60, 251, 255, 0.7)',
            'rgba(255, 110, 199, 0.7)',
            'rgba(160, 32, 240, 0.7)',
            'rgba(60, 251, 255, 0.7)'
          ],
          borderColor: [
            'rgba(255, 110, 199, 1)',
            'rgba(160, 32, 240, 1)',
            'rgba(60, 251, 255, 1)',
            'rgba(255, 110, 199, 1)',
            'rgba(160, 32, 240, 1)',
            'rgba(60, 251, 255, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  const generateHormonalBalanceData = (userData) => {
    // Generate hormonal balance visualization data
    return {
      labels: ['Estrogen', 'Progesterone', 'Testosterone', 'Insulin', 'Cortisol', 'FSH', 'LH'],
      datasets: [
        {
          label: 'Your Levels',
          data: [7, 4, 8, 9, 7, 8, 9],
          backgroundColor: 'rgba(160, 32, 240, 0.5)',
          borderColor: 'rgba(160, 32, 240, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(160, 32, 240, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(160, 32, 240, 1)'
        },
        {
          label: 'Optimal Range',
          data: [6, 6, 5, 5, 5, 6, 6],
          backgroundColor: 'rgba(60, 251, 255, 0.5)',
          borderColor: 'rgba(60, 251, 255, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(60, 251, 255, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(60, 251, 255, 1)'
        }
      ]
    };
  };

  const generateLifestyleImpactData = (userData, symptoms) => {
    // Generate lifestyle impact data
    return {
      labels: ['Diet Quality', 'Exercise Frequency', 'Sleep Quality', 'Stress Management', 'Hydration', 'Supplement Use'],
      datasets: [
        {
          label: 'Impact on Symptoms',
          data: [8, 9, 7, 8, 6, 7],
          backgroundColor: [
            'rgba(255, 110, 199, 0.7)',
            'rgba(255, 110, 199, 0.8)',
            'rgba(255, 110, 199, 0.6)',
            'rgba(255, 110, 199, 0.8)',
            'rgba(255, 110, 199, 0.5)',
            'rgba(255, 110, 199, 0.6)'
          ],
          borderColor: 'rgba(255, 110, 199, 1)',
          borderWidth: 1
        }
      ]
    };
  };

  const generateTreatmentData = (cycleHistory, symptoms) => {
    // Generate treatment effectiveness data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Medication Effectiveness',
          data: [30, 45, 60, 70, 75, 85],
          backgroundColor: 'rgba(160, 32, 240, 0.7)',
          borderColor: 'rgba(160, 32, 240, 1)',
          borderWidth: 1
        },
        {
          label: 'Lifestyle Changes Impact',
          data: [20, 35, 50, 65, 75, 80],
          backgroundColor: 'rgba(60, 251, 255, 0.7)',
          borderColor: 'rgba(60, 251, 255, 1)',
          borderWidth: 1
        },
        {
          label: 'Supplement Effectiveness',
          data: [15, 25, 40, 55, 65, 70],
          backgroundColor: 'rgba(255, 110, 199, 0.7)',
          borderColor: 'rgba(255, 110, 199, 1)',
          borderWidth: 1
        }
      ]
    };
  };

  // Chart options
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#F2F2F2',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(13, 13, 13, 0.8)',
        titleColor: '#FF6EC7',
        bodyColor: '#F2F2F2',
        borderColor: '#A020F0',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#F2F2F2'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#F2F2F2'
        }
      }
    }
  };

  const radarOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 2,
          color: '#ccc',
          backdropColor: 'transparent'
        },
        pointLabels: {
          color: '#F2F2F2',
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
        position: 'top',
        labels: {
          color: '#F2F2F2',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(13, 13, 13, 0.8)',
        titleColor: '#FF6EC7',
        bodyColor: '#F2F2F2',
        borderColor: '#A020F0',
        borderWidth: 1
      }
    }
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#F2F2F2',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(13, 13, 13, 0.8)',
        titleColor: '#FF6EC7',
        bodyColor: '#F2F2F2',
        borderColor: '#A020F0',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#F2F2F2'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#F2F2F2'
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#F2F2F2',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(13, 13, 13, 0.8)',
        titleColor: '#FF6EC7',
        bodyColor: '#F2F2F2',
        borderColor: '#A020F0',
        borderWidth: 1
      }
    }
  };

  // Tab navigation
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'health-trends', label: 'Health Trends' },
    { id: 'hormonal', label: 'Hormonal Balance' },
    { id: 'lifestyle', label: 'Lifestyle Impact' },
    { id: 'treatment', label: 'Treatment Tracking' }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      <div className="neon-card">
        <h2 className="text-2xl font-bold text-neon-purple neon-text mb-6">Advanced Health Insights</h2>
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-700 pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-lg transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-gray-800 text-neon-pink neon-text-pink border-b-2 border-neon-pink' 
                  : 'text-soft-white hover:text-neon-blue'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-neon-pink border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-neon-pink">Analyzing your health data...</p>
          </div>
        ) : (
          <>
            {/* Dashboard View */}
            {activeTab === 'dashboard' && dashboardData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="neon-card bg-gray-900">
                  <h3 className="text-xl text-neon-pink mb-4">Health Trends Overview</h3>
                  <div className="h-64">
                    <Line data={dashboardData.healthTrends} options={lineOptions} />
                  </div>
                </div>
                
                <div className="neon-card bg-gray-900">
                  <h3 className="text-xl text-neon-blue mb-4">Hormonal Balance</h3>
                  <div className="h-64">
                    <Radar data={dashboardData.hormonalBalance} options={radarOptions} />
                  </div>
                </div>
                
                <div className="neon-card bg-gray-900">
                  <h3 className="text-xl text-neon-purple mb-4">Symptom Correlations</h3>
                  <div className="h-64">
                    <Bar data={dashboardData.symptomCorrelations} options={barOptions} />
                  </div>
                </div>
                
                <div className="neon-card bg-gray-900">
                  <h3 className="text-xl text-neon-pink mb-4">Treatment Effectiveness</h3>
                  <div className="h-64">
                    <Bar data={dashboardData.treatmentEffectiveness} options={barOptions} />
                  </div>
                </div>
              </div>
            )}
            
            {/* Health Trends View */}
            {activeTab === 'health-trends' && dashboardData && (
              <div className="space-y-8">
                <div className="neon-card bg-gray-900">
                  <h3 className="text-xl text-neon-blue mb-4">Health Metrics Over Time</h3>
                  <div className="h-80">
                    <Line data={dashboardData.healthTrends} options={lineOptions} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="neon-card bg-gray-900">
                    <h3 className="text-xl text-neon-pink mb-4">Symptom Intensity Tracking</h3>
                    <div className="h-64">
                      <Bar data={dashboardData.symptomCorrelations} options={barOptions} />
                    </div>
                  </div>
                  
                  <div className="neon-card bg-gray-900">
                    <h3 className="text-xl text-neon-purple mb-4">Cycle Regularity</h3>
                    <div className="flex items-center justify-center h-64">
                      <div className="relative w-48 h-48">
                        <Doughnut 
                          data={{
                            labels: ['Regular', 'Irregular'],
                            datasets: [{
                              data: [65, 35],
                              backgroundColor: [
                                'rgba(60, 251, 255, 0.7)',
                                'rgba(255, 110, 199, 0.7)'
                              ],
                              borderColor: [
                                'rgba(60, 251, 255, 1)',
                                'rgba(255, 110, 199, 1)'
                              ],
                              borderWidth: 1
                            }]
                          }} 
                          options={doughnutOptions} 
                        />
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <span className="text-2xl font-bold text-neon-blue">65%</span>
                          <span className="text-sm text-soft-white">Regular</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Hormonal Balance View */}
            {activeTab === 'hormonal' && dashboardData && (
              <div className="space-y-8">
                <div className="neon-card bg-gray-900">
                  <h3 className="text-xl text-neon-purple mb-4">Hormonal Balance Profile</h3>
                  <div className="h-80">
                    <Radar data={dashboardData.hormonalBalance} options={radarOptions} />
                  </div>
                  <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                    <h4 className="text-lg text-neon-pink mb-2">Analysis</h4>
                    <p className="text-soft-white mb-4">
                      Your hormonal profile shows elevated levels of testosterone and insulin, which are common in PCOS.
                      The imbalance between FSH and LH is also notable, with LH being significantly higher.
                    </p>
                    <h4 className="text-lg text-neon-blue mb-2">Recommendations</h4>
                    <ul className="list-disc pl-5 text-soft-white">
                      <li className="mb-1">Consider insulin-sensitizing medications or supplements</li>
                      <li className="mb-1">Anti-androgenic treatments may help with testosterone-related symptoms</li>
                      <li className="mb-1">Regular monitoring of hormone levels is recommended</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {/* Lifestyle Impact View */}
            {activeTab === 'lifestyle' && dashboardData && (
              <div className="space-y-8">
                <div className="neon-card bg-gray-900">
                  <h3 className="text-xl text-neon-pink mb-4">Lifestyle Factors Impact</h3>
                  <div className="h-64">
                    <Bar data={dashboardData.lifestyleImpact} options={barOptions} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="neon-card bg-gray-900">
                    <h3 className="text-lg text-neon-blue mb-3">Diet Impact</h3>
                    <div className="flex items-center justify-center h-40">
                      <div className="relative w-32 h-32">
                        <Doughnut 
                          data={{
                            labels: ['Positive', 'Neutral', 'Negative'],
                            datasets: [{
                              data: [70, 20, 10],
                              backgroundColor: [
                                'rgba(60, 251, 255, 0.7)',
                                'rgba(160, 32, 240, 0.7)',
                                'rgba(255, 110, 199, 0.7)'
                              ],
                              borderWidth: 1
                            }]
                          }} 
                          options={{...doughnutOptions, plugins: {...doughnutOptions.plugins, legend: {display: false}}}} 
                        />
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <span className="text-xl font-bold text-neon-blue">70%</span>
                          <span className="text-xs text-soft-white">Positive</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-soft-white mt-3">Low-carb, anti-inflammatory diet shows significant benefits</p>
                  </div>
                  
                  <div className="neon-card bg-gray-900">
                    <h3 className="text-lg text-neon-purple mb-3">Exercise Impact</h3>
                    <div className="flex items-center justify-center h-40">
                      <div className="relative w-32 h-32">
                        <Doughnut 
                          data={{
                            labels: ['Positive', 'Neutral', 'Negative'],
                            datasets: [{
                              data: [80, 15, 5],
                              backgroundColor: [
                                'rgba(60, 251, 255, 0.7)',
                                'rgba(160, 32, 240, 0.7)',
                                'rgba(255, 110, 199, 0.7)'
                              ],
                              borderWidth: 1
                            }]
                          }} 
                          options={{...doughnutOptions, plugins: {...doughnutOptions.plugins, legend: {display: false}}}} 
                        />
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <span className="text-xl font-bold text-neon-purple">80%</span>
                          <span className="text-xs text-soft-white">Positive</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-soft-white mt-3">Regular moderate exercise shows strong correlation with symptom improvement</p>
                  </div>
                  
                  <div className="neon-card bg-gray-900">
                    <h3 className="text-lg text-neon-pink mb-3">Stress Management</h3>
                    <div className="flex items-center justify-center h-40">
                      <div className="relative w-32 h-32">
                        <Doughnut 
                          data={{
                            labels: ['Positive', 'Neutral', 'Negative'],
                            datasets: [{
                              data: [65, 25, 10],
                              backgroundColor: [
                                'rgba(60, 251, 255, 0.7)',
                                'rgba(160, 32, 240, 0.7)',
                                'rgba(255, 110, 199, 0.7)'
                              ],
                              borderWidth: 1
                            }]
                          }} 
                          options={{...doughnutOptions, plugins: {...doughnutOptions.plugins, legend: {display: false}}}} 
                        />
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <span className="text-xl font-bold text-neon-pink">65%</span>
                          <span className="text-xs text-soft-white">Positive</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-soft-white mt-3">Stress reduction techniques show notable impact on hormonal balance</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Treatment Tracking View */}
            {activeTab === 'treatment' && dashboardData && (
              <div className="space-y-8">
                <div className="neon-card bg-gray-900">
                  <h3 className="text-xl text-neon-blue mb-4">Treatment Effectiveness Over Time</h3>
                  <div className="h-80">
                    <Bar data={dashboardData.treatmentEffectiveness} options={barOptions} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="neon-card bg-gray-900">
                    <h3 className="text-xl text-neon-purple mb-4">Treatment Comparison</h3>
                    <div className="h-64">
                      <Radar 
                        data={{
                          labels: ['Symptom Relief', 'Cycle Regulation', 'Hormone Balance', 'Side Effects (less is better)', 'Ease of Use', 'Cost Effectiveness'],
                          datasets: [
                            {
                              label: 'Medication',
                              data: [8, 9, 8, 4, 7, 5],
                              backgroundColor: 'rgba(255, 110, 199, 0.3)',
                              borderColor: 'rgba(255, 110, 199, 1)',
                              borderWidth: 2,
                              pointBackgroundColor: 'rgba(255, 110, 199, 1)',
                            },
                            {
                              label: 'Lifestyle Changes',
                              data: [7, 6, 7, 9, 5, 9],
                              backgroundColor: 'rgba(60, 251, 255, 0.3)',
                              borderColor: 'rgba(60, 251, 255, 1)',
                              borderWidth: 2,
                              pointBackgroundColor: 'rgba(60, 251, 255, 1)',
                            }
                          ]
                        }} 
                        options={radarOptions} 
                      />
                    </div>
                  </div>
                  
                  <div className="neon-card bg-gray-900">
                    <h3 className="text-xl text-neon-pink mb-4">Symptom Improvement</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-soft-white">Irregular Periods</span>
                          <span className="text-neon-blue">75%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div className="bg-neon-blue h-2.5 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-soft-white">Acne</span>
                          <span className="text-neon-purple">60%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div className="bg-neon-purple h-2.5 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-soft-white">Hair Loss</span>
                          <span className="text-neon-pink">45%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div className="bg-neon-pink h-2.5 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-soft-white">Weight Management</span>
                          <span className="text-neon-blue">65%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div className="bg-neon-blue h-2.5 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-soft-white">Mood Swings</span>
                          <span className="text-neon-purple">80%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div className="bg-neon-purple h-2.5 rounded-full" style={{ width: '80%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdvancedVisualizations;