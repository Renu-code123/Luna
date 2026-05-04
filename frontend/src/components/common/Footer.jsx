import React from 'react';
import { Shield, Heart, Mail, Github, Twitter, Instagram, ChevronRight, Activity, Calendar, Users, MapPin, ExternalLink, Lock, CheckCircle, Send } from 'lucide-react';

const Footer = ({ setActiveTab }) => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || isSubscribed) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      setEmail('');
    }, 1200);
  };

  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { name: 'Risk Assessment', tab: 'assessment' },
        { name: 'Cycle Tracker', tab: 'tracker' },
        { name: 'Health Dashboard', tab: 'dashboard' },
        { name: 'AI Health Insights', tab: 'profile' },
      ]
    },
    {
      title: 'Expert Care',
      links: [
        { name: 'Find Specialists', tab: 'doctors' },
        { name: 'Lifestyle Recommendation', tab: 'lifestyle' },
        { name: 'Diet & Lifestyle', tab: 'diet-plan' },
        { name: 'Stress Management', tab: 'stress-management' },
      ]
    },
    {
      title: 'Knowledge',
      links: [
        { name: 'Research Blog', tab: 'blogs' },
        { name: 'Educational Hub', tab: 'resources' },
        { name: 'Contact Care', tab: 'contact' },
        { name: 'Privacy Protocol', tab: 'home' },
      ]
    }
  ];

  return (
    <footer className="bg-secondary/40 pt-24 pb-12 border-t border-white/5 relative overflow-hidden mt-20">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-blue/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-8">
            <div 
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-3 cursor-pointer group w-fit"
            >
              <div className="w-12 h-12 rounded-2xl p-[1px] group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(188,19,254,0.15)]">
                <Shield className="w-full h-full text-neon-purple p-2" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl font-black tracking-tighter leading-none text-primary">
                  Luna
                </h2>
                <span className="text-[10px] text-text-tertiary mt-1 uppercase tracking-[0.2em] font-black">AI Health Intelligence</span>
              </div>
            </div>
            
            <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
              Empowering women worldwide with clinical-grade AI monitoring and personalized hormonal health strategies.
            </p>
            
            <div className="flex items-center gap-4">
              {[
                { Icon: Twitter, href: 'https://twitter.com', color: 'hover:text-sky-400 hover:border-sky-400/30 hover:bg-sky-400/5' },
                { Icon: Instagram, href: 'https://instagram.com', color: 'hover:text-pink-500 hover:border-pink-500/30 hover:bg-pink-500/5' },
                { Icon: Github, href: 'https://github.com', color: 'hover:text-white hover:border-white/30 hover:bg-white/5' }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-xl bg-secondary border border-white/5 flex items-center justify-center text-text-secondary transition-all duration-300 hover:scale-110 active:scale-95 ${social.color}`}
                >
                  <social.Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerLinks.map((section, idx) => (
              <div key={idx} className="space-y-6">
                <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] opacity-80">{section.title}</h4>
                <ul className="space-y-4">
                  {section.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <button 
                        onClick={() => setActiveTab(link.tab)}
                        className="text-sm text-text-secondary hover:text-neon-blue flex items-center gap-2 transition-all duration-300 group text-left"
                      >
                        <div className="w-1 h-1 rounded-full bg-neon-blue opacity-0 group-hover:opacity-100 transition-all group-hover:shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                        {link.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section - RE-ADDED & ENHANCED */}
        <div className="med-card p-8 mb-12 bg-gradient-to-r from-neon-blue/5 to-neon-purple/5 border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/10 rounded-full blur-3xl" />
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-xl font-bold mb-2 text-primary">Stay informed with HealthInsights</h3>
            <p className="text-sm text-text-secondary">Join 10,000+ women receiving weekly AI-curated hormonal health research.</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-3 relative z-10">
            <input 
              type="email" 
              placeholder={isSubscribed ? "Check your inbox!" : "Your email address"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubscribed || isSubmitting}
              className={`med-input bg-dark/50 border-white/10 flex-1 md:w-72 focus:border-neon-blue transition-all ${isSubscribed ? 'border-green-500/50 text-green-500 placeholder:text-green-500/50' : ''}`} 
              required
            />
            <button 
              type="submit"
              disabled={isSubmitting || isSubscribed}
              className={`px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${
                isSubscribed 
                  ? 'bg-green-500 text-white cursor-default' 
                  : 'bg-neon-blue text-dark hover:scale-105 active:scale-95'
              }`}
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
              ) : isSubscribed ? (
                <>Joined <CheckCircle size={14} /></>
              ) : (
                <>Join <Send size={14} /></>
              )}
            </button>
          </form>
        </div>

        {/* Enhanced Security Badges Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4 hover:bg-white/[0.04] transition-colors group cursor-default">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
              <Shield size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-primary uppercase tracking-wider">HIPAA Compliant</div>
              <div className="text-[10px] text-text-tertiary">Enterprise-grade medical data security</div>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4 hover:bg-white/[0.04] transition-colors group cursor-default">
            <div className="w-10 h-10 rounded-xl bg-neon-blue/10 flex items-center justify-center text-neon-blue group-hover:scale-110 transition-transform">
              <Lock size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-primary uppercase tracking-wider">Bio-Metric Encryption</div>
              <div className="text-[10px] text-text-tertiary">End-to-end 256-bit AES protection</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - CENTERED AS REQUESTED */}
        <div className="flex flex-col items-center justify-center gap-8 pt-8 border-t border-white/5 text-center">
          <div className="flex flex-col items-center gap-2 text-[11px] text-text-tertiary">
            <div className="flex items-center gap-1.5">
              <CheckCircle size={12} className="text-neon-blue" />
              <span>Diagnostic Accuracy: <span className="text-primary font-bold">98.4%</span></span>
            </div>
            <div className="flex items-center gap-1.5 opacity-60">
              <Activity size={12} />
              <span>Real-time hormonal monitoring active</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-[10px] text-text-tertiary uppercase tracking-[0.2em] font-black">
              Crafted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Renu, Arushi and Anjali</span>
            </div>
            <p className="text-[10px] text-text-tertiary opacity-60">
              © {currentYear} Luna Healthcare AI. All rights reserved.
            </p>
          </div>
        </div>

        {/* Medical Disclaimer - Enhanced */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
          <p className="text-[9px] text-text-tertiary max-w-4xl mx-auto leading-relaxed uppercase tracking-widest font-medium opacity-60">
            Medical Disclaimer: Luna AI provides analytical insights based on predictive modeling. It does not replace professional clinical evaluation. Always consult licensed healthcare providers for diagnosis. The insights provided are for informational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
