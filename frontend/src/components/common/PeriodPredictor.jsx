import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PeriodPredictor = ({ cycleHistory }) => {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cycleStats, setCycleStats] = useState(null);
  const [regularityScore, setRegularityScore] = useState(0);
  const [nextThreeCycles, setNextThreeCycles] = useState([]);

  // Mock ML model for period prediction
  const predictCycles = async (history) => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Calculate cycle lengths
    const cycleLengths = [];
    for (let i = 1; i < history.length; i++) {
      const startDate1 = new Date(history[i-1].startDate);
      const startDate2 = new Date(history[i].startDate);
      const diffTime = Math.abs(startDate2 - startDate1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      cycleLengths.push(diffDays);
    }
    
    // Calculate period lengths
    const periodLengths = history.map(cycle => {
      if (!cycle.endDate) return 0;
      const startDate = new Date(cycle.startDate);
      const endDate = new Date(cycle.endDate);
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    });
    
    // Calculate statistics
    const calculateStats = (arr) => {
      if (arr.length === 0) return { avg: 0, min: 0, max: 0, stdDev: 0 };
      
      const sum = arr.reduce((a, b) => a + b, 0);
      const avg = sum / arr.length;
      const min = Math.min(...arr);
      const max = Math.max(...arr);
      
      const squareDiffs = arr.map(value => {
        const diff = value - avg;
        return diff * diff;
      });
      const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
      const stdDev = Math.sqrt(avgSquareDiff);
      
      return { avg, min, max, stdDev };
    };
    
    const cycleStats = calculateStats(cycleLengths);
    const periodStats = calculateStats(periodLengths);
    
    // Calculate regularity score (0-100)
    // Lower standard deviation means more regular cycles
    const calculateRegularityScore = () => {
      if (cycleLengths.length < 2) return 50; // Not enough data
      
      // Normalize standard deviation to a 0-100 scale
      // A perfectly regular cycle would have stdDev = 0
      // We consider stdDev > 10 as very irregular (score approaching 0)
      const normalizedStdDev = Math.min(cycleStats.stdDev, 10);
      const regularityScore = 100 - (normalizedStdDev * 10);
      
      return Math.round(regularityScore);
    };
    
    const regularityScore = calculateRegularityScore();
    
    // Predict next three cycles using weighted average
    const predictNextCycles = () => {
      if (history.length < 2) {
        return [
          { predicted: true, startDate: 'Not enough data', endDate: 'Not enough data' },
          { predicted: true, startDate: 'Not enough data', endDate: 'Not enough data' },
          { predicted: true, startDate: 'Not enough data', endDate: 'Not enough data' }
        ];
      }
      
      // Use weighted average of cycle lengths, giving more weight to recent cycles
      const weights = cycleLengths.map((_, index) => index + 1);
      const weightSum = weights.reduce((a, b) => a + b, 0);
      
      const weightedCycleLength = cycleLengths.reduce((sum, length, index) => {
        return sum + (length * weights[index]);
      }, 0) / weightSum;
      
      const weightedPeriodLength = periodLengths.reduce((sum, length, index) => {
        return sum + (length * weights[index]);
      }, 0) / weightSum;
      
      // Get the most recent cycle start date
      const lastCycleStart = new Date(history[history.length - 1].startDate);
      
      // Predict next three cycles
      const nextCycles = [];
      let nextStartDate = new Date(lastCycleStart);
      
      for (let i = 0; i < 3; i++) {
        nextStartDate = new Date(nextStartDate.getTime() + (Math.round(weightedCycleLength) * 24 * 60 * 60 * 1000));
        const nextEndDate = new Date(nextStartDate.getTime() + (Math.round(weightedPeriodLength) * 24 * 60 * 60 * 1000));
        
        nextCycles.push({
          predicted: true,
          startDate: nextStartDate.toISOString().split('T')[0],
          endDate: nextEndDate.toISOString().split('T')[0],
          confidence: Math.max(50, regularityScore - (i * 10)) // Confidence decreases for further predictions
        });
      }
      
      return nextCycles;
    };
    
    const nextThreeCycles = predictNextCycles();
    
    // Calculate fertile window for each predicted cycle
    // Typically 12-16 days before next period
    const calculateFertileWindows = (predictedCycles) => {
      return predictedCycles.map(cycle => {
        if (cycle.startDate === 'Not enough data') return cycle;
        
        const cycleStartDate = new Date(cycle.startDate);
        const fertileStartDate = new Date(cycleStartDate);
        fertileStartDate.setDate(fertileStartDate.getDate() - 16);
        
        const fertileEndDate = new Date(cycleStartDate);
        fertileEndDate.setDate(fertileEndDate.getDate() - 12);
        
        return {
          ...cycle,
          fertileWindowStart: fertileStartDate.toISOString().split('T')[0],
          fertileWindowEnd: fertileEndDate.toISOString().split('T')[0]
        };
      });
    };
    
    const cyclesWithFertileWindows = calculateFertileWindows(nextThreeCycles);
    
    // Generate chart data for cycle length visualization
    const generateChartData = () => {
      // Combine actual and predicted cycle lengths
      const allCycleLengths = [...cycleLengths];
      
      // Add predicted cycle lengths
      nextThreeCycles.forEach(() => {
        allCycleLengths.push(Math.round(cycleStats.avg));
      });
      
      // Generate labels (cycle numbers)
      const labels = Array.from({ length: allCycleLengths.length }, (_, i) => `Cycle ${i + 1}`);
      
      // Split data into actual and predicted
      const actualData = cycleLengths.map((length, index) => ({
        x: labels[index],
        y: length
      }));
      
      const predictedData = Array(cycleLengths.length).fill(null).concat(
        nextThreeCycles.map((_, index) => ({
          x: labels[cycleLengths.length + index],
          y: Math.round(cycleStats.avg)
        }))
      );
      
      return {
        labels,
        datasets: [
          {
            label: 'Actual Cycle Length',
            data: actualData,
            borderColor: '#8A2BE2',
            backgroundColor: 'rgba(138, 43, 226, 0.2)',
            pointBackgroundColor: '#8A2BE2',
            tension: 0.4
          },
          {
            label: 'Predicted Cycle Length',
            data: predictedData,
            borderColor: '#FF6384',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            pointBackgroundColor: '#FF6384',
            borderDash: [5, 5],
            tension: 0.4
          }
        ]
      };
    };
    
    const chartData = generateChartData();
    
    setPredictions(chartData);
    setCycleStats({ cycle: cycleStats, period: periodStats });
    setRegularityScore(regularityScore);
    setNextThreeCycles(cyclesWithFertileWindows);
    setLoading(false);
  };
  
  useEffect(() => {
    if (cycleHistory && cycleHistory.length > 0) {
      predictCycles(cycleHistory);
    }
  }, [cycleHistory]);
  
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Days',
          color: '#ccc'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ccc'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ccc'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#fff'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y} days`;
          }
        }
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (dateString === 'Not enough data') return dateString;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <div className="neon-card">
        <h2 className="text-2xl font-bold text-neon-blue neon-text mb-6">AI Period Prediction</h2>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-neon-blue">Analyzing your cycle data...</p>
          </div>
        ) : !cycleHistory || cycleHistory.length < 2 ? (
          <div className="text-center py-12">
            <p className="text-soft-white mb-4">Please log at least two menstrual cycles to generate predictions.</p>
            <button className="neon-button neon-button-blue">
              Log Cycle
            </button>
          </div>
        ) : predictions ? (
          <div className="space-y-8">
            {/* Cycle Regularity Score */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center">
                <h3 className="text-xl text-neon-blue mb-4">Cycle Regularity Score</h3>
                <div className="relative w-48 h-48">
                  <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                    <div 
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(
                          ${regularityScore > 80 ? '#36A2EB' : 
                            regularityScore > 50 ? '#FFCE56' : '#FF6384'} 
                          ${regularityScore}%, 
                          #2D3748 0%
                        )`,
                        clipPath: 'circle(50% at center)'
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-4xl font-bold text-neon-blue">{regularityScore}%</span>
                      <span className="text-sm text-soft-white">
                        {regularityScore > 80 ? 'Very Regular' : 
                         regularityScore > 60 ? 'Regular' : 
                         regularityScore > 40 ? 'Somewhat Irregular' : 'Irregular'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl text-neon-pink mb-4">Cycle Statistics</h3>
                <div className="space-y-4">
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-neon-blue mb-2">Cycle Length</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-soft-white">Average</p>
                        <p className="text-xl text-neon-blue">{cycleStats.cycle.avg.toFixed(1)} days</p>
                      </div>
                      <div>
                        <p className="text-sm text-soft-white">Range</p>
                        <p className="text-xl text-neon-blue">{cycleStats.cycle.min} - {cycleStats.cycle.max} days</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-neon-pink mb-2">Period Length</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-soft-white">Average</p>
                        <p className="text-xl text-neon-pink">{cycleStats.period.avg.toFixed(1)} days</p>
                      </div>
                      <div>
                        <p className="text-sm text-soft-white">Range</p>
                        <p className="text-xl text-neon-pink">{cycleStats.period.min} - {cycleStats.period.max} days</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Cycle Length Chart */}
            <div>
              <h3 className="text-xl text-neon-purple mb-4">Cycle Length Trend & Prediction</h3>
              <div className="bg-gray-900 p-4 rounded-lg" style={{ height: '300px' }}>
                <Line data={predictions} options={chartOptions} />
              </div>
            </div>
            
            {/* Predictions Table */}
            <div>
              <h3 className="text-xl text-neon-blue mb-4">Next 3 Cycle Predictions</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="px-4 py-3 text-neon-purple">Cycle</th>
                      <th className="px-4 py-3 text-neon-purple">Period Start</th>
                      <th className="px-4 py-3 text-neon-purple">Period End</th>
                      <th className="px-4 py-3 text-neon-purple">Fertile Window</th>
                      <th className="px-4 py-3 text-neon-purple">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {nextThreeCycles.map((cycle, index) => (
                      <tr key={index} className="bg-gray-900/50">
                        <td className="px-4 py-3 text-soft-white">Next {index + 1}</td>
                        <td className="px-4 py-3 text-neon-pink">{formatDate(cycle.startDate)}</td>
                        <td className="px-4 py-3 text-neon-pink">{formatDate(cycle.endDate)}</td>
                        <td className="px-4 py-3 text-neon-blue">
                          {cycle.fertileWindowStart ? 
                            `${formatDate(cycle.fertileWindowStart)} - ${formatDate(cycle.fertileWindowEnd)}` : 
                            'Not enough data'}
                        </td>
                        <td className="px-4 py-3">
                          {cycle.confidence ? (
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-800 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-gradient-to-r from-neon-blue to-neon-purple h-2 rounded-full" 
                                  style={{ width: `${cycle.confidence}%` }}
                                ></div>
                              </div>
                              <span className="text-soft-white">{cycle.confidence}%</span>
                            </div>
                          ) : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-soft-white italic">
                Note: Predictions become more accurate with more cycle data. Factors like stress, medication, and lifestyle changes can affect cycle regularity.
              </p>
            </div>
            
            <div className="text-center">
              <button className="neon-button neon-button-blue">
                Export Predictions
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-soft-white">Unable to generate predictions. Please try again.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeriodPredictor;