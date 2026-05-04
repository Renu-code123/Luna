import React from 'react';
import { Home, Shield, Calendar, Salad, BookOpen, Users, Sparkles } from 'lucide-react';

const MobileNav = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: 'home', icon: <Home size={20} />, label: 'Home' },
    { key: 'assessment', icon: <Shield size={20} />, label: 'Assess' },
    { key: 'tracker', icon: <Calendar size={20} />, label: 'Track' },
    { key: 'diet-plan', icon: <Salad size={20} />, label: 'Diet' },
    { key: 'lifestyle', icon: <Sparkles size={20} />, label: 'Lifestyle' },
    { key: 'blogs', icon: <BookOpen size={20} />, label: 'Blog' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden">
      <div className="bg-dark/80 backdrop-blur-xl border-t border-white/5 px-4 py-3 flex justify-around items-center shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              activeTab === tab.key ? 'text-neon-blue scale-110' : 'text-text-tertiary'
            }`}
          >
            <div className={`${activeTab === tab.key ? 'drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]' : ''}`}>
              {tab.icon}
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;