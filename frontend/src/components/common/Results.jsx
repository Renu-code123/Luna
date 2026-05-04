import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowRight, ArrowLeft, ActivitySquare, CheckCircle2, ShieldCheck } from 'lucide-react';

const Results = ({ riskAssessment, setActiveTab }) => {
  if (!riskAssessment) return null;

  // Theming based on risk level
  const levelStyles = {
    High: {
      gradient: 'from-rose-500 to-rose-700',
      bgClass: 'bg-rose-500',
      border: 'border-rose-500/50',
      icon: <AlertCircle size={32} className="text-white" />,
      text: 'text-rose-500'
    },
    Moderate: {
      gradient: 'from-amber-400 to-amber-600',
      bgClass: 'bg-amber-400',
      border: 'border-amber-400/50',
      icon: <ActivitySquare size={32} className="text-white" />,
      text: 'text-amber-400'
    },
    Low: {
      gradient: 'from-emerald-400 to-emerald-600',
      bgClass: 'bg-emerald-400',
      border: 'border-emerald-400/50',
      icon: <CheckCircle2 size={32} className="text-white" />,
      text: 'text-emerald-400'
    }
  };

  const style = levelStyles[riskAssessment.level] || levelStyles.Moderate;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15, delayChildren: 0.1 } 
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 15 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-4xl mx-auto px-4 py-8 relative"
    >
      <motion.div variants={cardVariants} className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 rounded-xl bg-tertiary border border-white/5 mb-6">
          <ShieldCheck size={28} className="text-accent" />
        </div>
        <h2 className="heading-large font-bold text-primary mb-3">
          Diagnostic Results
        </h2>
        <p className="body-medium text-secondary max-w-2xl mx-auto">
          Clinical parameters have been analyzed. Review your personalized insights and established baseline below.
        </p>
      </motion.div>

      <motion.div variants={cardVariants} className="mb-12">
        <div className={`relative overflow-hidden rounded-3xl bg-secondary border border-white/5 shadow-sm`}>
          <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-text-tertiary uppercase tracking-wider text-xs font-semibold mb-3">Clinical Risk Stratification</span>
              <div className="flex items-center gap-4 mb-3">
                <div className={`p-2 rounded-xl ${style.bgClass} shadow-sm`}>
                  {style.icon}
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-primary tracking-tight leading-none">
                  {riskAssessment.level} Risk
                </h3>
              </div>
              <p className="text-secondary text-sm max-w-sm mt-2">
                Derived from reported biometrics, cycle variations, and symptomatic baseline.
              </p>
            </div>
            
            <div className="w-full md:w-auto flex flex-col items-center">
              <div className="relative w-36 h-36 flex items-center justify-center rounded-full bg-tertiary border border-white/5 overflow-hidden">
                <div className={`absolute bottom-0 left-0 w-full bg-gradient-to-t ${style.gradient} opacity-20 transition-all duration-1000 ease-out`} style={{ height: `${riskAssessment.score}%` }}></div>
                <div className="relative z-10 flex flex-col items-center justify-center pt-2">
                  <span className="text-4xl font-bold text-primary tracking-tight">{riskAssessment.score}</span>
                  <span className="text-text-tertiary text-[10px] font-semibold uppercase tracking-widest mt-1">/ 100 Base</span>
                </div>
              </div>
              <span className="mt-3 text-secondary text-xs font-medium uppercase tracking-wider">Indexed Score</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={cardVariants} className="mb-12">
        <h3 className="text-lg font-semibold text-primary mb-6 border-b border-white/5 pb-2">
          Recommended Clinical Actions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {riskAssessment.recommendations && riskAssessment.recommendations.map((rec, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                className="bg-tertiary border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-accent/60"></div>
                   <h4 className="text-sm font-semibold text-primary">{rec.category}</h4>
                </div>
                <p className="text-sm text-secondary leading-relaxed pl-3 border-l border-white/5 ml-[3px] py-1">{rec.text}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div variants={cardVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 pt-8 border-t border-white/5">
        <button 
          onClick={() => setActiveTab('assessment')} 
          className="w-full sm:w-auto btn-secondary py-3 px-6"
        >
          <ArrowLeft size={16} /> Rectify Baseline
        </button>
        <button 
          onClick={() => setActiveTab('tracker')} 
          className="w-full sm:w-auto btn-primary py-3 px-8"
        >
          Initialize Protocol Tracker <ArrowRight size={16} />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Results;