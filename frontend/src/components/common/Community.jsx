import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Users, MessageSquare, Heart, Shield, Sparkles,
  ChevronRight, Share2, ArrowLeft, X, Send, Search,
  Filter, MessageCircle, ChevronDown, ChevronUp
} from 'lucide-react';

const STORAGE_KEY = 'luna_community_posts';

const defaultPosts = [
  {
    id: 1, user: 'Ananya', title: 'Reversed my PCOS symptoms!',
    text: 'Successfully reversed my PCOS symptoms after 2 months of Low-GI focus. The tracker really helped me see my progress!',
    likes: 142, liked: false, shares: 8, category: 'Transformation',
    comments: [], timestamp: Date.now() - 86400000 * 3
  },
  {
    id: 2, user: 'Sarah', title: 'Finally conceived after 3 years',
    text: 'Managed to conceive after 3 years! Managing stress and insulin levels were the most important factors for me. Don\'t lose hope.',
    likes: 215, liked: false, shares: 14, category: 'Success Story',
    comments: [], timestamp: Date.now() - 86400000 * 5
  },
  {
    id: 3, user: 'Priya', title: 'Regular cycle again 🌸',
    text: "Finally seeing a regular cycle again. Don't lose hope girls, consistency with the routine is everything.",
    likes: 110, liked: false, shares: 6, category: 'Support',
    comments: [], timestamp: Date.now() - 86400000 * 7
  },
  {
    id: 4, user: 'Elena', title: 'My favorite Low-GI breakfast recipe',
    text: 'Just tried baking almond flour muffins with chia seeds and stevia. It completely satisfies my sweet tooth without spiking my blood sugar! I eat them every morning now.',
    likes: 340, liked: false, shares: 45, category: 'Support',
    comments: [{ id: 1, text: "Need the recipe immediately!!", timestamp: Date.now() - 86400000 * 1 }], timestamp: Date.now() - 86400000 * 1
  },
  {
    id: 5, user: 'Jessica M.', title: 'Yoga Nidra for cortisol',
    text: 'I started doing 20 minutes of Yoga Nidra meditation before bed. Not only am I sleeping better, but my severe cystic acne has started clearing up. Stress management is so underrated!',
    likes: 289, liked: false, shares: 12, category: 'Transformation',
    comments: [], timestamp: Date.now() - 86400000 * 2
  },
  {
    id: 6, user: 'Nina_99', title: 'Positive Pregnancy Test! 🍼',
    text: 'I can\'t stop crying. After 4 years, multiple failed cycles, and focusing heavily on lowering my inflammation, I finally got my positive test today. Sending baby dust to everyone in this circle!',
    likes: 850, liked: false, shares: 120, category: 'Success Story',
    comments: [], timestamp: Date.now() - 86400000 * 4
  },
  {
    id: 7, user: 'Chef_Maria', title: 'Meal prep Sunday! 🥗',
    text: 'Prepped my diet for the whole week! Zucchini noodles, grilled chicken, and roasted Brussels sprouts. Having healthy food ready stops me from ordering takeout when I get home exhausted.',
    likes: 175, liked: false, shares: 22, category: 'Support',
    comments: [], timestamp: Date.now() - 86400000 * 6
  },
  {
    id: 8, user: 'Aisha', title: 'Feeling overwhelmed today',
    text: 'Just feeling really down about the hair loss today. Sometimes it feels like no matter how much I meditate or eat right, the symptoms just keep coming. Just needed to vent to people who understand.',
    likes: 420, liked: false, shares: 2, category: 'Support',
    comments: [{ id: 1, text: "You are beautiful and we are all in this together ❤️", timestamp: Date.now() - 3600000 }], timestamp: Date.now() - 86400000 * 0.5
  },
  {
    id: 9, user: 'Chloe_Fit', title: 'Lost 15 lbs / 7 kg!',
    text: 'I stopped doing high-intensity cardio and switched exclusively to slow weight lifting. It completely changed my body composition and lowered my cortisol. Down 15 lbs!',
    likes: 530, liked: false, shares: 88, category: 'Transformation',
    comments: [], timestamp: Date.now() - 86400000 * 8
  },
  {
    id: 10, user: 'Dr. Emily', title: 'Reminder on Supplements',
    text: 'A quick reminder: always take your Myo-Inositol with meals to maximize absorption! It makes a massive difference in how it regulates your insulin receptors.',
    likes: 920, liked: false, shares: 310, category: 'Support',
    comments: [], timestamp: Date.now() - 86400000 * 10
  },
  {
    id: 11, user: 'Foodie_Rach', title: 'Low GI Pizza Crust! 🍕',
    text: 'I successfully made a pizza crust out of cauliflower, egg, and almond flour. Topped it with sugar-free tomato sauce and mozzarella. It feels like a cheat meal but keeps my glucose completely flat!',
    likes: 412, liked: false, shares: 65, category: 'Transformation',
    comments: [], timestamp: Date.now() - 86400000 * 1.5
  },
  {
    id: 12, user: 'Zen_Master', title: 'Deep breathing stops my cravings',
    text: 'Whenever I get a sugar craving, I do 4-7-8 deep breathing for 5 minutes. It forces my nervous system out of fight-or-flight, and the craving usually disappears. Highly recommend this for anxiety.',
    likes: 275, liked: false, shares: 30, category: 'Support',
    comments: [], timestamp: Date.now() - 86400000 * 2.5
  },
  {
    id: 13, user: 'Maya_Hope', title: 'First ovulation in 8 months!',
    text: 'Confirmed via basal body temp tracking! My body is finally responding to the dietary changes and inositol. We are officially TTC (trying to conceive) this month!',
    likes: 640, liked: false, shares: 15, category: 'Success Story',
    comments: [], timestamp: Date.now() - 86400000 * 3.5
  },
  {
    id: 14, user: 'Chef_Nadia', title: 'Cinnamon in my morning coffee ☕',
    text: 'Replacing sugar with a heavy dash of Ceylon cinnamon in my coffee has been a game changer. It flavors the drink perfectly and helps blunt the morning cortisol/insulin spike. Great diet hack.',
    likes: 198, liked: false, shares: 42, category: 'Support',
    comments: [], timestamp: Date.now() - 86400000 * 4.5
  },
  {
    id: 15, user: 'Sleepy_Girl', title: 'Magnesium Glycinate changed my life',
    text: 'I used to have terrible insomnia and would wake up feeling anxious. Started taking 200mg of magnesium glycinate before bed, and I am finally getting deep sleep. It is amazing for stress recovery.',
    likes: 512, liked: false, shares: 89, category: 'Transformation',
    comments: [], timestamp: Date.now() - 86400000 * 5.5
  },
  {
    id: 16, user: 'Mama_Bear', title: 'Baby boy is here! 👶',
    text: 'After being told I might never conceive due to severe anovulatory PCOS, our miracle baby boy was born yesterday. For everyone struggling with fertility, keep fighting. Your time will come.',
    likes: 1250, liked: false, shares: 205, category: 'Success Story',
    comments: [], timestamp: Date.now() - 86400000 * 0.1
  },
  {
    id: 17, user: 'Healthy_Bites', title: 'What is your go-to snack?',
    text: 'I need some new low-GI snack ideas! Right now my diet is just carrots and hummus. What are you all eating between meals to avoid insulin crashes?',
    likes: 85, liked: false, shares: 2, category: 'Support',
    comments: [{ id: 1, text: "Greek yogurt with pumpkin seeds!", timestamp: Date.now() - 3600000 }], timestamp: Date.now() - 86400000 * 1.2
  },
  {
    id: 18, user: 'Mindful_Living', title: 'Managing work anxiety',
    text: 'My stressful job was completely ruining my hormones. I started blocking out 10 minutes at lunch just to sit in silence and do mental body scans. It has drastically reduced my afternoon fatigue.',
    likes: 310, liked: false, shares: 28, category: 'Support',
    comments: [], timestamp: Date.now() - 86400000 * 6.5
  },
  {
    id: 19, user: 'Keto_Queen', title: 'Spearmint tea results 🌿',
    text: 'I drank 2 cups of organic spearmint tea every day for a month. My jawline acne is 80% gone and the facial hair growth has slowed down significantly. Food really is medicine.',
    likes: 670, liked: false, shares: 145, category: 'Transformation',
    comments: [], timestamp: Date.now() - 86400000 * 9
  },
  {
    id: 20, user: 'Future_Mom', title: 'Ovulation induction worked!',
    text: 'Just finished my first round of Letrozole and the ultrasound showed a mature follicle! The doctor is very optimistic about our chances to conceive this cycle. Fingers crossed!',
    likes: 490, liked: false, shares: 18, category: 'Success Story',
    comments: [], timestamp: Date.now() - 86400000 * 11
  }
];

