import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, X, ChevronRight } from 'lucide-react';

const Resources = ({ setActiveTab }) => {
  const articles = [
    {
      id: 1,
      title: 'Understanding PCOS: Symptoms, Causes, and Care',
      category: 'Fundamentals',
      excerpt: 'A clear overview of PCOS/PCOD, common symptoms, and evidence-based lifestyle strategies.',
      content: 'PCOS (Polycystic Ovary Syndrome) affects hormone levels and can impact menstrual cycles, fertility, and metabolic health. Effective management often includes nutrition adjustments, regular exercise, stress reduction, and medical guidance where appropriate. Early detection and consistent tracking help tailor care to each person.',
      readTime: '5 min read',
    },
    {
      id: 2,
      title: 'Nutrition Basics for PCOS',
      category: 'Diet',
      excerpt: 'Practical tips for blood sugar balance, fiber intake, and anti-inflammatory foods.',
      content: 'Balanced meals with protein, fiber, and healthy fats support stable energy and hormone balance. Focus on whole foods, minimize ultra-processed snacks, and personalize meals based on symptom responses.',
      readTime: '4 min read',
    },
    {
      id: 3,
      title: 'Exercise and Hormonal Balance',
      category: 'Fitness',
      excerpt: 'How targeted movement can reduce insulin resistance and cortisol in PCOS.',
      content: 'Both resistance training and low-impact cardio have been shown to reduce insulin resistance — a core driver of PCOS. Aim for 150 minutes of moderate movement per week. Avoid excessive high-intensity workouts that spike cortisol.',
      readTime: '6 min read',
    },
    {
      id: 4,
      title: 'Stress, Cortisol, and PCOS',
      category: 'Lifestyle',
      excerpt: 'The direct link between chronic stress and worsening hormonal imbalance.',
      content: 'Elevated cortisol from chronic stress disrupts the HPA axis, worsening androgen levels and insulin resistance. Daily mindfulness, 4-7-8 breathing, and quality sleep are clinically supported interventions.',
      readTime: '7 min read',
    },
  ];

  const [selectedArticle, setSelectedArticle] = useState(null);

  const categoryColors = {
    Fundamentals: 'text-neon-blue border-neon-blue/30 bg-neon-blue/10',
    Diet: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
    Fitness: 'text-neon-purple border-neon-purple/30 bg-neon-purple/10',
    Lifestyle: 'text-accent border-accent/30 bg-accent/10',
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 sm:px-6 pb-24">
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
          <BookOpen size={14} />
          Knowledge Base
        </div>
        <h1 className="text-4xl font-black text-primary tracking-tight mb-2">Resources</h1>
        <p className="text-text-secondary">Clinical-grade articles to help you understand and manage PCOS better.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => setSelectedArticle(a)}
            className="med-card p-6 cursor-pointer hover:-translate-y-1 transition-all duration-300 border-white/5 hover:border-accent/30 flex flex-col gap-3 group"
          >
            <div className={`inline-flex text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xl border w-fit ${categoryColors[a.category]}`}>
              {a.category}
            </div>
            <h3 className="text-lg font-bold text-primary group-hover:text-accent transition-colors leading-snug">{a.title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed flex-1">{a.excerpt}</p>
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary">{a.readTime}</span>
              <span className="flex items-center gap-1 text-xs font-bold text-accent">Read Article <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Navigation */}
      <div className="mt-10 flex flex-wrap gap-3">
        <button onClick={() => setActiveTab('doctors')} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-text-secondary hover:bg-white/10 hover:text-primary transition-all">
          Find Doctors →
        </button>
        <button onClick={() => setActiveTab('community')} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-text-secondary hover:bg-white/10 hover:text-primary transition-all">
          Community →
        </button>
      </div>

      {/* Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl med-card p-8 relative border-white/10"
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-primary hover:bg-white/10 transition-all"
              >
                <X size={14} />
              </button>
              <div className={`inline-flex text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xl border w-fit mb-4 ${categoryColors[selectedArticle.category]}`}>
                {selectedArticle.category}
              </div>
              <h3 className="text-2xl font-black text-primary mb-4 leading-snug">{selectedArticle.title}</h3>
              <p className="text-text-secondary leading-relaxed">{selectedArticle.content}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Resources;