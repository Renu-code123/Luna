import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Calendar, Activity, Heart, ArrowRight, Star, CheckCircle, Users, Zap, Search, Brain, Layout } from 'lucide-react';

const Home = ({ setActiveTab }) => {
  return (
    <div className="min-h-[85vh] flex flex-col justify-center px-4 relative overflow-hidden">
      {/* Background Neon Glows - Keeping the original vibe but slightly more refined */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-neon-blue/20 rounded-full blur-[120px] -z-10 pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center max-w-7xl mx-auto w-full pt-12 pb-20">
        {/* Left Side: Enhanced Hero Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(0,240,255,0.1)]">
            <Zap size={12} fill="currentColor" /> AI-Enhanced Healthcare
          </div>
          
          <div className="space-y-2">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple neon-text block drop-shadow-[0_0_15px_rgba(188,19,254,0.4)]">Luna</span>
            </h1>
          </div>
          
          <p className="text-lg md:text-xl text-[var(--text-color)] opacity-80 max-w-xl font-light leading-relaxed">
            Revolutionizing PCOS management with AI-powered detection, smart tracking, and personalized lifestyle insights tailored to your unique biology.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={() => setActiveTab('assessment')}
              className="px-8 py-3.5 rounded-xl border-2 border-neon-blue text-neon-blue hover:bg-neon-blue/10 transition-all font-bold uppercase tracking-wider text-sm neon-shadow-blue hover:scale-105 active:scale-95"
            >
              Assess My Risk
            </button>
            <button 
              onClick={() => setActiveTab('tracker')}
              className="px-8 py-3.5 rounded-xl border-2 border-neon-pink text-neon-pink hover:bg-neon-pink/10 transition-all font-bold uppercase tracking-wider text-sm neon-shadow-pink hover:scale-105 active:scale-95"
            >
              Track Your Cycle
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-8 pt-6 text-[11px] font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2 text-neon-pink opacity-80">
              <Shield size={16} /> Trusted Guidance
            </div>
            <div className="flex items-center gap-2 text-neon-blue opacity-80">
              <Activity size={16} /> AI Predictions
            </div>
            <div className="flex items-center gap-2 text-neon-purple opacity-80">
              <Users size={16} /> Community Support
            </div>
          </div>
        </motion.div>

        {/* Right Side: Visual Enhancement (Dashboard Preview) */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:flex justify-center"
        >
          <div className="w-full max-w-md aspect-square rounded-3xl border border-neon-blue/30 p-1 neon-shadow-blue relative overflow-hidden group">
            <div className="w-full h-full bg-dark-secondary rounded-[22px] overflow-hidden flex flex-col relative">
              {/* Header of preview */}
              <div className="h-14 border-b border-white/5 flex items-center px-6 justify-between bg-dark/40 backdrop-blur-md">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                </div>
                <div className="text-[10px] text-text-tertiary font-bold tracking-widest uppercase opacity-60">System Monitoring</div>
              </div>
              
              {/* Content of preview */}
              <div className="p-8 space-y-8 flex-1 flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary font-medium">Diagnostic Confidence</span>
                    <span className="text-xs text-neon-blue font-bold">98.4%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '98.4%' }}
                      transition={{ duration: 2, delay: 1 }}
                      className="h-full bg-neon-blue shadow-[0_0_10px_rgba(0,240,255,0.6)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neon-purple/20 flex items-center justify-center text-neon-purple">
                      <Heart size={16} />
                    </div>
                    <div className="h-2 w-12 bg-white/10 rounded" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neon-pink/20 flex items-center justify-center text-neon-pink">
                      <Calendar size={16} />
                    </div>
                    <div className="h-2 w-16 bg-white/10 rounded" />
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className="w-full py-3 rounded-xl bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-xs font-bold uppercase tracking-widest hover:bg-neon-blue/20 transition-all"
                >
                  Live Analytics Preview
                </button>
              </div>
            </div>
            {/* Absolute floating elements */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-neon-purple/10 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-neon-blue/10 rounded-full blur-2xl animate-pulse" />
          </div>
        </motion.div>
      </div>

      {/* Feature Grid - Enhanced original layout */}
      <div className="max-w-7xl mx-auto w-full py-20 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Advanced Feature Ecosystem</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-neon-blue to-neon-purple mx-auto rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { 
              title: 'Early Detection', 
              desc: 'AI-powered risk assessment to identify potential PCOS/PCOD before symptoms worsen.', 
              icon: <Search size={28} />, 
              tab: 'assessment',
              color: 'neon-blue'
            },
            { 
              title: 'Period Tracking', 
              desc: 'Monitor your cycle, symptoms, and identify irregular patterns with smart insights.', 
              icon: <Calendar size={28} />, 
              tab: 'tracker',
              color: 'neon-pink'
            },
            { 
              title: 'Lifestyle Optimization', 
              desc: 'Get personalized diet, exercise, and wellness plans tailored to your unique profile.', 
              icon: <Layout size={28} />, 
              tab: 'diet-plan',
              color: 'neon-blue'
            },
            { 
              title: 'Mental Wellness', 
              desc: 'Access tools for stress management, mood tracking, and guided meditation sessions.', 
              icon: <Brain size={28} />, 
              tab: 'stress-management',
              color: 'neon-purple'
            },
            { 
              title: 'Doctor Finder', 
              desc: 'Locate specialists near you for clinical evaluations and personalized treatments.', 
              icon: <MapPin size={28} />, 
              tab: 'doctors',
              color: 'neon-pink'
            },
            { 
              title: 'Community Support', 
              desc: 'Connect with others, share experiences, and find emotional support inside our exclusive groups.', 
              icon: <Users size={28} />, 
              tab: 'community',
              color: 'neon-blue'
            }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              onClick={() => setActiveTab(feature.tab)}
              className="neon-card group cursor-pointer hover:border-white/20 transition-all border-white/5 relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-${feature.color}/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-${feature.color}/10 transition-all`} />
              
              <div className={`text-${feature.color} mb-6 transition-transform group-hover:scale-110 duration-300`}>
                {feature.icon}
              </div>
              <h3 className={`text-xl font-bold text-${feature.color} mb-3`}>{feature.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-8 line-clamp-3 group-hover:text-primary transition-colors">
                {feature.desc}
              </p>
              <div className={`flex items-center gap-2 text-xs font-bold text-${feature.color} uppercase tracking-widest`}>
                Open Feature <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* MapPin fallback for lucide import */}
      <style dangerouslySetInnerHTML={{ __html: `
        .text-neon-blue { color: var(--neon-blue); }
        .text-neon-pink { color: var(--neon-pink); }
        .text-neon-purple { color: var(--neon-purple); }
        .neon-shadow-blue { box-shadow: 0 0 15px rgba(0, 240, 255, 0.2); }
        .neon-shadow-pink { box-shadow: 0 0 15px rgba(255, 42, 133, 0.2); }
        .neon-shadow-purple { box-shadow: 0 0 15px rgba(188, 19, 254, 0.2); }
      `}} />
    </div>
  );
};

const MapPin = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default Home;