const CATEGORIES = ['All', 'Transformation', 'Success Story', 'Support'];
const GROUPS = [
  { id: 'pcos-warriors', name: 'PCOS Warriors', members: '1.2k', topic: 'General Support', color: 'text-blue-400' },
  { id: 'low-gi-chefs', name: 'Low-GI Chefs', members: '850+', topic: 'Diet & Recipes', color: 'text-pink-400' },
  { id: 'zen-zone', name: 'Zen Zone', members: '420', topic: 'Stress & Mindset', color: 'text-purple-400' },
  { id: 'fertility-hope', name: 'Fertility Hope', members: '630', topic: 'Conception', color: 'text-cyan-400' },
];

const TAG_COLORS = {
  'Transformation': 'bg-purple-500/20 border-purple-400/40 text-purple-300',
  'Success Story': 'bg-green-500/20 border-green-400/40 text-green-300',
  'Support': 'bg-pink-500/20 border-pink-400/40 text-pink-300',
};

function timeAgo(ts) {
  const d = Math.floor((Date.now() - ts) / 1000);
  if (d < 60) return 'just now';
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}

// ---------------------------------------------
// POST CARD COMPONENT
// ---------------------------------------------
const PostCard = ({ story, handleLike, handleShare, handleComment }) => {
  const navigate = useNavigate();
  const [expandedComments, setExpandedComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  const submitComment = () => {
    if (commentInput.trim()) {
      handleComment(story.id, commentInput);
      setCommentInput('');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      onClick={() => navigate(`/post/${story.id}`)}
      className="p-8 rounded-3xl bg-secondary border border-accent/10 backdrop-blur-xl hover:border-accent/20 transition-all group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/5 border border-accent/10 flex items-center justify-center text-lg font-black text-primary group-hover:rotate-12 transition-transform duration-500">
            {story.user.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-primary">{story.user}</p>
            <p className="text-[10px] text-text-tertiary uppercase tracking-widest">{timeAgo(story.timestamp)}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${TAG_COLORS[story.category] || 'bg-accent/5 border-accent/10 text-text-secondary'}`}>
          {story.category}
        </span>
      </div>

      {story.title && <h4 className="text-primary font-black text-lg mb-3">{story.title}</h4>}

      <p className="text-secondary leading-relaxed italic mb-6 pl-4 border-l-2 border-accent/10">
        "{story.text}"
      </p>

      {/* Actions (Stops propagation so card click doesn't trigger) */}
      <div className="flex items-center justify-between pt-4 border-t border-accent/5" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-6">
          <button onClick={() => handleLike(story.id)} className="flex items-center gap-2 group/btn">
            <Heart size={18} className={`transition-all ${story.liked ? 'text-pink-400 fill-pink-400 scale-110' : 'text-text-tertiary group-hover/btn:text-pink-400'}`} />
            <span className={`text-sm font-bold transition-colors ${story.liked ? 'text-pink-400' : 'text-text-secondary group-hover/btn:text-primary'}`}>{story.likes}</span>
          </button>

          <button onClick={() => setExpandedComments(!expandedComments)} className="flex items-center gap-2 group/btn">
            <MessageCircle size={18} className="text-text-tertiary group-hover/btn:text-cyan-400 transition-all" />
            <span className="text-sm font-bold text-text-secondary group-hover/btn:text-primary transition-colors">{story.comments.length}</span>
            {expandedComments ? <ChevronUp size={14} className="text-text-tertiary" /> : <ChevronDown size={14} className="text-text-tertiary" />}
          </button>

          <button onClick={() => handleShare(story)} className="flex items-center gap-2 group/btn">
            <Share2 size={18} className="text-text-tertiary group-hover/btn:text-blue-400 transition-all" />
            <span className="text-sm font-bold text-text-secondary group-hover/btn:text-primary transition-colors">{story.shares}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expandedComments && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="mt-6 space-y-3 overflow-hidden" onClick={e => e.stopPropagation()}>
            {story.comments.map(c => (
              <div key={c.id} className="flex gap-3 p-3 rounded-xl bg-accent/5">
                <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center text-xs font-black text-text-secondary">💬</div>
                <div>
                  <p className="text-sm text-secondary">{c.text}</p>
                  <p className="text-[10px] text-text-tertiary mt-1">{timeAgo(c.timestamp)}</p>
                </div>
              </div>
            ))}
            <div className="flex gap-3 mt-3">
              <input
                value={commentInput} onChange={e => setCommentInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submitComment()}
                placeholder="Write a comment..."
                className="flex-1 px-4 py-2 rounded-xl bg-accent/5 border border-accent/10 text-primary placeholder-text-tertiary text-sm focus:outline-none focus:border-pink-400/40 transition-all"
              />
              <button onClick={submitComment} className="p-2 rounded-xl bg-pink-500/20 border border-pink-400/30 text-pink-400 hover:bg-pink-500/30 transition-all">
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ---------------------------------------------
// COMMUNITY HOME PAGE
// ---------------------------------------------
const CommunityHome = ({ posts, setPosts, setActiveTab, handleLike, handleShare, handleComment }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', title: '', story: '', tag: 'Transformation' });
  const [formError, setFormError] = useState('');

  const handleSubmit = () => {
    if (!form.name.trim() || !form.story.trim()) {
      setFormError('Name and Story are required.'); return;
    }
    const newPost = {
      id: Date.now(), user: form.name.trim(),
      title: form.title.trim() || 'My PCOS Journey',
      text: form.story.trim(), likes: 0, liked: false,
      shares: 0, category: form.tag,
      comments: [], timestamp: Date.now()
    };
    setPosts(prev => [newPost, ...prev]);
    setForm({ name: '', title: '', story: '', tag: 'Transformation' });
    setFormError('');
    setShowModal(false);
  };

  const filtered = posts
    .filter(p => activeFilter === 'All' || p.category === activeFilter)
    .filter(p => !search || p.text.toLowerCase().includes(search.toLowerCase()) || p.user.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'recent' ? b.timestamp - a.timestamp : b.likes - a.likes);

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-6">
      {/* Back Button */}
      <button onClick={() => { navigate('/'); setActiveTab('home'); }}
        className="mb-8 flex items-center gap-2 text-text-secondary hover:text-primary transition-colors group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Back to Overview</span>
      </button>

      {/* Header */}
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-3 p-3 rounded-2xl bg-secondary border border-accent/10 mb-6">
          <Users size={30} className="text-blue-400" />
          <h2 className="text-3xl font-black text-primary tracking-tighter">Luna Circle</h2>
        </div>
        <p className="text-secondary text-lg">Connecting thousands of warriors across the globe. You are never alone.</p>
      </div>

      {/* Search & Categories */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search stories..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-secondary border border-accent/10 text-primary placeholder-text-tertiary focus:outline-none focus:border-pink-400/50 transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${activeFilter === cat ? 'bg-pink-500/30 border-pink-400/50 text-pink-300' : 'bg-secondary border-accent/10 text-text-secondary hover:bg-accent/5 hover:text-primary'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Active Circles Navigation */}
          <div className="p-8 rounded-3xl bg-secondary border border-accent/10 backdrop-blur-xl">
            <h3 className="text-xl font-black text-primary mb-6 uppercase tracking-widest flex items-center gap-3">
              <Shield size={20} className="text-blue-400" /> Active Circles
            </h3>
            <div className="space-y-3">
              {GROUPS.map((g) => (
                <motion.button key={g.id} whileHover={{ x: 5 }} onClick={() => navigate(`/circle/${g.id}`)}
                  className="w-full group p-4 rounded-2xl border border-accent/5 bg-accent/5 flex items-center justify-between hover:bg-accent/10 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary rounded-xl border border-accent/5">
                      <Users size={18} className={g.color} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-primary">{g.name}</p>
                      <p className="text-[10px] text-text-tertiary uppercase tracking-widest">{g.topic} • {g.members}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-text-tertiary group-hover:text-primary transition-colors" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Share Hope CTA */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-white/5 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles size={22} className="text-pink-400" />
              <h3 className="text-xl font-black text-white uppercase tracking-widest">Share Hope</h3>
            </div>
            <p className="text-xs text-white/60 leading-relaxed mb-6">
              Your story can be the light for someone else. Share your milestones with the community.
            </p>
            <button onClick={() => setShowModal(true)}
              className="w-full py-4 bg-pink-500 text-white font-black rounded-2xl hover:bg-pink-400 transition-all transform hover:-translate-y-1 shadow-[0_15px_30px_rgba(236,72,153,0.3)]">
              ✨ Post My Story
            </button>
          </div>

          {/* Dynamic Sorting (Recent / Popular) */}
          <div className="p-6 rounded-3xl bg-secondary border border-accent/10">
            <p className="text-xs font-black uppercase tracking-widest text-text-tertiary mb-3 flex items-center gap-2"><Filter size={14} /> Sort Posts</p>
            <div className="flex gap-2">
              {['recent', 'popular'].map(s => (
                <button key={s} onClick={() => setSortBy(s)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${sortBy === s ? 'bg-accent/10 border-accent/20 text-primary' : 'bg-accent/5 border-accent/5 text-text-secondary hover:text-primary'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-lg font-black text-primary uppercase tracking-widest flex items-center gap-3">
              <MessageSquare size={20} className="text-cyan-400" /> Community Stories
            </h3>
            <span className="text-xs text-text-secondary font-bold">{filtered.length} posts</span>
          </div>

          <AnimatePresence>
            {filtered.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-white/30 font-bold">
                No stories found. Be the first to share! ✨
              </motion.div>
            )}

            {filtered.map((story, idx) => (
              <PostCard key={story.id} story={story} handleLike={handleLike} handleShare={handleShare} handleComment={handleComment} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Post Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-lg p-8 rounded-3xl border border-white/10 bg-dark/95 shadow-2xl"
              onClick={e => e.stopPropagation()}>
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3"><Sparkles size={22} className="text-pink-400" /><h3 className="text-xl font-black text-white">Share Your Story</h3></div>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"><X size={18} /></button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-text-tertiary mb-2 block">Your Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Ananya" className="w-full px-4 py-3 rounded-2xl bg-secondary border border-accent/10 text-primary focus:border-pink-400/50 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-text-tertiary mb-2 block">Title (Optional)</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. My journey to healing" className="w-full px-4 py-3 rounded-2xl bg-secondary border border-accent/10 text-primary focus:border-pink-400/50 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-text-tertiary mb-2 block">Your Story *</label>
                  <textarea value={form.story} onChange={e => setForm(f => ({ ...f, story: e.target.value }))} rows={5} placeholder="Share your experience..." className="w-full px-4 py-3 rounded-2xl bg-secondary border border-accent/10 text-primary focus:border-pink-400/50 outline-none resize-none" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-text-tertiary mb-2 block">Tag</label>
                  <div className="flex gap-3 flex-wrap">
                    {['Transformation', 'Success Story', 'Support'].map(tag => (
                      <button key={tag} onClick={() => setForm(f => ({ ...f, tag }))}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${form.tag === tag ? 'bg-pink-500/30 border-pink-400/50 text-pink-300' : 'bg-secondary border-accent/10 text-text-secondary hover:bg-accent/5 hover:text-primary'}`}>{tag}</button>
                    ))}
                  </div>
                </div>
                {formError && <p className="text-red-400 text-sm font-bold">{formError}</p>}
                <button onClick={handleSubmit} className="w-full py-4 bg-pink-500 text-white font-black rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-3 mt-2"><Send size={18} /> Post My Story</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---------------------------------------------
// SINGLE POST PAGE
// ---------------------------------------------
const PostPage = ({ posts, handleLike, handleShare, handleComment }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = posts.find(p => p.id.toString() === id);

  if (!post) {
    return (
      <div className="w-full max-w-4xl mx-auto py-20 px-6 text-center">
        <h2 className="text-2xl font-black text-white mb-4">Post Not Found</h2>
        <button onClick={() => navigate('/community')} className="text-pink-400 hover:underline">Return to Community</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-6">
      <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-text-tertiary hover:text-primary transition-colors group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Back</span>
      </button>
      <PostCard story={post} handleLike={handleLike} handleShare={handleShare} handleComment={handleComment} />
    </div>
  );
};

// ---------------------------------------------
// CIRCLE PAGE
// ---------------------------------------------
const CirclePage = ({ posts, handleLike, handleShare, handleComment }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const circle = GROUPS.find(g => g.id === id);
  // Filter posts related to the circle topic
  const circlePosts = posts.filter(p => {
    if (!circle) return false;
    const txt = p.text.toLowerCase() + " " + p.title.toLowerCase();
    
    if (circle.id === 'pcos-warriors') return true; // Show all in general support
    if (circle.id === 'low-gi-chefs') return txt.includes('diet') || txt.includes('eat') || txt.includes('recipe') || txt.includes('food') || txt.includes('meal') || txt.includes('pizza') || txt.includes('snack');
    if (circle.id === 'zen-zone') return txt.includes('stress') || txt.includes('meditat') || txt.includes('yoga') || txt.includes('sleep') || txt.includes('overwhelmed') || txt.includes('mental') || txt.includes('anxiety') || txt.includes('breathing');
    if (circle.id === 'fertility-hope') return txt.includes('conceiv') || txt.includes('pregnan') || txt.includes('baby') || txt.includes('ttc') || txt.includes('ovulat') || p.category === 'Success Story';
    return true;
  });

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-6">
      <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-text-tertiary hover:text-primary transition-colors group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Back to Circles</span>
      </button>

      {circle ? (
        <div className="mb-12 p-8 rounded-3xl bg-secondary border border-accent/10 flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center">
            <Users size={32} className={circle.color} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-primary tracking-tighter mb-2">{circle.name}</h2>
            <p className="text-secondary opacity-50">{circle.topic} • {circle.members} Active Members</p>
          </div>
        </div>
      ) : (
        <div className="text-primary text-xl mb-12">Circle not found</div>
      )}

      <div className="space-y-6">
        {circlePosts.length === 0 ? (
          <div className="text-center py-20 text-white/30 font-bold">No active discussions in this circle yet.</div>
        ) : (
          circlePosts.map(story => (
            <PostCard key={story.id} story={story} handleLike={handleLike} handleShare={handleShare} handleComment={handleComment} />
          ))
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------
// MAIN COMMUNITY ROUTER
// ---------------------------------------------
export default function Community({ setActiveTab }) {
  const [posts, setPosts] = useState(() => {
    try { 
      const saved = localStorage.getItem(STORAGE_KEY); 
      const parsed = saved ? JSON.parse(saved) : null;
      // Force update if the user has an old cached version with fewer posts
      if (parsed && parsed.length < defaultPosts.length) {
        return defaultPosts;
      }
      return parsed || defaultPosts; 
    } 
    catch { return defaultPosts; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(posts)); } catch {}
  }, [posts]);

  const handleLike = (id) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const handleShare = async (post) => {
    const text = `"${post.text}" — ${post.user} on Luna Community`;
    if (navigator.share) { try { await navigator.share({ title: post.title, text }); return; } catch {} }
    try {
      await navigator.clipboard.writeText(text);
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, shares: p.shares + 1 } : p));
      alert('📋 Copied to clipboard!');
    } catch { alert('Could not copy.'); }
  };

  const handleComment = (id, text) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, comments: [...p.comments, { id: Date.now(), text, timestamp: Date.now() }] } : p));
  };

  return (
    <Routes>
      <Route path="/" element={<CommunityHome posts={posts} setPosts={setPosts} setActiveTab={setActiveTab} handleLike={handleLike} handleShare={handleShare} handleComment={handleComment} />} />
      <Route path="/community" element={<CommunityHome posts={posts} setPosts={setPosts} setActiveTab={setActiveTab} handleLike={handleLike} handleShare={handleShare} handleComment={handleComment} />} />
      <Route path="/post/:id" element={<PostPage posts={posts} handleLike={handleLike} handleShare={handleShare} handleComment={handleComment} />} />
      <Route path="/circle/:id" element={<CirclePage posts={posts} handleLike={handleLike} handleShare={handleShare} handleComment={handleComment} />} />
      <Route path="*" element={<CommunityHome posts={posts} setPosts={setPosts} setActiveTab={setActiveTab} handleLike={handleLike} handleShare={handleShare} handleComment={handleComment} />} />
    </Routes>
  );
}