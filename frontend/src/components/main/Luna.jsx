import React, { useState, useEffect } from 'react';
import Header from '../common/Header';
import Results from "../common/Results";
import Tracker from '../common/Tracker';
import Resources from '../common/Resources';
import Assessment from '../common/Assessment';
import Home from '../common/Home';
import Onboarding from '../common/Onboarding';
import EarlyDetection from '../common/EarlyDetection';
import Doctors from '../common/Doctors';
import Community from '../common/Community';
import Contact from '../common/Contact';
import Dashboard from '../common/Dashboard';
import DietPlan from '../common/DietPlan';
import StressManagement from '../common/StressManagement';
import Blogs from '../common/Blogs';
import LifestyleRecommendations from '../common/LifestyleRecommendations';
import Chatbot from '../common/Chatbot';
import Profile from '../common/Profile';
import { calculateBMI, assessRisk } from '../../utils/healthUtils';
import { motion, AnimatePresence } from 'framer-motion';
import MobileNav from '../common/MobileNav';
import Footer from '../common/Footer';
import { ShieldCheck, Instagram, Eye, EyeOff } from 'lucide-react';

const Luna = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState('dark');

  // Sync theme with data-theme attribute on document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('luna_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authMessage, setAuthMessage] = useState('');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (authMode === 'signup') {
      const newUser = { name: authForm.name || 'User', email: authForm.email };
      setUserData(prev => ({ ...prev, name: newUser.name, email: newUser.email }));
      setAuthMessage('Successfully signed up! Please log in.');
      setAuthMode('login');
      setAuthForm({ ...authForm, password: '' });
      setTimeout(() => setAuthMessage(''), 3000);
      return;
    } else {
      const loggedUser = { name: 'User', email: authForm.email };
      setCurrentUser(loggedUser);
      localStorage.setItem('luna_current_user', JSON.stringify(loggedUser));
      setAuthMessage('Successfully logged in!');
    }
    setAuthOpen(false);
    setAuthForm({ name: '', email: '', password: '' });
    setTimeout(() => setAuthMessage(''), 3000);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('luna_current_user');
    setAuthMessage('Successfully logged out!');
    setActiveTab('home');
    setTimeout(() => setAuthMessage(''), 3000);
  };

  const handleSetActiveTab = (tab) => {
    if (!currentUser && tab !== 'home' && tab !== 'blogs' && tab !== 'contact') {
      setAuthMode('login');
      setAuthOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('luna_user_data');
    return saved ? JSON.parse(saved) : {
      name: '',
      email: '',
      age: '',
      weight: '',
      height: '',
      cycleRegularity: '',
      symptoms: [],
      lifestyleFactors: [],
      biomarkers: {
        glucose: '',
        bloodPressure: '',
        heartRate: '',
        sleep: ''
      }
    };
  });

  // Persist user data to localStorage
  useEffect(() => {
    localStorage.setItem('luna_user_data', JSON.stringify(userData));
  }, [userData]);
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [cycleData, setCycleData] = useState({
    startDate: '',
    endDate: '',
    symptoms: [],
    mood: ''
  });
  const [cycleHistory, setCycleHistory] = useState(() => {
    const saved = localStorage.getItem('cycles');
    return saved ? JSON.parse(saved) : [];
  });

  const symptomOptions = [
    'Irregular periods',
    'Heavy bleeding',
    'Acne',
    'Weight gain',
    'Hair loss',
    'Excess hair growth',
    'Fatigue',
    'Mood swings',
    'Pelvic pain',
    'Headaches'
  ];

  const lifestyleOptions = [
    'Sedentary lifestyle',
    'High sugar diet',
    'Stressful job',
    'Irregular sleep',
    'Smoking',
    'Alcohol consumption',
    'Poor dietary habits'
  ];

  return (
    <div className={`min-h-screen relative bg-dark text-primary overflow-x-hidden`}>
      <AnimatePresence>
        {authMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[110] bg-accent text-white px-6 py-3 rounded-full shadow-lg font-bold"
          >
            {authMessage}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header */}
      <Header 
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        onOpenLogin={() => { setAuthMode('login'); setAuthOpen(true); }}
        onOpenSignup={() => { setAuthMode('signup'); setAuthOpen(true); }}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Mobile Navigation */}
      <MobileNav activeTab={activeTab} setActiveTab={handleSetActiveTab} />

      {/* Main Content */}
      <main className="mx-auto pt-24 relative z-10 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'home' && (
              <Home 
                setActiveTab={handleSetActiveTab}
                onOpenLogin={() => { setAuthMode('login'); setAuthOpen(true); }}
                onOpenSignup={() => { setAuthMode('signup'); setAuthOpen(true); }}
              />
            )}
            {activeTab === 'onboarding' && <Onboarding setActiveTab={handleSetActiveTab} setUserData={setUserData} />}
            {activeTab === 'assessment' && (
              <Assessment
                userData={userData}
                setUserData={setUserData}
                symptomOptions={symptomOptions}
                lifestyleOptions={lifestyleOptions}
                calculateBMI={() => calculateBMI(userData.weight, userData.height)}
                assessRisk={() => handleSetActiveTab('early-detection')}
                setActiveTab={handleSetActiveTab}
              />
            )}

            {activeTab === 'early-detection' && <EarlyDetection userData={userData} setActiveTab={handleSetActiveTab} />}
            {activeTab === 'results' && <Results riskAssessment={riskAssessment} setActiveTab={handleSetActiveTab} />}
            {activeTab === 'tracker' && (
              <Tracker
                cycleData={cycleData}
                setCycleData={setCycleData}
                cycleHistory={cycleHistory}
                onCycleUpdate={setCycleHistory}
                symptoms={symptoms}
                onSymptomUpdate={setSymptoms}
                symptomOptions={symptomOptions}
                setActiveTab={handleSetActiveTab}
              />
            )}
            {activeTab === 'resources' && <Resources setActiveTab={handleSetActiveTab} />}
            {activeTab === 'doctors' && <Doctors setActiveTab={handleSetActiveTab} />}
            {activeTab === 'community' && <Community setActiveTab={handleSetActiveTab} />}
            {activeTab === 'dashboard' && (
              <Dashboard 
                userData={userData} 
                setUserData={setUserData}
                calculateBMI={() => calculateBMI(userData.weight, userData.height)} 
                setActiveTab={handleSetActiveTab}
              />
            )}
            {activeTab === 'diet-plan' && <DietPlan setActiveTab={handleSetActiveTab} />}
            {activeTab === 'stress-management' && <StressManagement setActiveTab={handleSetActiveTab} />}
            {activeTab === 'lifestyle' && <LifestyleRecommendations setActiveTab={handleSetActiveTab} userData={userData} />}
            {activeTab === 'blogs' && <Blogs setActiveTab={handleSetActiveTab} />}
            {activeTab === 'contact' && <Contact setActiveTab={handleSetActiveTab} />}
            {activeTab === 'profile' && (
              <Profile 
                userData={userData} 
                setUserData={setUserData}
                calculateBMI={() => calculateBMI(userData.weight, userData.height)} 
                setActiveTab={handleSetActiveTab}
                onLogout={handleLogout}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Enhanced Auth Modal */}
      <AnimatePresence>
        {authOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-sm med-card relative overflow-hidden border-white/10 shadow-2xl shadow-accent/20"
            >
              {/* Decorative Background Elements */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-neon-blue/20 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-primary leading-tight">
                        {authMode === 'login' ? 'Patient Portal' : 'Join Guardian'}
                      </h3>
                      <p className="text-[9px] text-text-tertiary uppercase tracking-widest font-bold">Secure Healthcare Access</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setAuthOpen(false)} 
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-text-secondary hover:text-primary"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex gap-2 p-1 mb-4 bg-dark/50 rounded-xl border border-white/5 shadow-inner">
                  <button 
                    onClick={() => setAuthMode('login')} 
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300 ${authMode === 'login' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-text-secondary hover:text-primary'}`}
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => setAuthMode('signup')} 
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300 ${authMode === 'signup' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-text-secondary hover:text-primary'}`}
                  >
                    Sign Up
                  </button>
                </div>

                <form className="space-y-3" onSubmit={handleAuthSubmit}>
                  <AnimatePresence mode="popLayout">
                    {authMode === 'signup' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1"
                      >
                        <label className="text-[9px] text-text-tertiary font-bold uppercase tracking-widest ml-1">Full Name</label>
                        <input type="text" value={authForm.name} onChange={(e) => setAuthForm({...authForm, name: e.target.value})} placeholder="Enter your name" className="med-input w-full py-2 bg-dark/50 border-white/10 focus:border-accent transition-all text-sm" required={authMode === 'signup'} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="space-y-1">
                    <label className="text-[9px] text-text-tertiary font-bold uppercase tracking-widest ml-1">Email Address</label>
                    <input type="email" value={authForm.email} onChange={(e) => setAuthForm({...authForm, email: e.target.value})} placeholder="name@example.com" className="med-input w-full py-2 bg-dark/50 border-white/10 focus:border-accent transition-all text-sm" required />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] text-text-tertiary font-bold uppercase tracking-widest ml-1">Password</label>
                      {authMode === 'login' && <button type="button" className="text-[9px] text-accent font-bold uppercase tracking-widest hover:underline">Forgot?</button>}
                    </div>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        value={authForm.password} 
                        onChange={(e) => setAuthForm({...authForm, password: e.target.value})} 
                        placeholder="••••••••" 
                        className="med-input w-full py-2 pl-3 pr-10 bg-dark/50 border-white/10 focus:border-accent transition-all text-sm" 
                        required 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-accent transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-1 flex flex-col gap-3">
                    <button type="submit" className="w-full py-2 bg-accent text-white rounded-xl font-bold shadow-xl shadow-accent/20 hover:scale-[1.01] active:scale-[0.99] transition-all text-sm">
                      {authMode === 'signup' ? 'Create Secure Account' : 'Authorize Login'}
                    </button>
                    
                    <div className="relative flex items-center gap-4 py-1">
                      <div className="flex-1 h-[1px] bg-white/10" />
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">Continue with</span>
                      <div className="flex-1 h-[1px] bg-white/10" />
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <motion.a 
                        href="https://accounts.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 transition-all text-xs font-medium text-gray-200 cursor-pointer"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Google
                      </motion.a>
                      <motion.a 
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 transition-all text-xs font-medium text-gray-200 cursor-pointer"
                      >
                        <Instagram size={18} className="text-pink-500" />
                        Instagram
                      </motion.a>
                    </div>
                  </div>
                </form>
                
                <p className="mt-4 text-center text-[10px] text-text-tertiary leading-relaxed px-8">
                  By joining, you agree to our <button className="text-accent font-bold hover:underline">Privacy Policy</button> and <button className="text-accent font-bold hover:underline">Terms of Service</button>. 
                  All health data is encrypted under HIPAA standards.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer setActiveTab={handleSetActiveTab} />
      
      {/* Persistent Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Luna;