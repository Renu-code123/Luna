import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Droplet, Heart, ShieldCheck, FileText, AlertCircle, ArrowLeft } from 'lucide-react';

const Assessment = ({ userData, setUserData, symptomOptions, lifestyleOptions, calculateBMI, assessRisk, setActiveTab }) => {
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = value === '' ? '' : (type === 'number' ? Number(value) : value);
    
    // Prevent negative numbers for biometric data
    if (type === 'number' && parsedValue < 0) return;
    
    setUserData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleSymptomChange = (symptom) => {
    setUserData(prev => {
      const exists = prev.symptoms.includes(symptom);
      const updatedSymptoms = exists ? prev.symptoms.filter(s => s !== symptom) : [...prev.symptoms, symptom];
      return { ...prev, symptoms: updatedSymptoms };
    });
  };

  const handleLifestyleChange = (factor) => {
    setUserData(prev => {
      const exists = prev.lifestyleFactors.includes(factor);
      const updatedFactors = exists ? prev.lifestyleFactors.filter(f => f !== factor) : [...prev.lifestyleFactors, factor];
      return { ...prev, lifestyleFactors: updatedFactors };
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  const currentBmi = calculateBMI();

  const isFormValid = userData.age && userData.weight && userData.height && userData.cycleRegularity;

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-3xl mx-auto px-4 py-8"
    >
      <motion.button
        variants={itemVariants}
        onClick={() => setActiveTab('home')}
        className="mb-8 flex items-center gap-2 text-text-tertiary hover:text-primary transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Back to Overview</span>
      </motion.button>

      <motion.div variants={itemVariants} className="mb-10 text-center">
        <div className="inline-flex items-center justify-center p-3 rounded-xl border border-[var(--card-border)] mb-6 text-neon-blue neon-shadow-blue">
          <FileText size={24} />
        </div>
        <h2 className="text-3xl font-bold mb-3 text-primary">
          Clinical Risk <span className="text-neon-blue neon-text">Assessment</span>
        </h2>
        <p className="text-sm max-w-xl mx-auto">
          Provide your baseline metrics for an AI-powered analysis of your hormonal health and potential PCOS risk factors.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="neon-card space-y-12">
        {/* Basic Information */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6 pb-2 border-b border-[var(--card-border)]">
            <Activity className="text-gray-400" size={20} />
            <h3 className="text-lg font-semibold">Biometric Data</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Age</label>
              <input type="number" min="0" name="age" value={userData.age} onChange={handleInputChange} className="neon-input w-full" placeholder="Years" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Weight (kg)</label>
              <input type="number" min="0" name="weight" value={userData.weight} onChange={handleInputChange} className="neon-input w-full" placeholder="Kilograms" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Height (cm)</label>
              <input type="number" min="0" name="height" value={userData.height} onChange={handleInputChange} className="neon-input w-full" placeholder="Centimeters" />
            </div>
          </div>
          
          <AnimatePresence>
            {currentBmi && currentBmi !== "NaN" && currentBmi !== "Infinity" && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="mt-6 p-4 rounded-xl border border-[var(--card-border)] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[var(--bg-primary)] border border-neon-blue"><Heart className="text-neon-pink" size={18} /></div>
                  <div>
                    <span className="block text-sm font-medium">Body Mass Index (BMI)</span>
                    <span className="block text-xs text-gray-400">Calculated automatically</span>
                  </div>
                </div>
                <div className="text-2xl font-semibold text-neon-blue">{currentBmi}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Cycle History */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6 pb-2 border-b border-[var(--card-border)]">
            <Droplet className="text-gray-400" size={20} />
            <h3 className="text-lg font-semibold">Menstrual History</h3>
          </div>
          <div className="max-w-md">
            <label className="block text-sm font-medium mb-2">Cycle Regularity Baseline</label>
            <div className="relative">
              <select name="cycleRegularity" value={userData.cycleRegularity || ""} onChange={(e) => setUserData(prev => ({ ...prev, cycleRegularity: e.target.value }))} className="neon-input appearance-none cursor-pointer w-full text-sm">
                <option value="" disabled>Select pattern</option>
                <option value="regular">Regular (21-35 days)</option>
                <option value="irregular">Irregular (Varies widely)</option>
                <option value="absent">Absent (No menses without medication)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Symptoms & Lifestyle */}
        <div className="relative z-10">
          <div className="grid grid-cols-1 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-4 pb-2 border-b border-[var(--card-border)]">
                <ShieldCheck className="text-gray-400" size={20} />
                <h3 className="text-lg font-semibold">Clinical Symptoms</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">Select all active symptoms present over the last 3-6 months.</p>
              <div className="flex flex-wrap gap-2">
                {symptomOptions.map(symptom => {
                  const isSelected = userData.symptoms.includes(symptom);
                  return (
                    <button
                      key={symptom}
                      onClick={() => handleSymptomChange(symptom)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                        isSelected 
                          ? 'border-neon-pink text-neon-pink neon-shadow-pink' 
                          : 'border-white/5 text-gray-500 hover:border-gray-500'
                      }`}
                    >
                      {symptom}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4 pb-2 border-b border-[var(--card-border)]">
                <Activity className="text-gray-400" size={20} />
                <h3 className="text-lg font-semibold">Lifestyle Factors</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {lifestyleOptions.map(factor => {
                  const isSelected = userData.lifestyleFactors.includes(factor);
                  return (
                    <button
                      key={factor}
                      onClick={() => handleLifestyleChange(factor)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                        isSelected 
                          ? 'border-neon-blue text-neon-blue neon-shadow-blue' 
                          : 'border-white/5 text-gray-500 hover:border-gray-500'
                      }`}
                    >
                      {factor}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="relative z-10 pt-4">
          <button 
            onClick={assessRisk} 
            disabled={!isFormValid}
            className={`w-full py-4 text-base shadow-sm transition-all rounded-xl font-bold ${
              isFormValid 
                ? 'bg-neon-blue text-white neon-shadow-blue cursor-pointer' 
                : 'bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed opacity-50'
            }`}
          >
            {isFormValid ? 'Generate Diagnostic Analysis' : 'Complete Required Fields to Analyze'}
          </button>
          <div className="mt-4 text-center">
            <span className="text-xs text-text-tertiary flex items-center justify-center gap-1">
              <AlertCircle size={12} /> This tool provides screening insights, not a formal medical diagnosis.
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Assessment;