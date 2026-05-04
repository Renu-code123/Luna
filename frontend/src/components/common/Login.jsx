import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Instagram } from 'lucide-react';

const Login = ({ setActiveTab }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setActiveTab('home');
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <div className="neon-card flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl border-2 border-neon-blue flex items-center justify-center neon-shadow-blue mb-4">
          <Shield size={28} className="text-neon-blue" />
        </div>
        <h2 className="text-2xl font-bold mb-1">
          <span className="text-neon-blue neon-text">Welcome</span> Back
        </h2>
        <p className="text-xs text-gray-400 mb-6 text-center">Log in to securely access your health data.</p>
        
        <form onSubmit={handleSubmit} className="w-full space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-300">Email Address</label>
            <input 
              type="email" 
              className="neon-input w-full py-2 px-3 text-sm"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-300">Password</label>
            <input 
              type="password" 
              className="neon-input w-full py-2 px-3 text-sm"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="w-full neon-button neon-button-blue mt-2 py-2.5">
            Log In
          </button>
        </form>

        <div className="w-full flex items-center gap-4 my-6">
          <div className="flex-1 h-[1px] bg-white/10"></div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Continue with</span>
          <div className="flex-1 h-[1px] bg-white/10"></div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <motion.a
            href="https://accounts.google.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-white/10 transition-all group w-full bg-white/[0.02] cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-xs font-medium text-gray-200">Google</span>
          </motion.a>

          <motion.a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-white/10 transition-all group w-full bg-white/[0.02] cursor-pointer"
          >
            <Instagram size={18} className="text-pink-500" />
            <span className="text-xs font-medium text-gray-200">Instagram</span>
          </motion.a>
        </div>

        <div className="mt-4 text-xs text-gray-400">
          Don't have an account?{' '}
          <button onClick={() => setActiveTab('signup')} className="text-neon-pink hover:underline font-semibold">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
