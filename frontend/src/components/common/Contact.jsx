import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';

const Contact = ({ setActiveTab }) => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-12 px-4 sm:px-6 pb-24">
      <button
        onClick={() => setActiveTab('home')}
        className="mb-8 flex items-center gap-2 text-text-tertiary hover:text-primary transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Back to Overview</span>
      </button>

      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-white/5 border border-white/10 text-accent text-xs font-bold uppercase tracking-widest mb-4">
          <Mail size={14} />
          Support Team
        </div>
        <h1 className="text-4xl font-black text-primary tracking-tight mb-2">Contact Us</h1>
        <p className="text-text-secondary">Have questions or feedback? Our team is here to help you.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="med-card p-8 border-white/5"
      >
        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary ml-1">Full Name</label>
                <input type="text" placeholder="Your full name" className="med-input w-full" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary ml-1">Email Address</label>
                <input type="email" placeholder="your@email.com" className="med-input w-full" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary ml-1">Subject</label>
              <input type="text" placeholder="How can we help?" className="med-input w-full" required />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary ml-1">Message</label>
              <textarea placeholder="Describe your question or feedback in detail..." className="med-input w-full h-32 resize-none" required />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button type="submit" className="flex-1 py-3 bg-accent text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-2">
                <Send size={16} /> Send Message
              </button>
              <button type="button" onClick={() => setActiveTab('home')} className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-text-secondary font-bold hover:bg-white/10 transition-all text-sm">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-primary">Message Sent!</h3>
            <p className="text-text-secondary text-sm max-w-xs">We've received your message and will get back to you within 24 hours.</p>
            <button onClick={() => setActiveTab('home')} className="mt-4 px-8 py-3 bg-accent text-white font-bold rounded-2xl hover:scale-[1.02] transition-all shadow-lg shadow-accent/20">
              Back to Home
            </button>
          </motion.div>
        )}

        {/* Contact info */}
        {!sent && (
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-4 text-xs text-text-tertiary">
            <span className="flex items-center gap-2"><Mail size={12} /> support@luna.example</span>
            <span className="flex items-center gap-2"><MessageSquare size={12} /> Join our Community tab for peer support</span>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Contact;