import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Search, RefreshCw, ExternalLink, Clock,
  Heart, ArrowLeft, ArrowRight, TrendingUp, Bookmark,
  User, Calendar, Zap, Bell, CheckCircle, X, Share2,
  Eye, SortAsc, Flame, Star
} from 'lucide-react';

const ARTICLE_CONTENT = {
  'Managing PCOS With Diet: What to Eat and Avoid': `Diet is a cornerstone of managing Polycystic Ovary Syndrome (PCOS). Because PCOS is often linked to insulin resistance, the foods you choose can directly impact your hormone levels and symptom severity.\n\n🥦 WHAT TO EAT:\n• High-Fiber Foods: Beans, lentils, and cruciferous vegetables slow down digestion and reduce the impact of sugar on the blood.\n• Lean Proteins: Chicken, fish, and tofu help keep you full and stabilize blood sugar.\n• Anti-inflammatory Foods: Berries, fatty fish, and olive oil help reduce the low-grade inflammation often seen in PCOS.\n\n🚫 WHAT TO LIMIT:\n• Refined Carbohydrates: White bread, muffins, and sugary pastries can cause insulin spikes.\n• Sugary Snacks and Drinks: Soda, energy drinks, and excessive sweets worsen insulin resistance.\n• Processed Meats: These can contribute to inflammation.\n\nEating smaller, frequent meals and pairing carbohydrates with protein can further help in maintaining steady energy and hormone levels throughout the day.`,
  'The Ultimate PCOS Diet Guide: Foods to Eat and Avoid': `Managing PCOS through diet is one of the most powerful interventions available. A low-glycaemic diet helps stabilise insulin levels, which directly influences androgen production.\n\n🥦 Foods to INCLUDE:\n• Leafy greens (spinach, kale, broccoli)\n• Berries — low sugar, high antioxidants\n• Fatty fish (salmon, sardines) — omega-3 rich\n• Legumes — fibre and protein balance\n• Spearmint tea — shown to reduce free testosterone\n\n🚫 Foods to AVOID:\n• Refined carbohydrates and white bread\n• Sugary drinks and fruit juices\n• Processed snacks and fast food\n• Dairy in high quantities (can raise IGF-1)\n\nConsistency is key. Aim for 3 balanced meals with 15–30g of protein each, and keep snacks to low-GI options like nuts and hummus.`,
  'Strength Training vs Cardio: Which is Better for PCOS?': `Both exercise modalities benefit PCOS, but the science increasingly favours resistance training as the primary intervention.\n\n💪 Why Strength Training Wins:\n• Builds lean muscle → improves insulin sensitivity\n• Lower cortisol spike vs high-intensity cardio\n• Increases resting metabolic rate\n• Improves testosterone-to-oestrogen ratio\n\n🏃 Where Cardio Still Helps:\n• Improves cardiovascular health\n• Reduces stress hormones short-term\n• Low-impact options (swimming, cycling) are excellent\n\n✅ Recommended Protocol:\nWeek 1–4: 3x strength sessions + 2x 30-min walks\nWeek 5+: Add HIIT once a week, max 20 minutes\n\nAvoid chronic high-intensity cardio — it can elevate cortisol and worsen hormonal imbalance.`,
  'New Research on PCOD and Insulin Resistance': `A landmark 2025 meta-analysis reviewed 42 clinical trials involving 8,000+ women and found that insulin resistance is present in up to 70% of PCOS cases, regardless of body weight.\n\n🔬 Key Findings:\n• Insulin resistance drives excess androgen production via ovarian stimulation\n• Metformin + lifestyle changes outperform either alone\n• Inositol (Myo-inositol 4:1 D-chiro ratio) showed 62% improvement in menstrual regularity\n\n📊 Biomarkers to Monitor:\n• Fasting insulin (target < 10 µIU/mL)\n• HOMA-IR score (target < 1.5)\n• HbA1c (target < 5.7%)\n\nTalk to your endocrinologist about testing these if you haven't already. Early intervention significantly improves long-term outcomes.`,
};

