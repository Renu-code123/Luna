import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, Shield } from 'lucide-react';

const Header = ({ activeTab, setActiveTab, theme = 'dark', onToggleTheme, onOpenLogin, onOpenSignup, currentUser, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { key: 'home', label: 'Home' },
    { key: 'early-detection', label: 'Early Detection' },
    { key: 'tracker', label: 'Period Tracker' },
    { key: 'diet-plan', label: 'Diet Plan' },
    { key: 'blogs', label: 'Health Blog' },
    { key: 'community', label: 'Community' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 transition-all duration-300 w-full bg-dark border-b border-[var(--card-border)] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">

          <div
            className="flex items-center gap-3 cursor-pointer group mr-auto lg:mr-12"
            onClick={() => setActiveTab('home')}
          >
            <div className="shrink-0 w-12 h-12 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <Shield size={40} className="text-neon-purple drop-shadow-[0_0_8px_rgba(188,19,254,0.6)]" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold tracking-tight leading-none">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple neon-text">Luna</span>
              </h1>
              <span className="text-[9px] opacity-60 mt-1">Empower your health journey with AI-driven care</span>
            </div>
          </div>


          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`text-sm font-medium transition-colors whitespace-nowrap ${activeTab === item.key ? 'text-[var(--text-color)] font-bold' : 'text-[var(--text-color)] opacity-70 hover:opacity-100'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4 border-l border-[var(--card-border)] pl-4">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg border border-neon-purple text-neon-purple hover:bg-neon-purple/10 transition-colors"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {!currentUser ? (
              <>
                <button
                  onClick={onOpenLogin}
                  className="text-xs font-semibold px-4 py-2 rounded-lg border border-neon-purple text-neon-purple hover:bg-neon-purple/10 uppercase tracking-wider"
                >
                  Log In
                </button>
                <button
                  onClick={onOpenSignup}
                  className="text-xs font-semibold px-4 py-2 rounded-lg border border-neon-pink text-neon-pink hover:bg-neon-pink/10 uppercase tracking-wider"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-accent hidden xl:inline">Hi, {currentUser.name || 'User'}</span>
              </div>
            )}
            <button
              onClick={() => setActiveTab('lifestyle')}
              className="text-xs font-semibold px-4 py-2 rounded-lg border border-accent text-accent hover:bg-accent/10 uppercase tracking-wider"
            >
              Lifestyle Recommendation
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className="text-xs font-semibold px-4 py-2 rounded-lg border border-neon-blue text-neon-blue hover:bg-neon-blue/10 uppercase tracking-wider"
            >
              My Profile
            </button>
          </div>

          <button
            className="lg:hidden p-2 opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-dark lg:hidden flex flex-col p-6 pt-24 gap-8"
          >
            <nav className="flex flex-col gap-6">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => { setActiveTab(item.key); setMobileMenuOpen(false); }}
                  className={`text-xl font-medium text-left ${activeTab === item.key ? 'text-neon-blue' : 'text-[var(--text-color)] opacity-70'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="flex flex-col gap-4 mt-auto pb-8">
              {!currentUser ? (
                <>
                  <button onClick={() => { onOpenLogin(); setMobileMenuOpen(false); }} className="px-4 py-3 border border-neon-purple text-neon-purple rounded-lg text-center font-semibold">LOG IN</button>
                  <button onClick={() => { onOpenSignup(); setMobileMenuOpen(false); }} className="px-4 py-3 border border-neon-pink text-neon-pink rounded-lg text-center font-semibold">SIGN UP</button>
                </>
              ) : (
                <>
                  <span className="text-center font-bold text-accent">Hi, {currentUser.name || 'User'}</span>
                </>
              )}
              <button onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }} className="px-4 py-3 border border-neon-blue text-neon-blue rounded-lg text-center font-semibold">MY PROFILE</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;