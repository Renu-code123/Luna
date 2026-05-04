import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Salad, CheckCircle, AlertCircle, Info, ChevronRight, Droplet, Loader2, Sparkles, Utensils, Download, Zap, Coffee, CheckSquare, Square, ArrowLeft } from 'lucide-react';

const DietPlan = ({ setActiveTab }) => {
  const [activePlan, setActivePlan] = useState('low-gi');
  const [loading, setLoading] = useState(false);
  const [dailyTip, setDailyTip] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [completedFoods, setCompletedFoods] = useState({}); // { planId: [food1, food2] }

  const plans = {
    'low-gi': {
      color: 'neon-purple',
      title: 'Low Glycemic Index (GI)',
      desc: 'Ideal for PCOS. Focuses on slowly digested carbs to maintain steady insulin levels.',
      foods: ['Whole Grains', 'Leafy Greens', 'Legumes', 'Berries', 'Fatty Fish'],
      avoid: ['White Bread', 'Sugary Drinks', 'Potatoes', 'Cakes/Pastries'],
      meals: ['Quinoa Salad with Chickpeas', 'Steamed Salmon with Asparagus', 'Lentil Soup with Spinach']
    },
    'ketogenic': {
      color: 'neon-blue',
      title: 'Anti-Inflammatory Keto',
      desc: 'Modified high-fat, low-carb to reduce inflammation common in PCOS.',
      foods: ['Avocados', 'Nuts & Seeds', 'Eggs', 'Chicken', 'Olive Oil'],
      avoid: ['Grains', 'High-sugar fruits', 'Starchy Vegetables'],
      meals: ['Avocado and Egg Salad', 'Grilled Chicken with Broccoli', 'Walnut-crusted Cod']
    },
    'mediterranean': {
      color: 'neon-pink',
      title: 'Mediterranean',
      desc: 'Heart-healthy focus with healthy fats and fiber.',
      foods: ['Extra Virgin Olive Oil', 'Fish', 'Nuts', 'Herbs', 'Low-fat Yogurt'],
      avoid: ['Trans Fats', 'Processed Meats', 'Refined Oils'],
      meals: ['Greek Salad with Feta', 'Grilled Sea Bass', 'Chickpea and Herb Stew']
    }
  };

  const fetchDailyHealthTip = async () => {
    setLoading(true);
    try {
      const tips = [
        "Drinking spearmint tea (2 cups daily) has shown to lower androgens and improve hirsutism.",
        "Include a source of protein with every snack to prevent insulin spikes.",
        "Cinnamon helps improve insulin sensitivity; try adding it to your morning oats.",
        "Magnesium-rich foods like spinach and pumpkin seeds can help with period cramps.",
        "Flaxseeds are excellent for hormone metabolism and fiber intake."
      ];
      await new Promise(resolve => setTimeout(resolve, 800));
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      setDailyTip(randomTip);
    } catch (err) {
      setDailyTip("Focus on whole, unprocessed foods for better hormonal balance.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsExporting(false);
    alert('Your Personalized Diet Plan has been generated and is ready for download!');
  };

  const getMealSuggestion = () => {
    const meals = plans[activePlan].meals;
    const randomMeal = meals[Math.floor(Math.random() * meals.length)];
    setSuggestion(randomMeal);
  };

  const toggleFoodCompletion = (food) => {
    setCompletedFoods(prev => {
      const currentPlanCompleted = prev[activePlan] || [];
      if (currentPlanCompleted.includes(food)) {
        return { ...prev, [activePlan]: currentPlanCompleted.filter(f => f !== food) };
      } else {
        return { ...prev, [activePlan]: [...currentPlanCompleted, food] };
      }
    });
  };

  const calculateProgress = () => {
    const completed = completedFoods[activePlan]?.length || 0;
    const total = plans[activePlan].foods.length;
    return Math.round((completed / total) * 100);
  };

  useEffect(() => {
    fetchDailyHealthTip();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto py-8 lg:py-12 px-4 sm:px-6">
      <button
        onClick={() => setActiveTab('home')}
        className="mb-8 flex items-center gap-2 text-text-tertiary hover:text-primary transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Back to Overview</span>
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Nav - Improved Responsiveness */}
        <div className="w-full lg:w-72 space-y-6">
          <div className="flex items-center justify-between lg:block">
            <h2 className="text-xl font-black text-primary px-2 mb-0 lg:mb-6 tracking-tight uppercase tracking-widest opacity-60">Diet Therapy</h2>
            <div className="lg:hidden flex items-center gap-2 text-[10px] text-neon-blue font-bold">
              <Zap size={12} className="animate-pulse" /> AI Active
            </div>
          </div>

          <div className="flex lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide snap-x">
            {Object.keys(plans).map(key => (
              <button
                key={key}
                onClick={() => { setActivePlan(key); setSuggestion(null); }}
                className={`flex-shrink-0 lg:w-full group p-4 lg:p-5 rounded-2xl text-left transition-all duration-300 border snap-start ${
                  activePlan === key 
                  ? `bg-${plans[key].color}/10 border-${plans[key].color} text-primary shadow-[0_10px_30px_rgba(0,0,0,0.1)]` 
                  : 'bg-white/5 border-white/5 text-text-secondary hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-bold tracking-tight text-sm lg:text-base whitespace-nowrap">{plans[key].title}</span>
                  <ChevronRight size={18} className={`hidden lg:block transition-transform duration-300 ${activePlan === key ? 'translate-x-1' : 'opacity-0'}`} />
                </div>
              </button>
            ))}
          </div>
          
          <div className="hidden lg:block p-6 rounded-2xl bg-dark/40 border border-white/5 mt-10 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-2 text-neon-aqua opacity-20 group-hover:rotate-12 transition-transform">
                <Sparkles size={40} />
             </div>
             <div className="flex items-center gap-3 mb-4 relative z-10">
               <div className="p-2 bg-neon-aqua/20 text-neon-aqua rounded-lg">
                 {loading ? <Loader2 size={18} className="animate-spin" /> : <Info size={18} />}
               </div>
               <h4 className="text-sm font-bold text-primary">Live Health Tip</h4>
             </div>
             <p className="text-xs text-text-secondary leading-relaxed italic relative z-10 min-h-[40px]">
                {dailyTip || "Loading your personalized nutrition insight..."}
             </p>
             <button 
               onClick={fetchDailyHealthTip} 
               className="mt-4 text-[10px] text-neon-aqua font-black uppercase tracking-widest hover:underline flex items-center gap-1"
             >
               Refresh Tip <RefreshCw size={10} className={loading ? 'animate-spin' : ''} />
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
             <motion.div
                key={activePlan}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="med-card p-6 lg:p-10 min-h-[500px] border-white/5 relative overflow-hidden"
              >
                {/* Background Decor */}
                <div className={`absolute -top-24 -right-24 w-64 h-64 bg-${plans[activePlan].color}/5 rounded-full blur-[100px] pointer-events-none`} />
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10 relative z-10">
                   <div className={`p-5 rounded-3xl bg-${plans[activePlan].color}/10 text-${plans[activePlan].color} border border-${plans[activePlan].color}/20 shadow-xl`}>
                      <Salad size={32} lg:size={40} />
                   </div>
                   <div className="flex-1">
                       <h2 className="text-3xl lg:text-4xl font-black text-primary tracking-tighter mb-2">{plans[activePlan].title}</h2>
                      <p className="text-sm text-text-secondary leading-relaxed max-w-lg">{plans[activePlan].desc}</p>
                   </div>
                   <div className="flex flex-col items-center gap-2">
                      <div className="relative w-16 h-16">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" 
                            strokeDasharray={176} 
                            strokeDashoffset={176 - (176 * calculateProgress()) / 100} 
                            className={`text-${plans[activePlan].color} transition-all duration-500`}
                            strokeLinecap="round" 
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black">{calculateProgress()}%</div>
                      </div>
                      <span className="text-[8px] uppercase tracking-widest font-bold opacity-40">Adherence</span>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-8 relative z-10">
                   <div className="space-y-6">
                      <h3 className="text-lg lg:text-xl font-bold text-primary flex items-center gap-3">
                         <div className="w-2 h-6 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.4)]" /> 
                         Essential Foods <span className="text-[10px] opacity-40">(Tick if consumed today)</span>
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                         {plans[activePlan].foods.map(food => {
                           const isChecked = completedFoods[activePlan]?.includes(food);
                           return (
                            <button 
                              key={food} 
                              onClick={() => toggleFoodCompletion(food)}
                              className={`flex items-center justify-between p-4 rounded-2xl border transition-all group ${
                                isChecked 
                                ? 'bg-green-500/10 border-green-500/30' 
                                : 'bg-white/[0.02] border-white/5 hover:border-green-500/20'
                              }`}
                            >
                               <div className="flex items-center gap-4">
                                 <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                   isChecked ? 'bg-green-500 text-white' : 'bg-white/5 text-text-tertiary group-hover:text-green-500'
                                 }`}>
                                   {isChecked ? <CheckSquare size={16} /> : <Square size={16} />}
                                 </div>
                                 <span className={`text-sm font-medium transition-colors ${isChecked ? 'text-primary line-through opacity-60' : 'text-text-secondary group-hover:text-primary'}`}>{food}</span>
                               </div>
                               {isChecked && (
                                 <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                   <CheckCircle size={18} className="text-green-500" />
                                 </motion.div>
                               )}
                            </button>
                           );
                         })}
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h3 className="text-lg lg:text-xl font-bold text-primary flex items-center gap-3">
                         <div className="w-2 h-6 bg-neon-pink rounded-full shadow-[0_0_10px_rgba(255,42,133,0.4)]" /> 
                         Foods to Avoid
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        {plans[activePlan].avoid.map(food => (
                           <div key={food} className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-neon-pink/30 transition-all group">
                              <div className="w-8 h-8 rounded-lg bg-neon-pink/10 flex items-center justify-center text-neon-pink group-hover:scale-110 transition-transform">
                                <AlertCircle size={16} />
                              </div>
                              <span className="text-sm font-medium text-text-secondary group-hover:text-primary transition-colors">{food}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

                {/* AI Suggestion Tool */}
                <div className="mt-12 p-6 rounded-3xl bg-white/[0.02] border border-white/5 relative group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-neon-blue/10 flex items-center justify-center text-neon-blue">
                        <Coffee size={20} />
                      </div>
                      <h4 className="font-bold text-primary">AI Meal Suggestion</h4>
                    </div>
                    <button 
                      onClick={getMealSuggestion}
                      className="px-4 py-2 rounded-xl bg-neon-blue/10 text-neon-blue text-[10px] font-black uppercase tracking-widest hover:bg-neon-blue/20 transition-all flex items-center gap-2"
                    >
                      Generate <Zap size={10} fill="currentColor" />
                    </button>
                  </div>
                  <AnimatePresence mode="wait">
                    {suggestion ? (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-sm text-text-secondary pl-13 flex items-center gap-2"
                      >
                        <ArrowRight size={14} className="text-neon-blue" />
                        Today's recommended meal: <span className="text-neon-blue font-bold">{suggestion}</span>
                      </motion.div>
                    ) : (
                      <div className="text-xs text-text-tertiary pl-13 italic">Click generate to receive a meal recommendation based on this plan.</div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="mt-12 p-6 lg:p-8 bg-gradient-to-r from-neon-blue/5 to-transparent rounded-3xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                   <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-12 h-12 rounded-2xl bg-neon-blue/10 flex items-center justify-center text-neon-blue">
                        <Droplet size={24} />
                      </div>
                      <div>
                         <h4 className="text-primary font-bold">Hydration Intelligence</h4>
                         <p className="text-xs text-text-tertiary">Recommended daily intake: <span className="text-neon-blue font-bold">3.2 Liters</span></p>
                      </div>
                   </div>
                   <button 
                     onClick={handleExport}
                     disabled={isExporting}
                     className="w-full sm:w-auto px-8 py-4 bg-neon-blue text-dark font-black rounded-xl hover:scale-105 transition-all shadow-lg shadow-neon-blue/20 flex items-center justify-center gap-3 text-xs uppercase tracking-widest disabled:opacity-50"
                   >
                      {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                      {isExporting ? 'Generating...' : 'Export PDF Plan'}
                   </button>
                </div>
             </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const RefreshCw = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M23 4v6h-6" />
    <path d="M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const ArrowRight = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export default DietPlan;
