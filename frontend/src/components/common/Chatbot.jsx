import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Bot, Sparkles } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi 👋 I'm Luna, your PCOS-AI assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const generateRasaResponse = (userInput) => {
    const text = userInput.toLowerCase().trim();
    
    // Helper to pick a random response from an array
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // Greeting Rule (STRICT)
    const greetings = ['hi', 'hii', 'hello', 'hlo', 'hey', 'hy', 'helo'];
    if (greetings.includes(text)) {
      return "Hi 👋 I'm Luna, your PCOS-AI assistant. How can I help you today?";
    }

    // Health/PCOS Variations
    if (text.includes('pcos') || text.includes('pcod')) {
      return pick([
        "PCOS (Polycystic Ovary Syndrome) involves complex hormonal shifts. I'd suggest reviewing your 'Anthropometric Progress' in the dashboard to see how your BMI correlates with symptoms. 🌿\n\nFor proper diagnosis, consult a doctor.",
        "Managing PCOS is about consistency, not perfection. Focus on your 'Daily Protocol' tasks! 🌸\n\nFor proper diagnosis, consult a doctor.",
        "PCOS affects everyone differently—some have metabolic symptoms, others have skin or hair changes. Which one is your main focus today? 🧬\n\nFor proper diagnosis, consult a doctor."
      ]);
    }

    if (text.includes('diet') || text.includes('food') || text.includes('eat')) {
      return pick([
        "Try focusing on anti-inflammatory 'Power Bowls'. Think berries, fatty fish, and plenty of cruciferous vegetables like broccoli to help with estrogen detox. 🥗\n\nFor proper diagnosis, consult a doctor.",
        "A key hack for PCOS: eat your veggies first, then protein, then carbs. This blunts the insulin spike! 🥦\n\nFor proper diagnosis, consult a doctor.",
        "Are you craving sugar? That might be insulin resistance. Try a high-protein breakfast (like eggs or tofu) to stabilize yourself for the day. 🍳\n\nFor proper diagnosis, consult a doctor."
      ]);
    }

    // Coding/Tech Variations
    if (text.includes('code') || text.includes('javascript') || text.includes('react')) {
      return pick([
        "I'm a big fan of clean React code! Have you tried using 'useMemo' for expensive calculations in your dashboard charts? 💻",
        "Coding tip: Always keep your UI state as thin as possible. Lift state up only when necessary! ⚛️",
        "If you're debugging, try logging the state changes in your 'useEffect'—it's usually where the magic (or the bugs) happen! 🐛"
      ]);
    }

    // Emotional Support Variations
    if (text.includes('sad') || text.includes('tired') || text.includes('hard') || text.includes('frustrated')) {
      return pick([
        "I hear you. Hormonal shifts can make everything feel 10x heavier. Take a break, you've earned it. 💙",
        "It's okay to have off-days. Your value isn't tied to your productivity or your biomarkers. 🫂",
        "Sending you strength. Managing PCOS is tough, but you are tougher. Why not try the 'Grounding' tool in Stress Management? ✨"
      ]);
    }

    // General Knowledge / Science
    if (text.includes('hormone') || text.includes('insulin') || text.includes('science')) {
      return pick([
        "Insulin is like a key that lets sugar into your cells. In PCOS, the 'lock' is often rusty—that's insulin resistance. 🔬",
        "Did you know hormones like cortisol follow a circadian rhythm? That's why your 'Sleep Quality' metric in the dashboard is so important! 🌙",
        "PCOS is fundamentally an endocrine and metabolic challenge, not just a gynecological one. It affects the whole body! 🧪"
      ]);
    }

    // Unknown Questions
    if (text.length > 3) {
      return pick([
        "I'm not fully sure about that specific detail, but here's what I can suggest: checking our Latest Research tab for clinical updates. ✨",
        "I'm still learning about that particular topic! In the meantime, I can help with diet, biomarkers, or exercise tips. 🌸",
        "That's a new one for me! I'll add it to my learning queue. What else can I assist you with? 🧠"
      ]);
    }

    return "I'm listening! Tell me more about what's on your mind.";
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;
    
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    // Simulate thinking
    setIsTyping(true);
    const delay = Math.max(1000, input.length * 20); // Dynamic delay based on length
    await new Promise(resolve => setTimeout(resolve, delay));
    
    const response = generateRasaResponse(userMsg.text);
    setMessages(prev => [...prev, { role: 'bot', text: response }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[380px] h-[550px] bg-[#0b0f19] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-accent/20 to-neon-blue/10 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent relative">
                   <Sparkles size={20} />
                   <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0b0f19]"></div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Luna AI</h3>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Always Active</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth"
            >
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-accent text-white rounded-tr-none' 
                      : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
                  }`}>
                    {msg.text.split('\n').map((line, j) => (
                      <p key={j} className={j > 0 ? 'mt-2' : ''}>{line}</p>
                    ))}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white/5 border-t border-white/10 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Luna anything..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/50 placeholder:text-gray-500"
              />
              <button
                type="submit"
                className="p-2.5 bg-accent text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/20"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-90 ${
          isOpen ? 'bg-red-500 rotate-90' : 'bg-accent hover:shadow-[0_0_30px_rgba(188,19,254,0.4)]'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};

export default Chatbot;