const TOP_PICKS_ARTICLES = [
  { title: 'Inositol: The PCOS Supplement You Need', category: 'Medical', readTime: '6 min', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80' },
  { title: '7-Day Anti-Inflammatory Meal Plan', category: 'Diet', readTime: '5 min', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80' },
  { title: 'How Sleep Affects Your Hormones', category: 'Wellness', readTime: '4 min', image: 'https://images.unsplash.com/photo-1541480601022-2308c0f02487?auto=format&fit=crop&w=800&q=80' },
  { title: 'PCOS and Fertility: What to Know', category: 'Medical', readTime: '8 min', image: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=800&q=80' },
  { title: 'Managing Hair Loss with PCOS', category: 'Lifestyle', readTime: '5 min', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80' },
];

const CATEGORY_COLORS = {
  Diet:      { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  Exercise:  { text: 'text-neon-purple', bg: 'bg-neon-purple/10', border: 'border-neon-purple/20' },
  Medical:   { text: 'text-neon-blue',   bg: 'bg-neon-blue/10',   border: 'border-neon-blue/20' },
  Lifestyle: { text: 'text-accent',      bg: 'bg-accent/10',      border: 'border-accent/20' },
  Research:  { text: 'text-neon-pink',   bg: 'bg-neon-pink/10',   border: 'border-neon-pink/20' },
  Wellness:  { text: 'text-yellow-400',  bg: 'bg-yellow-400/10',  border: 'border-yellow-400/20' },
};

const HEALTH_IMAGES = [
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1532187875605-7fe3b23b9952?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1541480601022-2308c0f02487?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1494390248081-4e521a5940db?auto=format&fit=crop&w=800&q=80',
];

const FALLBACK_POSTS = [
  {
    title: 'Managing PCOS With Diet: What to Eat and Avoid',
    author: 'Mass General Brigham', date: 'Apr 19, 2026', category: 'Diet',
    image: 'C:\\Users\\RENU\\.gemini\\antigravity\\brain\\ad7920a4-698d-4123-aefa-7d5d202174b6\\pcos_diet_cover_blog_1776620441781.png',
    readTime: '12 min', link: 'https://www.massgeneralbrigham.org/en/about/newsroom/articles/managing-pcos-with-diet',
    description: 'Expert nutritionists from Mass General Brigham break down the essential dietary shifts needed to manage PCOS symptoms effectively, focusing on blood sugar stabilization.',
    featured: true, likes: 450,
  },
  {
    title: 'The Ultimate PCOS Diet Guide: Foods to Eat and Avoid',
    author: 'Dr. Sarah Mitchell', date: 'Apr 15, 2026', category: 'Diet',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
    readTime: '8 min', link: 'https://www.healthline.com/health/pcos-diet',
    description: 'Learn how to manage your PCOS symptoms with a balanced, insulin-sensitising diet. Focus on low-GI foods, healthy fats, and anti-inflammatory herbs to restore hormonal balance.',
    likes: 214,
  },
  {
    title: 'Strength Training vs Cardio: Which is Better for PCOS?',
    author: 'Coach Elena Vasquez', date: 'Apr 12, 2026', category: 'Exercise',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    readTime: '6 min', link: 'https://www.verywellhealth.com/pcos-and-exercise-4154101',
    description: 'Lifting weights might be the secret weapon for managing hormonal imbalance. Discover evidence-based protocols tailored specifically for women with PCOS.',
    likes: 178,
  },
  {
    title: 'New Research on PCOD and Insulin Resistance',
    author: 'Harvard Health', date: 'Apr 10, 2026', category: 'Research',
    image: 'https://images.unsplash.com/photo-1532187875605-7fe3b23b9952?auto=format&fit=crop&w=800&q=80',
    readTime: '10 min', link: 'https://www.medicalnewstoday.com/articles/pcos-insulin-resistance',
    description: 'Recent clinical studies shed light on the molecular mechanisms linking PCOD to insulin resistance, opening new therapeutic pathways.',
    likes: 302,
  },
  {
    title: 'Spearmint Tea and Androgen Reduction: What the Science Says',
    author: 'Dr. Priya Nair', date: 'Apr 8, 2026', category: 'Medical',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
    readTime: '5 min', link: 'https://www.healthline.com/nutrition/spearmint-tea',
    description: 'Two cups of spearmint tea daily showed a statistically significant reduction in free testosterone. Here is a deep-dive into the clinical evidence.',
    likes: 156,
  },
  {
    title: 'Managing PCOS-Related Anxiety with Mindfulness',
    author: 'Dr. Ananya Bose', date: 'Apr 5, 2026', category: 'Wellness',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    readTime: '7 min', link: 'https://www.nhs.uk/conditions/polycystic-ovary-syndrome-pcos/',
    description: 'Chronic stress elevates cortisol, which directly worsens PCOS. Mindfulness-based techniques can reduce symptom severity within 8 weeks.',
    likes: 189,
  },
  {
    title: 'Seed Cycling: Myth or Hormone Hack?',
    author: 'Nutritionist Kavya', date: 'Apr 3, 2026', category: 'Lifestyle',
    image: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=800&q=80',
    readTime: '6 min', link: 'https://www.verywellhealth.com/seed-cycling-for-hormones-5092513',
    description: 'Seed cycling has gained popularity in PCOS communities. We break down the nutritional science and whether it truly supports hormonal balance.',
    likes: 143,
  },
];

const TRENDING_TAGS = ['#LowGI', '#InsulinResistance', '#PCOSWarrior', '#HormonalBalance', '#MindfulEating', '#CycleTracking', '#AntiInflammatory'];

const Blogs = ({ setActiveTab }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [likedPosts, setLikedPosts] = useState({});
  const [savedPosts, setSavedPosts] = useState({});
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const categories = ['All', 'Diet', 'Exercise', 'Medical', 'Lifestyle', 'Research', 'Wellness'];

  const TOPIC_IMAGE_BANKS = {
    diet: [
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1494390248081-4e521a5940db?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1498837167922-41c53bbf7124?auto=format&fit=crop&w=800&q=80'
    ],
    exercise: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'
    ],
    medical: [
      'https://images.unsplash.com/photo-1532187875605-7fe3b23b9952?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=800&q=80'
    ],
    wellness: [
      'https://images.unsplash.com/photo-1541480601022-2308c0f02487?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511293710115-460d3d5f3d35?auto=format&fit=crop&w=800&q=80'
    ]
  };

  const getImageForTopic = (title, category, idx) => {
    const t = (title + ' ' + category).toLowerCase();
    
    if (t.includes('liver') || t.includes('fatty') || t.includes('disease')) {
      return 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80';
    }
    if (t.includes('tech') || t.includes('app') || t.includes('digital') || t.includes('kashmiri') || t.includes('pain')) {
      return 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=80';
    }
    if (t.includes('diet') || t.includes('food') || t.includes('eat') || t.includes('nutrition') || t.includes('meal')) {
      return TOPIC_IMAGE_BANKS.diet[idx % TOPIC_IMAGE_BANKS.diet.length];
    }
    if (t.includes('exercise') || t.includes('workout') || t.includes('fitness') || t.includes('cardio') || t.includes('strength') || t.includes('training')) {
      return TOPIC_IMAGE_BANKS.exercise[idx % TOPIC_IMAGE_BANKS.exercise.length];
    }
    if (t.includes('medical') || t.includes('insulin') || t.includes('doctor') || t.includes('research') || t.includes('science') || t.includes('supplement') || t.includes('vitamin') || t.includes('pill')) {
      return TOPIC_IMAGE_BANKS.medical[idx % TOPIC_IMAGE_BANKS.medical.length];
    }
    if (t.includes('sleep') || t.includes('mind') || t.includes('stress') || t.includes('anxiety') || t.includes('hair') || t.includes('lifestyle') || t.includes('wellness')) {
      return TOPIC_IMAGE_BANKS.wellness[idx % TOPIC_IMAGE_BANKS.wellness.length];
    }
    
    return HEALTH_IMAGES[idx % HEALTH_IMAGES.length];
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const rssUrl = 'https://news.google.com/rss/search?q=PCOS+PCOD+diet+exercise+health&hl=en-IN&gl=IN&ceid=IN:en';
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.status === 'ok') {
        const cats = ['Diet','Exercise','Medical','Lifestyle','Research','Wellness'];
        const fetchedPosts = data.items.map((item, idx) => {
          const category = cats[idx % cats.length];
          return {
            title: item.title,
            author: item.author || 'Health Expert',
            date: new Date(item.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            category: category,
            image: item.thumbnail || getImageForTopic(item.title, category, idx),
            readTime: `${4 + (idx % 7)} min`,
            link: item.link,
            description: item.description?.replace(/<[^>]*>?/gm, '').substring(0, 180) + '...',
            likes: 80 + idx * 17,
          };
        });

        const mainArticle = {
          title: 'Managing PCOS With Diet: What to Eat and What to Avoid - Mass General Brigham',
          author: 'Mass General Brigham', 
          date: 'Apr 19, 2026', 
          category: 'Diet',
          image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1600&q=80',
          readTime: '12 min', 
          link: 'https://www.massgeneralbrigham.org/en/about/newsroom/articles/managing-pcos-with-diet',
          description: 'A comprehensive guide from Mass General Brigham experts on using nutrition as a primary tool for managing PCOS symptoms, focusing on insulin regulation and anti-inflammatory foods.',
          featured: true, 
          likes: 450,
          id: 'featured-pcos-diet'
        };
        
        setPosts([mainArticle, ...fetchedPosts]);
      } else throw new Error();
    } catch {
      setPosts(FALLBACK_POSTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const filteredPosts = posts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    return matchSearch && matchCat;
  }).sort((a, b) => sortBy === 'popular' ? (b.likes || 0) - (a.likes || 0) : 0);

  const featuredPost = filteredPosts.find(p => p.featured) || filteredPosts[0];
  const gridPosts = filteredPosts.filter(p => p !== featuredPost);
  const visibleGridPosts = gridPosts.slice(0, visibleCount);

  const toggleLike = (idx) => setLikedPosts(prev => ({ ...prev, [idx]: !prev[idx] }));
  const toggleSave = (idx) => setSavedPosts(prev => ({ ...prev, [idx]: !prev[idx] }));
  const openReader = (post) => setSelectedArticle(post);
  const closeReader = () => setSelectedArticle(null);
  const handleShare = (post) => {
    if (navigator.share) navigator.share({ title: post.title, url: post.link });
    else navigator.clipboard?.writeText(post.link);
  };

  const col = (cat) => CATEGORY_COLORS[cat] || CATEGORY_COLORS['Medical'];

  return (
    <div className="w-full pb-32">
      {/* ── DIGITAL MAGAZINE COVER (ENHANCED SPLASH) ── */}
      {!loading && !searchQuery && activeCategory === 'All' && posts[0] && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="relative w-full h-[75vh] min-h-[550px] overflow-hidden bg-slate-950 mb-16 group"
        >
          {/* Parallax Background */}
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
            src={posts[0].image} 
            alt="Cover" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

          {/* Floating Glow Elements */}
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-neon-blue/10 rounded-full blur-[100px] animate-pulse" />

          {/* Cover Content Overlay */}
          <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col justify-center">
            <motion.div 
              initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-4 mb-8">
                 <div className="px-5 py-2 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl border border-rose-400/20">
                   Featured Intelligence
                 </div>
                 <div className="flex items-center gap-2 text-rose-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" /> Global Exclusive
                 </div>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] mb-8 tracking-tighter">
                Managing <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-300 to-rose-500">PCOS</span> With Diet
              </h1>

              <div className="flex flex-col md:flex-row md:items-center gap-10 mb-12">
                <p className="text-xl md:text-2xl text-gray-300 font-medium leading-relaxed max-w-2xl border-l-4 border-rose-500 pl-8 py-2">
                  {posts[0].description}
                </p>
                
                {/* Floating Expert Card */}
                <motion.div 
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="shrink-0 flex items-center gap-6 bg-white/5 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl"
                >
                   <div className="w-20 h-20 rounded-full bg-rose-500 flex items-center justify-center font-black text-white text-3xl shadow-2xl shadow-rose-500/40">M</div>
                   <div>
                      <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Expert Author</p>
                      <p className="text-white font-black text-xl">Mass General Brigham</p>
                   </div>
                </motion.div>
              </div>

              <div className="flex flex-wrap items-center gap-8">
                <button 
                  onClick={() => openReader(posts[0])}
                  className="px-14 py-6 bg-white text-slate-950 font-black uppercase tracking-widest rounded-2xl hover:bg-rose-500 hover:text-white transition-all duration-500 shadow-[0_20px_50px_rgba(255,255,255,0.2)] text-xs flex items-center gap-3"
                >
                  Start Reading Full Guide <ArrowRight size={18} />
                </button>
                <div className="flex items-center gap-8 text-gray-400 text-xs font-bold uppercase tracking-widest">
                   <span className="flex items-center gap-3"><Clock size={20} className="text-rose-400" /> 12 Min Read</span>
                   <span className="flex items-center gap-3"><Calendar size={20} className="text-rose-400" /> Clinical Issue 01</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Ticker */}
          <div className="absolute bottom-0 left-0 w-full py-4 bg-rose-500/10 backdrop-blur-md border-t border-rose-500/20">
             <div className="max-w-7xl mx-auto px-12 flex items-center gap-8 overflow-hidden">
                <span className="shrink-0 text-[10px] font-black text-rose-400 uppercase tracking-widest">Trending Topics</span>
                <div className="flex gap-12 animate-marquee whitespace-nowrap">
                   {['Insulin Resistance', 'Anti-Inflammatory Diet', 'Hormonal Balance', 'Success Stories', 'Expert Clinical Advice'].map(t => (
                      <span key={t} className="text-white font-bold text-[10px] uppercase tracking-widest flex items-center gap-3">
                         <div className="w-1 h-1 rounded-full bg-rose-400" /> {t}
                      </span>
                   ))}
                </div>
             </div>
          </div>
        </motion.div>
      )}

      <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* ── TOP NAVIGATION ── */}
        <button onClick={() => setActiveTab('home')} className="mb-8 flex items-center gap-2 text-text-secondary hover:text-primary transition-colors group w-fit">
        <div className="p-2 rounded-lg bg-accent/5 border border-accent/10 group-hover:bg-accent/10 transition-colors">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        </div>
        <span className="text-sm font-semibold">Back to Dashboard</span>
      </button>

      {/* ── REFINED NEWSROOM HERO ── */}
      <div className="relative mb-20 pt-4">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-neon-blue/10 rounded-full blur-[140px] opacity-60 pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-12 relative z-10">
          <div className="space-y-6 max-w-4xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-accent/5 border border-accent/10 text-neon-blue text-[11px] font-black uppercase tracking-[0.2em]">
              <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse shadow-[0_0_10px_rgba(56,189,248,0.8)]" /> Live Global Intelligence
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-primary tracking-tighter leading-[0.9]">
              Health <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink">Insights Hub</span>
            </h1>
            <p className="text-secondary text-lg md:text-xl leading-relaxed max-w-2xl font-medium opacity-80">
              Clinical research, metabolic health strategies, and verified success stories curated by our medical board.
            </p>
          </div>
          
          <button onClick={fetchBlogs} className="shrink-0 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-secondary border border-accent/10 text-primary hover:border-neon-blue/30 hover:text-neon-blue transition-all text-xs font-black uppercase tracking-widest shadow-xl group">
            <RefreshCw size={18} className={`${loading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-700`} /> Refresh Intel
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 relative z-10 items-center">
          <div className="relative flex-1 group w-full">
            <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-neon-blue transition-all duration-300" />
            <input
              type="text" placeholder="Search clinical research and hormonal strategies..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-secondary border border-accent/10 rounded-3xl pl-16 pr-6 py-6 text-primary placeholder-text-tertiary focus:outline-none focus:ring-4 focus:ring-neon-blue/10 focus:border-neon-blue/30 transition-all text-lg font-medium shadow-2xl"
            />
          </div>
          <div className="flex flex-wrap gap-3 items-center bg-secondary/50 backdrop-blur-xl border border-accent/5 rounded-[2rem] p-3 shrink-0 w-full lg:w-auto justify-center lg:justify-start">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeCategory === cat 
                  ? 'bg-neon-blue text-slate-900 shadow-[0_10px_30px_rgba(56,189,248,0.4)] scale-105' 
                  : 'text-text-secondary hover:text-primary hover:bg-accent/10'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── TOP PICKS STRIP ── */}
      {!loading && (
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Flame size={20} className="text-neon-pink" />
            <h2 className="text-lg font-bold text-primary tracking-wide">Top Picks This Week</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {TOP_PICKS_ARTICLES.map((a, i) => (
              <div key={i} onClick={() => setSearchQuery(a.title.split(' ').slice(0,3).join(' '))}
                className="relative bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:border-neon-pink/30 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(236,72,153,0.1)] transition-all duration-300 cursor-pointer flex flex-col h-48 sm:h-56 group">
                <img src={a.image} alt={a.title} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="relative z-10 flex flex-col justify-between h-full p-5">
                  <p className="text-sm font-semibold text-white leading-snug group-hover:text-neon-pink transition-colors mb-4 line-clamp-3">{a.title}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${col(a.category).bg} ${col(a.category).text} ${col(a.category).border} backdrop-blur-md`}>
                      {a.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-white opacity-80 font-medium">
                      <Clock size={12}/>{a.readTime}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-3xl bg-white/[0.02] border border-white/5 animate-pulse overflow-hidden">
                <div className="h-52 bg-white/5" />
                <div className="p-6 space-y-4">
                  <div className="w-24 h-4 bg-white/10 rounded" />
                  <div className="w-full h-8 bg-white/10 rounded" />
                  <div className="w-4/5 h-4 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">

            {/* ── SORT CONTROLS ── */}
            <div className="flex items-center justify-between border-b border-accent/5 pb-4">
              <p className="text-sm text-text-secondary font-semibold">{filteredPosts.length} Articles</p>
              <div className="flex items-center gap-1 p-1 bg-secondary border border-accent/5 rounded-xl">
                {[{id:'latest',label:'Latest'},{id:'popular',label:'Popular'}].map(s => (
                  <button key={s.id} onClick={() => setSortBy(s.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${sortBy===s.id ? 'bg-accent/10 text-primary shadow-sm' : 'text-text-tertiary hover:text-primary'}`}>
                    {s.id==='latest' ? <SortAsc size={14}/> : <Star size={14}/>}{s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── FEATURED COVER STORY (ENHANCED) ── */}
            {featuredPost && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                className="group relative bg-secondary border border-accent/5 rounded-[2.5rem] overflow-hidden hover:border-neon-blue/30 hover:shadow-[0_20px_60px_rgba(56,189,248,0.15)] transition-all duration-700 flex flex-col lg:flex-row mb-12">
                
                {/* Left: Compact Image Container with Expert Badge */}
                <div className="relative w-full lg:w-[50%] h-80 lg:h-[450px] overflow-hidden shrink-0">
                  <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary/60 via-transparent to-transparent hidden lg:block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent lg:hidden" />
                  
                  {/* Expert Cover Badge */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <div className="bg-black/40 backdrop-blur-md p-8 rounded-[3rem] border border-white/10 flex flex-col items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-90 group-hover:scale-100 transition-transform">
                        <div className="w-20 h-20 rounded-full bg-rose-500 flex items-center justify-center font-black text-white text-3xl shadow-2xl">M</div>
                        <div className="text-center">
                           <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.3em] mb-1">Expert Author</p>
                           <p className="text-white font-black text-lg">{featuredPost.author}</p>
                        </div>
                     </div>
                  </div>

                  <div className="absolute top-6 left-6 flex gap-2 z-10">
                    <div className="px-4 py-2 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center gap-2 border border-rose-400/20">
                      <Flame size={14} fill="currentColor" /> FEATURED COVER
                    </div>
                  </div>
                </div>
                
                {/* Right: Enhanced Content Block */}
                <div className="w-full lg:w-[50%] p-8 lg:p-12 flex flex-col justify-center relative bg-secondary">
                  <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold text-text-tertiary mb-6 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Calendar size={16} className="text-neon-blue" />{featuredPost.date}</span>
                    <span className="flex items-center gap-2"><Clock size={16} className="text-neon-purple" />{featuredPost.readTime} read</span>
                    <span className={`px-3 py-1 rounded-full border ${col(featuredPost.category).bg} ${col(featuredPost.category).text} ${col(featuredPost.category).border}`}>
                      {featuredPost.category}
                    </span>
                  </div>

                  <h2 className="text-3xl lg:text-4xl font-black text-primary leading-tight mb-6 group-hover:text-neon-blue transition-colors cursor-pointer tracking-tight" onClick={() => openReader(featuredPost)}>
                    {featuredPost.title}
                  </h2>
                  
                  <p className="text-secondary text-base lg:text-lg leading-relaxed mb-10 line-clamp-3 font-medium opacity-80">
                    {featuredPost.description}
                  </p>

                  <div className="flex items-center justify-between pt-8 border-t border-accent/5 mt-auto">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center font-black text-white shadow-lg">M</div>
                      <div>
                         <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-0.5">Verified Expert</p>
                         <p className="text-primary font-bold">{featuredPost.author}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex gap-2">
                        <button onClick={() => toggleLike('featured')} className={`p-4 rounded-2xl border transition-all ${likedPosts['featured'] ? 'bg-neon-pink/10 border-neon-pink/30 text-neon-pink shadow-[0_0_20px_rgba(236,72,153,0.2)]' : 'bg-accent/5 border border-accent/10 text-text-tertiary hover:bg-accent/10 hover:text-neon-pink'}`}>
                          <Heart size={20} className={likedPosts['featured'] ? 'fill-neon-pink' : ''} />
                        </button>
                      </div>
                      <button onClick={() => openReader(featuredPost)}
                        className="flex items-center gap-3 px-8 py-4 bg-neon-blue text-slate-900 font-black uppercase tracking-widest rounded-2xl hover:bg-white hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-[0_10px_30px_rgba(56,189,248,0.4)] text-[10px]">
                        Read Guide <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── MAIN GRID + SIDEBAR ── */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

              {/* Article Grid */}
              <div className="xl:col-span-9 flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleGridPosts.length === 0 ? (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-20 text-center bg-secondary border border-accent/5 rounded-3xl">
                      <BookOpen size={48} className="text-text-tertiary mb-4" />
                      <p className="text-primary font-semibold text-lg">No articles found</p>
                      <p className="text-text-secondary text-sm mt-2">Try adjusting your search or category filters.</p>
                    </div>
                  ) : visibleGridPosts.map((post, idx) => (
                    <motion.div key={post.id || idx}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                      className="group flex flex-col bg-secondary border border-accent/5 rounded-3xl overflow-hidden hover:border-neon-blue/30 hover:shadow-[0_20px_50px_rgba(56,189,248,0.1)] transition-all duration-500 h-full">
                      
                      {/* [ Cover Image Section ] */}
                      <div className="relative w-full h-56 overflow-hidden shrink-0 cursor-pointer bg-slate-900" onClick={() => openReader(post)}>
                        <img 
                          src={post.image || 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80'} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent opacity-60" />
                        
                        {/* Overlay Metadata */}
                        <div className="absolute top-4 left-4 flex gap-2">
                           <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur-xl border ${col(post.category).bg} ${col(post.category).text} ${col(post.category).border} shadow-lg`}>
                             {post.category}
                           </span>
                        </div>
                        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                           <Clock size={12} className="text-neon-purple" />
                           <span className="text-[10px] font-black text-white uppercase tracking-widest">{post.readTime} read</span>
                        </div>
                      </div>
                      
                      {/* [ Content Section ] */}
                      <div className="flex flex-col flex-1 p-6">
                        <div className="flex items-center gap-4 mb-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
                          <span className="flex items-center gap-1.5"><Calendar size={14} className="text-neon-blue" />{post.date}</span>
                          <span className="flex items-center gap-1.5"><User size={14} className="text-neon-purple" />{post.author}</span>
                        </div>

                        <h3 onClick={() => openReader(post)}
                          className="text-xl font-black text-primary leading-tight mb-4 group-hover:text-neon-blue transition-colors cursor-pointer line-clamp-2">
                          {post.title}
                        </h3>
                        
                        <p className="text-sm text-text-secondary leading-relaxed line-clamp-3 opacity-80 mb-6 flex-1 font-medium">
                          {post.description}
                        </p>
                        
                        {/* [ Actions Section ] */}
                        <div className="pt-6 border-t border-accent/5 flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-4">
                            <button onClick={() => toggleLike(idx)} className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-widest transition-all ${likedPosts[idx] ? 'text-neon-pink' : 'text-text-tertiary hover:text-neon-pink'}`}>
                              <Heart size={18} className={likedPosts[idx] ? 'fill-neon-pink' : ''} />
                              {(post.likes || 100) + (likedPosts[idx] ? 1 : 0)}
                            </button>
                            <button onClick={() => handleShare(post)} className="text-text-tertiary hover:text-primary transition-all p-1 hover:scale-110">
                              <Share2 size={18} />
                            </button>
                          </div>
                          
                          <button onClick={() => openReader(post)} className="flex items-center gap-2 px-5 py-2.5 bg-accent/5 hover:bg-neon-blue hover:text-slate-900 border border-accent/10 hover:border-neon-blue/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300">
                            Read Guide <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Load More */}
                {visibleCount < gridPosts.length && (
                  <div className="flex justify-center mt-4">
                    <button onClick={() => setVisibleCount(v => v + 6)}
                      className="group px-8 py-3.5 rounded-xl bg-secondary border border-accent/10 text-sm font-semibold text-primary hover:bg-accent/5 hover:border-accent/20 transition-all flex items-center gap-2 shadow-lg">
                      Load More Articles <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="xl:col-span-3 space-y-6">

                {/* Trending Tags */}
                <div className="bg-secondary border border-accent/5 rounded-2xl p-6 shadow-lg">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-primary mb-5">
                    <TrendingUp size={16} className="text-neon-blue" /> Trending Topics
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_TAGS.map(tag => (
                      <button key={tag} onClick={() => setSearchQuery(tag.replace('#',''))}
                        className="px-3 py-1.5 rounded-lg bg-accent/5 border border-accent/5 text-xs font-medium text-text-secondary hover:text-primary hover:border-accent/20 hover:bg-accent/10 transition-all">
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-secondary border border-accent/5 rounded-2xl p-6 shadow-lg">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-primary mb-5">
                    <Zap size={16} className="text-accent" /> Hub Stats
                  </h4>
                  <div className="space-y-4">
                  {[
                    { label: 'Articles Published', value: posts.length || 6 },
                    { label: 'Expert Contributors', value: '12+' },
                    { label: 'Readers This Month', value: '8.4k' },
                  ].map(s => (
                    <div key={s.label} className="flex justify-between items-center pb-4 border-b border-accent/5 last:border-0 last:pb-0">
                      <span className="text-sm text-text-tertiary">{s.label}</span>
                      <span className="text-base font-bold text-primary">{s.value}</span>
                    </div>
                  ))}
                  </div>
                </div>

                {/* Saved */}
                {Object.values(savedPosts).some(Boolean) && (
                  <div className="bg-neon-blue/[0.02] border border-neon-blue/20 rounded-2xl p-6 shadow-lg">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-neon-blue mb-2">
                      <Bookmark size={16} /> Saved Articles
                    </h4>
                    <p className="text-sm text-neon-blue/70">
                      {Object.values(savedPosts).filter(Boolean).length} article{Object.values(savedPosts).filter(Boolean).length > 1 ? 's' : ''} bookmarked
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ── NEWSLETTER BANNER ── */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="relative overflow-hidden bg-slate-900 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl mt-8">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 via-neon-purple/5 to-transparent pointer-events-none" />
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-neon-blue/20 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
                <div className="text-center md:text-left max-w-xl">
                  <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-bold uppercase tracking-wider">
                    <Bell size={14} /> Weekly Digest
                  </div>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">Stay Informed, Stay Healthy</h3>
                  <p className="text-white opacity-70 text-base md:text-lg leading-relaxed">Get the latest PCOS research, clinical updates, and lifestyle tips delivered to your inbox every week.</p>
                </div>
                
                <div className="w-full md:w-auto shrink-0">
                {!subscribed ? (
                  <form onSubmit={e => { e.preventDefault(); setSubscribed(true); }} className="flex flex-col sm:flex-row gap-3 w-full">
                    <input
                      type="email" required placeholder="name@example.com"
                      value={email} onChange={e => setEmail(e.target.value)}
                      className="bg-accent/5 border border-accent/10 rounded-xl px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all text-sm min-w-[260px]"
                    />
                    <button type="submit" className="px-6 py-3.5 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(var(--color-accent),0.3)] text-sm flex items-center justify-center gap-2 hover:scale-105">
                      Subscribe <ArrowRight size={16} />
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center gap-3 px-6 py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-sm">
                    <CheckCircle size={20} /> You're subscribed to the digest!
                  </div>
                )}
                </div>
              </div>
            </motion.div>

            {/* Inline Article Reader Modal */}
            <AnimatePresence>
              {selectedArticle && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xl p-4 sm:p-6"
                  onClick={closeReader}>
                  <motion.div initial={{scale:0.95,y:20}} animate={{scale:1,y:0}} exit={{scale:0.95,y:20}}
                    onClick={e=>e.stopPropagation()}
                    className="w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col bg-secondary border border-accent/10 rounded-3xl shadow-2xl relative">
                    
                    {/* Modal Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-accent/10 bg-accent/5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md border ${col(selectedArticle.category).bg} ${col(selectedArticle.category).text} ${col(selectedArticle.category).border}`}>
                        {selectedArticle.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <button onClick={()=>handleShare(selectedArticle)} title="Share" className="p-2 rounded-xl bg-accent/5 border border-accent/10 hover:bg-accent/10 text-text-tertiary hover:text-primary transition-all"><Share2 size={16}/></button>
                        <a href={selectedArticle.link} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-neon-blue/10 border border-neon-blue/30 text-neon-blue hover:bg-neon-blue hover:text-slate-900 transition-all"><ExternalLink size={16}/></a>
                        <button onClick={closeReader} className="p-2 rounded-xl bg-accent/5 border border-accent/10 hover:bg-red-500/20 hover:text-red-400 text-text-tertiary transition-all"><X size={16}/></button>
                      </div>
                    </div>
                    
                    {/* Modal Body */}
                    <div className="overflow-y-auto p-6 md:p-8">
                      <img src={selectedArticle.image || 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528'} alt={selectedArticle.title} className="w-full h-64 md:h-80 object-cover rounded-2xl mb-8 shadow-lg"/>
                      <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 leading-tight">{selectedArticle.title}</h2>
                      
                      <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-text-tertiary mb-8 pb-6 border-b border-accent/10">
                        <span className="flex items-center gap-2"><User size={16}/>{selectedArticle.author}</span>
                        <span className="flex items-center gap-2"><Calendar size={16}/>{selectedArticle.date}</span>
                        <span className="flex items-center gap-2"><Clock size={16}/>{selectedArticle.readTime} read</span>
                        <span className="flex items-center gap-2"><Eye size={16}/>{(selectedArticle.likes||100)*3} views</span>
                      </div>
                      
                      <div className="space-y-4 text-secondary">
                        {(ARTICLE_CONTENT[selectedArticle.title] || selectedArticle.description || '').split('\n').map((line, i) => (
                          <p key={i} className={`text-base leading-relaxed ${
                            line.startsWith('•') ? 'pl-6 text-text-secondary relative before:content-["•"] before:absolute before:left-2 before:text-neon-blue' :
                            line.match(/^[🥦🚫💪🏃✅🔬📊💊🥗😴🌸💇]/) ? 'font-bold text-primary text-lg mt-6 mb-2' :
                            ''
                          }`}>{line || <br/>}</p>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

export default Blogs;
