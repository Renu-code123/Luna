import React, { useState, useEffect } from 'react';
import { Calendar, Droplet, History, Sparkles, Plus, Trash2, ArrowLeft, Info, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';

const Tracker = ({ cycleHistory, onCycleUpdate, symptoms, onSymptomUpdate, setActiveTab }) => {
  const [cycles, setCycles] = useState([]);
  const [view, setView] = useState('form'); // 'form', 'calendar', 'history'
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [cycleData, setCycleData] = useState({ startDate: '', endDate: '', symptoms: [], mood: '', notes: '' });

  const symptomOptions = [
    "Cramps", "Bloating", "Acne", "Headache", "Fatigue", 
    "Breast Tenderness", "Nausea", "Lower Back Pain", "Insomnia"
  ];

  // Load and sync data
  useEffect(() => {
    if (cycleHistory && cycleHistory.length > 0) {
      setCycles(cycleHistory);
    } else {
      const savedCycles = localStorage.getItem('cycles');
      if (savedCycles) {
        setCycles(JSON.parse(savedCycles));
      }
    }
  }, [cycleHistory]);

  useEffect(() => {
    localStorage.setItem('cycles', JSON.stringify(cycles));
    if (cycles.length > 0) {
      fetchPrediction();
    } else {
      setPredictionData(null);
    }
  }, [cycles]);

  const fetchPrediction = async () => {
    if (cycles.length === 0) return;
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_ML_API_URL || 'http://localhost:5001'}/predict-cycle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cycles })
      });
      const data = await response.json();
      setPredictionData(data);
      setError(null);
    } catch (err) {
      console.error("AI Service Error - Falling back to local calculation:", err);
      
      // Client-side fallback if backend is down
      if (cycles.length >= 2) {
        const lengths = [];
        for (let i = 1; i < cycles.length; i++) {
          const d1 = new Date(cycles[i-1].startDate);
          const d2 = new Date(cycles[i].startDate);
          lengths.push((d2 - d1) / (1000 * 60 * 60 * 24));
        }
        
        const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
        const lastStart = new Date(cycles[cycles.length - 1].startDate);
        const nextDate = new Date(lastStart);
        nextDate.setDate(nextDate.getDate() + Math.round(avg || 28));
        
        setPredictionData({
          success: true,
          confidence_label: "Estimated (Offline Mode)",
          predictions: [{
            start_date: nextDate.toISOString().split('T')[0],
            confidence: 70,
            period_length: 5,
            fertile_window_start: new Date(nextDate.getTime() - 14 * 86400000).toISOString().split('T')[0],
            fertile_window_end: new Date(nextDate.getTime() - 10 * 86400000).toISOString().split('T')[0]
          }],
          cycle_stats: { avg: avg || 28 },
          regularity_score: 85
        });
        setError(null);
      } else {
        setError("Unable to connect to AI Service.");
      }
    } finally {
      setLoading(false);
    }
  };

  const validateEntry = (newStart) => {
    if (cycles.length === 0) return { valid: true };
    
    const newDate = new Date(newStart);
    const lastCycle = cycles[cycles.length - 1];
    const lastDate = new Date(lastCycle.startDate);
    
    // Check for overlap or too close
    const diffTime = newDate - lastDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    if (diffDays < 0) return { valid: false, message: "Entry date is before your last recorded period." };
    if (diffDays < 20) return { valid: false, message: "This entry seems too close to your previous cycle (min 20 days)." };
    
    return { valid: true };
  };

  const handleCycleSubmit = (e) => {
    e.preventDefault();
    
    const validation = validateEntry(cycleData.startDate);
    if (!validation.valid) {
      alert(validation.message);
      return;
    }
    
    const newCycle = {
      id: Date.now(),
      startDate: cycleData.startDate,
      endDate: cycleData.endDate,
      symptoms: cycleData.symptoms,
      mood: cycleData.mood,
      notes: cycleData.notes || ''
    };
    
    const newCyclesList = [...cycles, newCycle].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    setCycles(newCyclesList);
    
    if (onCycleUpdate) onCycleUpdate(newCyclesList);
    
    if (cycleData.symptoms.length > 0 && onSymptomUpdate && symptoms) {
      const newSymptomObjects = cycleData.symptoms.map(s => ({ name: s, severity: 5, date: cycleData.startDate }));
      onSymptomUpdate([...symptoms, ...newSymptomObjects]);
    }
    
    setCycleData({ startDate: '', endDate: '', symptoms: [], mood: '', notes: '' });
    setView('calendar');
  };

  const getGuidanceMessage = () => {
    const count = cycles.length;
    if (count === 0) return "Start tracking your cycle today to unlock AI insights 🌸";
    if (count === 1) return "1 cycle logged. Add 1 more to unlock AI predictions ✨";
    return "AI Prediction Mode Active — Insights improving with every entry!";
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const deleteCycle = (id) => {
    // Instant deletion for better responsiveness
    const filtered = cycles.filter(cycle => cycle.id !== id);
    setCycles(filtered);
    localStorage.setItem('cycles', JSON.stringify(filtered));
    if (onCycleUpdate) onCycleUpdate(filtered);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <button
        onClick={() => setActiveTab('home')}
        className="mb-8 flex items-center gap-2 text-text-tertiary hover:text-primary transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest text-primary">Back to Overview</span>
      </button>

      <div className="med-card min-h-[600px] flex flex-col bg-secondary border border-white/5 shadow-2xl">
        {/* Header & Progress */}
        <div className="mb-8 pb-6 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Calendar className="text-rose-400" size={24} />
              <h2 className="text-2xl font-bold text-primary">Cycle Tracker</h2>
            </div>
            {cycles.length >= 2 && (
              <span className="px-3 py-1 bg-rose-500/10 text-rose-400 text-xs font-bold rounded-full border border-rose-500/20 flex items-center gap-1">
                <Sparkles size={12} /> AI MODE ACTIVE
              </span>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-text-tertiary">
              <span>PREDICTION PROGRESS</span>
              <span>{Math.min(cycles.length, 2)} / 2 CYCLES</span>
            </div>
            <div className="w-full h-1.5 bg-tertiary rounded-full overflow-hidden">
              <div 
                className="h-full bg-rose-500 transition-all duration-1000 ease-out"
                style={{ width: `${Math.min((cycles.length / 2) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-text-secondary italic flex items-center gap-2">
              <Info size={12} className="text-rose-400" /> {getGuidanceMessage()}
            </p>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-tertiary p-1 rounded-lg border border-white/5 w-fit">
          <button 
            onClick={() => setView('form')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${view === 'form' ? 'bg-secondary border border-white/10 text-primary' : 'text-text-secondary hover:text-primary'}`}
          >
            <Plus size={16} /> Log Entry
          </button>
          <button 
            onClick={() => setView('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${view === 'calendar' ? 'bg-secondary border border-white/10 text-primary' : 'text-text-secondary hover:text-primary'}`}
          >
            <Sparkles size={16} /> Predictions
          </button>
          <button 
            onClick={() => setView('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${view === 'history' ? 'bg-secondary border border-white/10 text-primary' : 'text-text-secondary hover:text-primary'}`}
          >
            <History size={16} /> History
          </button>
        </div>

        {/* View Rendering */}
        {view === 'form' && (
          <form onSubmit={handleCycleSubmit} className="space-y-8 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-tertiary p-6 rounded-xl border border-white/5">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Period Start Date</label>
                <input 
                  type="date" 
                  value={cycleData.startDate} 
                  onChange={(e) => setCycleData({...cycleData, startDate: e.target.value})} 
                  className="med-input bg-secondary border-white/10 text-primary w-full p-3 rounded-lg" 
                  required
                />
                <p className="text-[10px] text-text-tertiary mt-2">Required for prediction baseline.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Period End Date <span className="text-text-tertiary font-normal">(Optional)</span></label>
                <input 
                  type="date" 
                  value={cycleData.endDate} 
                  onChange={(e) => setCycleData({...cycleData, endDate: e.target.value})} 
                  className="med-input bg-secondary border-white/10 text-primary w-full p-3 rounded-lg" 
                />
                <p className="text-[10px] text-text-tertiary mt-2">Improves period duration accuracy.</p>
              </div>
            </div>

            <div className="bg-tertiary p-6 rounded-xl border border-white/5">
              <label className="block text-sm font-semibold text-primary mb-4 flex items-center gap-2">
                <Droplet size={16} className="text-rose-400"/> Symptoms Experienced
              </label>
              <div className="flex flex-wrap gap-2">
                {symptomOptions.map(symptom => {
                  const isSelected = cycleData.symptoms?.includes(symptom);
                  return (
                    <label key={symptom} className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all border ${isSelected ? 'bg-rose-400/20 border-rose-400/40 text-rose-400' : 'bg-secondary border-white/5 text-text-secondary hover:border-white/20'}`}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          const updatedSymptoms = isSelected
                            ? cycleData.symptoms.filter(s => s !== symptom)
                            : [...(cycleData.symptoms || []), symptom];
                          setCycleData({ ...cycleData, symptoms: updatedSymptoms });
                        }}
                        className="hidden"
                      />
                      {symptom}
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-tertiary p-6 rounded-xl border border-white/5">
                <label className="block text-sm font-semibold text-primary mb-2">Mood Baseline</label>
                <select 
                  value={cycleData.mood} 
                  onChange={(e) => setCycleData({...cycleData, mood: e.target.value})} 
                  className="med-input bg-secondary border-white/10 text-primary w-full p-3 rounded-lg"
                >
                  <option value="">Select mood</option>
                  <option value="stable">Stable / Calm</option>
                  <option value="elevated">Energetic / Happy</option>
                  <option value="irritable">Irritable / Moody</option>
                  <option value="tired">Fatigued / Low</option>
                </select>
              </div>
              <div className="bg-tertiary p-6 rounded-xl border border-white/5">
                <label className="block text-sm font-semibold text-primary mb-2">Private Notes</label>
                <textarea
                  value={cycleData.notes}
                  onChange={(e) => setCycleData({...cycleData, notes: e.target.value})}
                  className="med-input bg-secondary border-white/10 text-primary w-full p-3 rounded-lg resize-none h-12"
                  placeholder="Note any flow changes or patterns..."
                />
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-500/20">
              Log Period Entry
            </button>
          </form>
        )}

        {view === 'calendar' && (
          <div className="flex-1 space-y-6">
            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin"></div>
                <p className="text-sm text-text-tertiary">Analyzing cycle patterns...</p>
              </div>
            ) : error ? (
              <div className="h-80 flex flex-col items-center justify-center text-center p-8 bg-rose-500/5 rounded-2xl border border-rose-500/20">
                <AlertCircle size={40} className="text-rose-400 mb-4" />
                <h3 className="text-lg font-bold text-primary mb-2">Service Unavailable</h3>
                <p className="text-text-secondary text-sm mb-6 max-w-xs">{error}</p>
                <button onClick={fetchPrediction} className="px-6 py-2 bg-rose-500/20 text-rose-400 rounded-lg text-sm font-bold border border-rose-500/30 hover:bg-rose-500/30 transition-all">
                  Try Again
                </button>
              </div>
            ) : predictionData && predictionData.success ? (
              <div className="space-y-6">
                {/* Prediction Hero */}
                <div className="bg-gradient-to-br from-rose-500/20 to-transparent p-8 rounded-2xl border border-rose-500/20 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-widest mb-4">
                      <TrendingUp size={14} /> {predictionData.confidence_label}
                    </div>
                    <p className="text-text-tertiary text-sm mb-1 font-medium">Next period expected on</p>
                    <p className="text-5xl font-black text-primary tracking-tight mb-4">
                      {formatDate(predictionData.predictions[0].start_date)}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5 text-xs font-semibold text-text-secondary">
                        Confidence: <span className="text-rose-400">{predictionData.predictions[0].confidence}%</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5 text-xs font-semibold text-text-secondary">
                        Duration: <span className="text-rose-400">{predictionData.predictions[0].period_length} days</span>
                      </div>
                    </div>
                  </div>
                  <Sparkles className="absolute -right-8 -bottom-8 text-rose-500/10 w-48 h-48" />
                </div>

                {/* Fertile Window */}
                <div className="bg-tertiary p-6 rounded-xl border border-white/5">
                  <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                    <Droplet size={16} className="text-blue-400"/> Projected Fertile Window
                  </h4>
                  <div className="flex items-center justify-between p-4 bg-secondary rounded-xl border border-white/5">
                    <div>
                      <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider mb-1">Window Starts</p>
                      <p className="text-primary font-bold">{formatDate(predictionData.predictions[0].fertile_window_start)}</p>
                    </div>
                    <div className="h-8 w-px bg-white/5"></div>
                    <div className="text-right">
                      <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider mb-1">Window Ends</p>
                      <p className="text-primary font-bold">{formatDate(predictionData.predictions[0].fertile_window_end)}</p>
                    </div>
                  </div>
                </div>

                {/* Insights Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary p-5 rounded-xl border border-white/5 shadow-lg">
                    <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider mb-1">Avg Cycle</p>
                    <p className="text-2xl font-black text-primary">{Math.round(predictionData.cycle_stats.avg)} <span className="text-xs font-normal text-text-tertiary">days</span></p>
                  </div>
                  <div className="bg-secondary p-5 rounded-xl border border-white/5 shadow-lg">
                    <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider mb-1">Regularity</p>
                    <p className="text-2xl font-black text-primary">{predictionData.regularity_score}<span className="text-xs font-normal text-text-tertiary">/100</span></p>
                  </div>
                </div>

                {/* Integrated Timeline Section */}
                <div className="pt-6 border-t border-white/5">
                   <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-widest mb-4 flex items-center gap-2">
                     <History size={14} /> Recent Log Timeline
                   </h4>
                   <div className="space-y-3">
                     {cycles.slice().reverse().slice(0, 2).map((cycle, idx) => (
                       <div key={cycle.id} className="bg-tertiary/50 p-4 rounded-xl border border-white/5 flex justify-between items-center group hover:bg-tertiary transition-colors">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20">
                               <Droplet size={14} className="text-rose-400" />
                            </div>
                            <div>
                               <p className="text-[10px] font-bold text-text-tertiary uppercase mb-0.5">{formatDate(cycle.startDate)}</p>
                               <p className="text-sm font-bold text-primary">{cycle.mood || 'Stable'} • {cycle.symptoms?.length || 0} Symptoms</p>
                            </div>
                         </div>
                         <button 
                            onClick={() => deleteCycle(cycle.id)} 
                            className="p-2 text-rose-400/70 hover:text-rose-400 bg-rose-400/5 hover:bg-rose-400/15 rounded-lg transition-all cursor-pointer border border-rose-400/10"
                            title="Remove Entry"
                          >
                            <Trash2 size={16} />
                          </button>
                       </div>
                     ))}
                     {cycles.length > 2 && (
                       <button onClick={() => setView('history')} className="w-full py-3 text-[10px] font-bold text-text-tertiary hover:text-primary transition-colors border border-dashed border-white/10 rounded-xl uppercase tracking-widest">
                         View All {cycles.length} Entries
                       </button>
                     )}
                   </div>
                </div>
              </div>
            ) : predictionData && !predictionData.success ? (
              <div className="h-80 flex flex-col items-center justify-center text-center p-8 bg-tertiary rounded-2xl border border-white/5">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5">
                  <Sparkles size={32} className="text-rose-500/50" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">AI Insight</h3>
                <p className="text-text-secondary text-sm mb-8 max-w-xs">
                  {predictionData.message}
                </p>
              </div>
            ) : (
              <div className="h-80 flex flex-col items-center justify-center text-center p-8 bg-tertiary rounded-2xl border border-white/5">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5">
                  <Sparkles size={32} className="text-rose-500/50" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">Unlock AI Predictions</h3>
                <p className="text-text-secondary text-sm mb-8 max-w-xs">
                  Start tracking your cycle. After 2 entries, our AI will provide accurate period and fertility forecasts.
                </p>
                <div className="flex gap-4">
                  <div className={`p-4 rounded-xl border transition-all ${cycles.length >= 1 ? 'bg-rose-500/10 border-rose-500/20' : 'bg-white/5 border-white/5 opacity-50'}`}>
                    <div className="text-xs font-bold text-text-tertiary mb-1">STEP 1</div>
                    <CheckCircle2 size={16} className={cycles.length >= 1 ? 'text-rose-500' : 'text-text-tertiary'} />
                  </div>
                  <div className={`p-4 rounded-xl border transition-all ${cycles.length >= 2 ? 'bg-rose-500/10 border-rose-500/20' : 'bg-white/5 border-white/5 opacity-50'}`}>
                    <div className="text-xs font-bold text-text-tertiary mb-1">STEP 2</div>
                    <Sparkles size={16} className={cycles.length >= 2 ? 'text-rose-500' : 'text-text-tertiary'} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'history' && (
          <div className="flex-1 space-y-4">
            {cycles.length > 0 ? (
              <div className="space-y-6">
                {cycles.slice().reverse().map((cycle, idx) => (
                  <div key={cycle.id} className="bg-gradient-to-br from-white/5 to-transparent p-6 rounded-2xl border border-white/5 group hover:border-white/10 transition-all shadow-xl">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                         <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20">
                            <Droplet size={20} className="text-rose-400" />
                         </div>
                         <div>
                           <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.2em] mb-1">Entry #{cycles.length - idx}</p>
                           <p className="text-2xl font-black text-primary tracking-tight">{formatDate(cycle.startDate)}</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => deleteCycle(cycle.id)} 
                        className="p-3 text-rose-400/80 hover:text-rose-400 bg-rose-400/5 hover:bg-rose-400/20 rounded-xl transition-all border border-rose-400/20 shadow-sm cursor-pointer"
                        title="Permanently Remove Entry"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-5 border-y border-white/5">
                      <div>
                        <p className="text-[10px] font-bold text-text-tertiary uppercase mb-1">Duration</p>
                        <p className="text-sm font-bold text-primary">
                          {cycle.endDate ? `${Math.ceil((new Date(cycle.endDate) - new Date(cycle.startDate)) / (1000*60*60*24))} days` : 'Active'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-text-tertiary uppercase mb-1">Mood</p>
                        <p className="text-sm font-bold text-rose-400 capitalize">{cycle.mood || 'Stable'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[10px] font-bold text-text-tertiary uppercase mb-1">Symptoms</p>
                        <p className="text-sm font-bold text-text-secondary truncate">
                          {cycle.symptoms?.length > 0 ? cycle.symptoms.join(', ') : 'No symptoms recorded'}
                        </p>
                      </div>
                    </div>
                    
                    {cycle.notes && (
                       <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/5">
                          <p className="text-xs text-text-tertiary italic leading-relaxed">"{cycle.notes}"</p>
                       </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-tertiary rounded-xl border border-white/5">
                <History size={40} className="text-text-tertiary mb-4 opacity-50" />
                <h3 className="text-primary font-semibold mb-2">No History Recorded</h3>
                <p className="text-secondary text-sm">Your logged cycles will appear here once you make your first entry.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracker;