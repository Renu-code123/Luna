import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Wind, Moon, Sun, Heart, Sparkles, AlertCircle, ArrowLeft, Play, Square, Activity, BrainCircuit, CheckCircle2 } from 'lucide-react';

// ------------------------------------
// 1. FOCUS & BREATHE
// ------------------------------------
const FocusBreathe = () => {
  const navigate = useNavigate();
  const [breatheMode, setBreatheMode] = useState('inhale');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setBreatheMode(prev => (prev === 'inhale' ? 'exhale' : 'inhale'));
      }, 4000);
    } else {
      setBreatheMode('inhale');
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-6 flex flex-col items-center">
      <button onClick={() => navigate('/relax')} className="self-start mb-12 flex items-center gap-2 text-white/50 hover:text-white transition-colors group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Back to Overview</span>
      </button>

      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-white mb-4">Focus & Breathe</h2>
        <p className="text-white/60">Follow the circle. Inhale as it expands, exhale as it shrinks.</p>
      </div>

      <div className="relative w-72 h-72 flex items-center justify-center mb-16">
        <motion.div
          animate={{ scale: isPlaying ? (breatheMode === 'inhale' ? 1.4 : 0.8) : 1 }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className={`absolute w-48 h-48 rounded-full blur-2xl opacity-50 ${breatheMode === 'inhale' ? 'bg-cyan-500' : 'bg-purple-500'}`}
        />
        <motion.div
          animate={{ scale: isPlaying ? (breatheMode === 'inhale' ? 1.4 : 0.8) : 1 }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className={`relative z-10 w-48 h-48 rounded-full border-4 flex items-center justify-center ${breatheMode === 'inhale' ? 'border-cyan-400 bg-cyan-500/20 text-cyan-400' : 'border-purple-400 bg-purple-500/20 text-purple-400'}`}
        >
          <Wind size={48} />
        </motion.div>
        
        {isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <span className="text-3xl font-black text-white uppercase tracking-widest drop-shadow-xl">
              {breatheMode}
            </span>
          </div>
        )}
      </div>

      <button onClick={() => setIsPlaying(!isPlaying)} className={`px-10 py-4 rounded-2xl font-black flex items-center gap-3 transition-all transform hover:-translate-y-1 ${isPlaying ? 'bg-white/10 text-white' : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'}`}>
        {isPlaying ? <Square size={20} /> : <Play size={20} />}
        {isPlaying ? 'STOP EXERCISE' : 'START BREATHING'}
      </button>
    </div>
  );
};

// ------------------------------------
// 2. BOX BREATHING
// ------------------------------------
const BoxBreathing = () => {
  const navigate = useNavigate();
  const phases = ['Inhale', 'Hold', 'Exhale', 'Hold'];
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setPhaseIndex(prev => (prev + 1) % 4);
      }, 4000);
    } else {
      setPhaseIndex(0);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-6 flex flex-col items-center">
      <button onClick={() => navigate('/relax')} className="self-start mb-12 flex items-center gap-2 text-white/50 hover:text-white transition-colors group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Back to Overview</span>
      </button>

      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-white mb-4">Box Breathing</h2>
        <p className="text-white/60">Inhale for 4s, Hold for 4s, Exhale for 4s, Hold for 4s. Used by Navy SEALs to lower stress instantly.</p>
      </div>

      <div className="relative w-64 h-64 border-4 border-pink-500/30 rounded-3xl mb-16 flex items-center justify-center overflow-hidden bg-black/20">
        <motion.div
          animate={{
            scale: isPlaying ? (phases[phaseIndex] === 'Inhale' || (phases[phaseIndex] === 'Hold' && phaseIndex === 1) ? 1 : 0.4) : 0.8,
            borderRadius: isPlaying ? ((phases[phaseIndex] === 'Hold' && phaseIndex === 1) || phases[phaseIndex] === 'Exhale' ? '50%' : '1.5rem') : '1.5rem',
            opacity: isPlaying ? (phases[phaseIndex] === 'Hold' ? 0.7 : 1) : 0.5
          }}
          transition={{ duration: 4, ease: "linear" }}
          className="absolute w-full h-full bg-pink-500/40 border border-pink-400"
        />
        <div className="z-10 text-center">
          <span className="block text-4xl font-black text-white uppercase tracking-widest drop-shadow-xl mb-2">
            {isPlaying ? phases[phaseIndex] : 'READY'}
          </span>
          {isPlaying && <span className="block text-pink-300 font-bold">4 Seconds</span>}
        </div>
      </div>

      <button onClick={() => setIsPlaying(!isPlaying)} className={`px-10 py-4 rounded-2xl font-black flex items-center gap-3 transition-all transform hover:-translate-y-1 ${isPlaying ? 'bg-white/10 text-white' : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30'}`}>
        {isPlaying ? <Square size={20} /> : <Play size={20} />}
        {isPlaying ? 'STOP EXERCISE' : 'START BOX BREATHING'}
      </button>
    </div>
  );
};

// ------------------------------------
// 3. PROGRESSIVE RELAXATION
// ------------------------------------
const ProgressiveRelaxation = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const steps = [
    { title: "Toes & Feet", desc: "Curl your toes tightly downward. Hold for 5 seconds, then release completely." },
    { title: "Calves", desc: "Point your toes upward towards your face to tense your calves. Hold for 5s, release." },
    { title: "Thighs", desc: "Squeeze your thigh muscles tightly together. Hold for 5s, release." },
    { title: "Abdomen", desc: "Suck your stomach in tightly. Hold for 5s, release." },
    { title: "Shoulders", desc: "Shrug your shoulders up tightly to your ears. Hold for 5s, release." },
    { title: "Face", desc: "Scrunch your face tightly, close your eyes hard. Hold for 5s, release and relax your jaw." }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto py-12 px-6">
      <button onClick={() => navigate('/relax')} className="mb-12 flex items-center gap-2 text-white/50 hover:text-white transition-colors group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Overview
      </button>
      
      <div className="text-center mb-12">
        <Activity size={40} className="text-green-400 mx-auto mb-6" />
        <h2 className="text-4xl font-black text-white mb-4">Progressive Muscle Relaxation</h2>
        <p className="text-white/60">Physically release tension from your body to signal your brain to lower cortisol.</p>
      </div>

      <div className="space-y-4">
        {steps.map((s, idx) => (
          <div key={idx} onClick={() => setStep(idx)} className={`p-6 rounded-2xl border transition-all cursor-pointer ${step === idx ? 'bg-green-500/20 border-green-500/50 transform scale-[1.02]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${step === idx ? 'bg-green-400 text-black' : 'bg-white/10 text-white/50'}`}>{idx + 1}</div>
              <div>
                <h3 className={`text-lg font-bold ${step === idx ? 'text-green-300' : 'text-white'}`}>{s.title}</h3>
                {step === idx && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-white/70 mt-2">{s.desc}</motion.p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ------------------------------------
// 4. MINDFULNESS (5-4-3-2-1 Grounding)
// ------------------------------------
const Mindfulness = () => {
  const navigate = useNavigate();
  const stepsData = [
    { num: 5, label: "Things you can SEE", color: "text-blue-400", border: "border-blue-400/50", bg: "bg-blue-500" },
    { num: 4, label: "Things you can FEEL", color: "text-pink-400", border: "border-pink-400/50", bg: "bg-pink-500" },
    { num: 3, label: "Things you can HEAR", color: "text-purple-400", border: "border-purple-400/50", bg: "bg-purple-500" },
    { num: 2, label: "Things you can SMELL", color: "text-yellow-400", border: "border-yellow-400/50", bg: "bg-yellow-500" },
    { num: 1, label: "Thing you can TASTE", color: "text-green-400", border: "border-green-400/50", bg: "bg-green-500" },
  ];

  const [activeStep, setActiveStep] = useState(0);
  const [inputs, setInputs] = useState(stepsData.map(s => Array(s.num).fill('')));

  const handleInputChange = (stepIdx, inputIdx, val) => {
    const newInputs = [...inputs];
    newInputs[stepIdx][inputIdx] = val;
    setInputs(newInputs);
  };

  const isStepComplete = (stepIdx) => {
    return inputs[stepIdx].every(val => val.trim().length > 0);
  };

  const handleNext = () => {
    if (isStepComplete(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  if (activeStep === 5) {
    return (
      <div className="w-full max-w-2xl mx-auto py-32 px-6 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }}>
          <Heart size={80} className="text-cyan-400 mx-auto mb-8 animate-pulse drop-shadow-[0_0_30px_rgba(34,211,238,0.6)]" />
          <h2 className="text-5xl font-black text-white mb-6">You are grounded.</h2>
          <p className="text-2xl text-white/70 mb-16">Take a deep breath 💙</p>
          <div className="flex justify-center gap-6">
            <button onClick={() => { setActiveStep(0); setInputs(stepsData.map(s => Array(s.num).fill(''))); }} className="px-8 py-4 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all">Restart</button>
            <button onClick={() => navigate('/relax')} className="px-8 py-4 rounded-2xl bg-cyan-500 text-white font-bold hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/30">Back to Relax</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-12 px-6">
      <button onClick={() => navigate('/relax')} className="mb-12 flex items-center gap-2 text-white/50 hover:text-white transition-colors group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Overview
      </button>
      
      <div className="text-center mb-12">
        <Moon size={40} className="text-indigo-400 mx-auto mb-6" />
        <h2 className="text-4xl font-black text-white mb-4">5-4-3-2-1 Grounding</h2>
        <p className="text-white/60">When anxiety spikes, name items in your environment to snap your mind back to the present moment.</p>
      </div>

      <div className="space-y-6">
        {stepsData.map((s, idx) => {
          const isActive = idx === activeStep;
          const isCompleted = idx < activeStep;
          const isLocked = idx > activeStep;

          return (
            <div key={idx} className={`p-6 rounded-3xl border transition-all duration-500 ${isActive ? ('bg-white/10 ' + s.border + ' shadow-2xl transform scale-[1.02]') : isCompleted ? 'bg-white/5 border-white/5 opacity-60' : 'bg-black/20 border-white/5 opacity-40'}`}>
              
              {/* Header */}
              <div className="flex items-center justify-between cursor-pointer" onClick={() => { if (isCompleted) setActiveStep(idx); }}>
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black transition-colors ${isActive ? (s.bg + ' text-white shadow-lg') : isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/30'}`}>
                    {isCompleted ? <CheckCircle2 size={24} /> : s.num}
                  </div>
                  <div className={`text-xl font-bold tracking-widest uppercase ${isActive ? s.color : 'text-white/50'}`}>
                    {s.label}
                  </div>
                </div>
              </div>

              {/* Expandable Input Area */}
              <AnimatePresence>
                {isActive && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mt-8">
                    <div className="space-y-4 pl-20">
                      {inputs[idx].map((val, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${val.trim() ? (s.border + ' ' + s.color + ' bg-white/5') : 'border-white/10 text-white/30'}`}>
                            {i + 1}
                          </div>
                          <input
                            autoFocus={i === 0}
                            type="text"
                            value={val}
                            onChange={(e) => handleInputChange(idx, i, e.target.value)}
                            placeholder={"Type something you can " + s.label.split(' ').pop().toLowerCase() + "..."}
                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-all"
                          />
                        </div>
                      ))}

                      <div className="pt-6">
                        <button 
                          onClick={handleNext}
                          disabled={!isStepComplete(idx)}
                          className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest transition-all ${isStepComplete(idx) ? (s.bg + ' text-white shadow-lg transform hover:-translate-y-1') : 'bg-white/5 text-white/30 cursor-not-allowed'}`}
                        >
                          {idx === 4 ? "Complete Exercise" : "Next Step"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          );
        })}
      </div>
    </div>
  );
};

// ------------------------------------
// MAIN HUB (RELAX PAGE)
// ------------------------------------
const RelaxPage = ({ setActiveTab }) => {
  const navigate = useNavigate();

  const methods = [
    { id: 'focus-breathe', title: "Focus & Breathe", desc: "Guided 4-second inhale/exhale cycles to lower your heart rate.", icon: <Wind size={32} className="text-cyan-400" />, bg: "from-cyan-500/10 to-blue-500/10", border: "hover:border-cyan-500/50" },
    { id: 'box-breathing', title: "Box Breathing", desc: "4-4-4-4 Navy SEAL breathing method for instant stress relief.", icon: <Sparkles size={32} className="text-pink-400" />, bg: "from-pink-500/10 to-purple-500/10", border: "hover:border-pink-500/50" },
    { id: 'progressive-relaxation', title: "Progressive Relaxation", desc: "Tense and release muscle groups to physically purge anxiety.", icon: <Activity size={32} className="text-green-400" />, bg: "from-green-500/10 to-emerald-500/10", border: "hover:border-green-500/50" },
    { id: 'mindfulness', title: "5-4-3-2-1 Grounding", desc: "Sensory mindfulness technique to stop panic attacks and overthinking.", icon: <BrainCircuit size={32} className="text-indigo-400" />, bg: "from-indigo-500/10 to-violet-500/10", border: "hover:border-indigo-500/50" }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-6">
      <button onClick={() => setActiveTab('home')} className="mb-8 flex items-center gap-2 text-white/50 hover:text-white transition-colors group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Back to Dashboard</span>
      </button>

      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-white/5 mb-6">
          <Heart size={40} className="text-pink-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Stress & Cortisol Management</h1>
        <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
          Chronic stress directly drives PCOS insulin resistance. Choose an interactive exercise below to actively lower your cortisol levels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {methods.map((m, idx) => (
          <motion.div 
            key={m.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
            onClick={() => navigate(`/relax/${m.id}`)}
            className={`cursor-pointer p-8 rounded-3xl border border-white/10 bg-gradient-to-br ${m.bg} ${m.border} transition-all transform hover:-translate-y-2 group`}
          >
            <div className="flex items-start gap-6">
              <div className="p-4 bg-black/40 rounded-2xl border border-white/5 group-hover:scale-110 transition-transform">{m.icon}</div>
              <div>
                <h3 className="text-2xl font-black text-white mb-2">{m.title}</h3>
                <p className="text-white/60 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-2xl border border-white/5 bg-white/5 flex items-center gap-4 justify-center">
        <AlertCircle className="text-cyan-400" size={24} />
        <p className="text-sm text-white/50 italic">Consistency is key. Try to complete one 5-minute exercise daily.</p>
      </div>
    </div>
  );
};

// ------------------------------------
// ROUTER COMPONENT
// ------------------------------------
export default function StressManagement({ setActiveTab }) {
  return (
    <Routes>
      <Route path="/" element={<RelaxPage setActiveTab={setActiveTab} />} />
      <Route path="/relax" element={<RelaxPage setActiveTab={setActiveTab} />} />
      <Route path="/relax/focus-breathe" element={<FocusBreathe />} />
      <Route path="/relax/box-breathing" element={<BoxBreathing />} />
      <Route path="/relax/progressive-relaxation" element={<ProgressiveRelaxation />} />
      <Route path="/relax/mindfulness" element={<Mindfulness />} />
      <Route path="*" element={<RelaxPage setActiveTab={setActiveTab} />} />
    </Routes>
  );
}
