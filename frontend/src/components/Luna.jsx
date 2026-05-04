import React, { useState, useEffect } from 'react';
import Header from './common/Header';
import Onboarding from './common/Onboarding';
import EarlyDetection from './common/EarlyDetection';
import Tracker from './common/Tracker';
import MLModel from './common/MLModel';
import SymptomAnalyzer from './common/SymptomAnalyzer';
import PeriodPredictor from './common/PeriodPredictor';
import Chatbot from './common/Chatbot';
import Home from './common/Home';
import Login from './common/Login';
import Signup from './common/Signup';
import Profile from './common/Profile';
import Footer from './common/Footer';
import Assessment from './common/Assessment';

const PcosGuardian = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState('light');
  const [userData, setUserData] = useState(null);
  const [cycleHistory, setCycleHistory] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  
  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load user data from local storage on component mount
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    const storedCycles = localStorage.getItem('cycleHistory');
    const storedSymptoms = localStorage.getItem('symptoms');
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme) {
      setTheme(storedTheme);
    }
    
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
    
    if (storedCycles) {
      setCycleHistory(JSON.parse(storedCycles));
    }
    
    if (storedSymptoms) {
      setSymptoms(JSON.parse(storedSymptoms));
    } else {
      const mockSymptoms = [
        { name: 'Irregular periods', severity: 8, date: '2023-04-15' },
        { name: 'Acne', severity: 6, date: '2023-04-10' },
        { name: 'Weight gain', severity: 7, date: '2023-04-05' },
        { name: 'Mood swings', severity: 5, date: '2023-04-12' },
        { name: 'Fatigue', severity: 6, date: '2023-04-08' }
      ];
      setSymptoms(mockSymptoms);
      localStorage.setItem('symptoms', JSON.stringify(mockSymptoms));
    }
    
    if (!storedUserData) {
      const mockUserData = {
        name: 'Arushi Thakur',
        email: 'arushi.thakur@example.com',
        age: 28,
        weight: 65,
        height: 165,
        bmi: 23.8,
        familyHistory: true,
        diagnosedWithPCOS: false,
        symptoms: ['Irregular periods', 'Weight gain', 'Acne'],
        lifestyleFactors: ['Stressful job/life', 'Irregular sleep']
      };
      setUserData(mockUserData);
      localStorage.setItem('userData', JSON.stringify(mockUserData));
    }
    
    if (!storedCycles) {
      const today = new Date();
      const mockCycles = [
        {
          id: '1',
          startDate: new Date(today.getFullYear(), today.getMonth() - 5, 5).toISOString().split('T')[0],
          endDate: new Date(today.getFullYear(), today.getMonth() - 5, 10).toISOString().split('T')[0],
          symptoms: ['Cramps', 'Bloating'],
          mood: 'Irritable'
        }
      ];
      setCycleHistory(mockCycles);
      localStorage.setItem('cycleHistory', JSON.stringify(mockCycles));
    }
  }, []);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };
  
  const handleUserDataUpdate = (newData) => {
    const updatedData = { ...userData, ...newData };
    setUserData(updatedData);
    localStorage.setItem('userData', JSON.stringify(updatedData));
  };
  
  const handleCycleUpdate = (newCycles) => {
    setCycleHistory(newCycles);
    localStorage.setItem('cycleHistory', JSON.stringify(newCycles));
  };
  
  const handleSymptomUpdate = (newSymptoms) => {
    setSymptoms(newSymptoms);
    localStorage.setItem('symptoms', JSON.stringify(newSymptoms));
  };

  return (
    <div className="min-h-screen bg-dark text-[var(--text-color)] transition-colors duration-300">
      <Header 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenLogin={() => setActiveTab('login')}
        onOpenSignup={() => setActiveTab('signup')}
      />
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <Home setActiveTab={handleTabChange} />
        )}
        
        {activeTab === 'login' && (
          <Login setActiveTab={handleTabChange} />
        )}

        {activeTab === 'signup' && (
          <Signup setActiveTab={handleTabChange} />
        )}

        {activeTab === 'profile' && (
          <Profile userData={userData} setActiveTab={handleTabChange} />
        )}

        {activeTab === 'onboarding' && (
          <Onboarding 
            userData={userData} 
            onUserDataUpdate={handleUserDataUpdate} 
          />
        )}
        
        {activeTab === 'assessment' && (
          <Assessment 
            userData={userData} 
            setUserData={handleUserDataUpdate}
            symptomOptions={[
              'Irregular periods', 'Heavy bleeding', 'Acne', 'Weight gain', 
              'Hair loss', 'Excess hair growth', 'Fatigue', 'Mood swings', 
              'Pelvic pain', 'Headaches'
            ]}
            lifestyleOptions={[
              'Sedentary lifestyle', 'High sugar diet', 'Stressful job/life', 
              'Irregular sleep', 'Smoking', 'Alcohol consumption', 
              'Regular exercise', 'Balanced diet'
            ]}
            calculateBMI={() => {
              if (userData && userData.weight && userData.height) {
                const heightInMeters = userData.height / 100;
                return (userData.weight / (heightInMeters * heightInMeters)).toFixed(1);
              }
              return null;
            }}
            assessRisk={() => handleTabChange('early-detection')}
          />
        )}
        
        {activeTab === 'early-detection' && (
          <div className="space-y-12">
            <EarlyDetection 
              userData={userData} 
              onUserDataUpdate={handleUserDataUpdate} 
              setActiveTab={handleTabChange}
            />
            <MLModel userData={userData} />
          </div>
        )}
        
        {activeTab === 'tracker' && (
          <div className="space-y-12">
            <Tracker 
              cycleHistory={cycleHistory} 
              onCycleUpdate={handleCycleUpdate} 
              symptoms={symptoms}
              onSymptomUpdate={handleSymptomUpdate}
            />
            <PeriodPredictor cycleHistory={cycleHistory} />
          </div>
        )}
        
        {activeTab === 'symptom-analysis' && (
          <SymptomAnalyzer userSymptoms={symptoms} />
        )}
        
        {activeTab === 'resources' && (
          <div className="neon-card">
            <h2 className="text-2xl font-bold text-neon-purple neon-text mb-6">Resources & Education</h2>
            <p className="text-[var(--text-color)] mb-8">Coming soon! This section will provide educational resources about PCOS/PCOD.</p>
          </div>
        )}
        
        {activeTab === 'doctors' && (
          <div className="neon-card">
            <h2 className="text-2xl font-bold text-neon-blue neon-text mb-6">Specialist Network</h2>
            <p className="text-[var(--text-color)] mb-8">Coming soon! Find board-certified endocrinologists and specialists in your area.</p>
          </div>
        )}
        
        {activeTab === 'community' && (
          <div className="neon-card">
            <h2 className="text-2xl font-bold text-neon-pink neon-text mb-6">Community Forum</h2>
            <p className="text-[var(--text-color)] opacity-80 mb-8">Coming soon! Connect with others in our supportive community.</p>
          </div>
        )}
      </main>
      
      <Footer setActiveTab={handleTabChange} />
      <Chatbot />
    </div>
  );
};

export default PcosGuardian;