import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Calendar, Activity, Shield, Settings, 
  LogOut, ChevronRight, Award, Heart, Edit2, Camera, 
  ArrowLeft, Save, X, CheckCircle2, Info, Upload, Image as ImageIcon
} from 'lucide-react';

const Profile = ({ userData, setUserData, calculateBMI, setActiveTab, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'saving', 'success', null
  const fileInputRef = useRef(null);
  
  // Local form state for editing
  const [formData, setFormData] = useState({
    name: userData?.name || 'Sophia Anderson',
    email: userData?.email || 'sophia.a@example.com',
    age: userData?.age || '24',
    weight: userData?.weight || '62',
    height: userData?.height || '165',
    bloodGroup: userData?.bloodGroup || 'O+',
    lastPeriod: userData?.lastPeriod || '2026-04-12',
    medications: userData?.medications || 'Metformin',
    avatar: userData?.avatar || null
  });

  const avatars = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Lily",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Ava",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Grace"
  ];

  // Update local state if external userData changes
  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        ...userData
      }));
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarSelect = (url) => {
    setFormData(prev => ({ ...prev, avatar: url }));
    setShowPhotoPicker(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large! Please choose an image under 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
        setShowPhotoPicker(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setSaveStatus('saving');
    
    // Simulate API delay for premium feel
    setTimeout(() => {
      setUserData(prev => ({
        ...prev,
        ...formData
      }));
      setIsEditing(false);
      setSaveStatus('success');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveStatus(null), 3000);
    }, 800);
  };

  const currentBMI = calculateBMI ? (
    (formData.weight && formData.height) 
      ? (formData.weight / ((formData.height / 100) ** 2)).toFixed(1)
      : '22.8'
  ) : '22.8';

  const stats = [
    { label: 'BMI', value: currentBMI, icon: <Activity size={18} className="text-blue-400" />, trend: 'Healthy', color: 'blue' },
    { label: 'Risk Level', value: 'Low Risk', icon: <Shield size={18} className="text-green-400" />, trend: 'Stable', color: 'green' },
    { label: 'Cycle Day', value: '14', icon: <Calendar size={18} className="text-pink-400" />, trend: 'Ovulation', color: 'pink' },
    { label: 'Health Score', value: '85/100', icon: <Award size={18} className="text-purple-400" />, trend: '+5 this month', color: 'purple' },
  ];

  const recentActivities = [
    { type: 'Log', description: 'Updated symptom log', time: '2 hours ago', icon: <Heart size={14} /> },
    { type: 'Assessment', description: 'Completed monthly checkup', time: '1 day ago', icon: <Shield size={14} /> },
    { type: 'Diet', description: 'Viewed personalized meal plan', time: '3 days ago', icon: <Activity size={14} /> },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24">
      {/* Photo Picker Modal */}
      <AnimatePresence>
        {showPhotoPicker && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-lg med-card p-8 border-white/10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-purple-600" />
              
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-bold text-primary">Choose Profile Photo</h3>
                  <p className="text-xs text-text-tertiary">Personalize your healthcare identity</p>
                </div>
                <button 
                  onClick={() => setShowPhotoPicker(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-text-secondary hover:text-primary transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Upload Section */}
              <div className="mb-8">
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="w-full py-8 border-2 border-dashed border-white/10 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] hover:border-accent/30 transition-all flex flex-col items-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                    <Upload size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-primary">Upload Custom Photo</p>
                    <p className="text-[10px] text-text-tertiary">Supports JPG, PNG (Max 5MB)</p>
                  </div>
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold text-text-tertiary">
                  <span className="bg-secondary px-3">Or choose a character</span>
                </div>
              </div>

              {/* Character Grid */}
              <div className="grid grid-cols-4 gap-4">
                {avatars.map((url, i) => (
                  <button 
                    key={i}
                    onClick={() => handleAvatarSelect(url)}
                    className="aspect-square rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-accent transition-all hover:scale-105 active:scale-95 group"
                  >
                    <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Success Notification */}
      <AnimatePresence>
        {saveStatus === 'success' && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-green-500/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-green-400/20"
          >
            <CheckCircle2 size={20} />
            <span className="font-bold text-sm tracking-wide">Profile Updated Successfully</span>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setActiveTab('home')}
        className="mb-8 flex items-center gap-2 text-text-tertiary hover:text-primary transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Back to Overview</span>
      </button>

      {/* Profile Header */}
      <div className="relative mb-12">
        <div className="h-48 w-full bg-gradient-to-r from-accent/20 to-purple-600/20 rounded-3xl blur-xl absolute -top-4 -z-10 opacity-50" />
        <div className="med-card flex flex-col md:flex-row items-center md:items-end gap-6 p-8 relative z-10 overflow-hidden border-white/5">
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-accent to-purple-600 p-1 shadow-2xl overflow-hidden">
              <div className="w-full h-full rounded-2xl bg-secondary flex items-center justify-center overflow-hidden">
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={64} className="text-text-secondary" />
                )}
              </div>
            </div>
            <button 
              onClick={() => setShowPhotoPicker(true)}
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent text-white rounded-xl flex items-center justify-center shadow-lg border-2 border-secondary group-hover:scale-110 transition-transform z-20"
            >
              <Camera size={18} />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left">
            {isEditing ? (
              <div className="space-y-3 mb-2 max-w-sm">
                <input 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="med-input w-full bg-dark/50 border-accent/30 text-2xl font-bold py-1 px-3 rounded-xl focus:border-accent"
                  placeholder="Your Full Name"
                />
                <input 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="med-input w-full bg-dark/50 border-white/10 text-sm py-1 px-3 rounded-xl"
                  placeholder="Email Address"
                />
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-primary">{formData.name}</h1>
                  <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold flex items-center gap-1.5 w-fit mx-auto md:mx-0">
                    <Shield size={12} /> Verified Patient
                  </span>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-text-secondary">
                  <span className="flex items-center gap-1.5 text-sm"><Mail size={14} /> {formData.email}</span>
                  <span className="flex items-center gap-1.5 text-sm"><Calendar size={14} /> Joined April 2026</span>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-text-secondary font-medium flex items-center gap-2 hover:bg-white/10 transition-all"
                >
                  <X size={16} /> Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  className="px-6 py-2.5 rounded-xl bg-accent text-white font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-accent/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  {saveStatus === 'saving' ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  Save Changes
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-6 py-2.5 rounded-xl bg-tertiary border border-white/10 text-primary font-medium flex items-center gap-2 hover:bg-tertiary/80 transition-all shadow-sm"
              >
                <Edit2 size={16} /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="med-card p-5 border-white/5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-${stat.color}-400/10 flex items-center justify-center`}>
                    {stat.icon}
                  </div>
                  <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">{stat.label}</span>
                </div>
                <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-[10px] text-accent font-semibold">{stat.trend}</div>
              </motion.div>
            ))}
          </div>

          <div className="med-card p-8 border-white/5">
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
              <h3 className="text-xl font-bold text-primary">Personal Health Details</h3>
              {isEditing && (
                <span className="text-[10px] bg-accent/10 text-accent px-3 py-1 rounded-full font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Info size={12} /> Editing Mode
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex flex-col gap-5">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-text-secondary text-sm font-medium">Age</span>
                    {isEditing ? (
                      <input 
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="w-20 bg-dark/50 border border-white/10 text-right text-accent font-bold px-2 py-1 rounded-lg focus:border-accent"
                      />
                    ) : (
                      <span className="text-primary text-sm font-bold bg-secondary px-3 py-1 rounded-lg">{formData.age} Years</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-text-secondary text-sm font-medium">Current Weight</span>
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input 
                          name="weight"
                          type="number"
                          value={formData.weight}
                          onChange={handleInputChange}
                          className="w-20 bg-dark/50 border border-white/10 text-right text-accent font-bold px-2 py-1 rounded-lg focus:border-accent"
                        />
                        <span className="text-xs text-text-tertiary">kg</span>
                      </div>
                    ) : (
                      <span className="text-primary text-sm font-bold bg-secondary px-3 py-1 rounded-lg">{formData.weight} kg</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-text-secondary text-sm font-medium">Height</span>
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input 
                          name="height"
                          type="number"
                          value={formData.height}
                          onChange={handleInputChange}
                          className="w-20 bg-dark/50 border border-white/10 text-right text-accent font-bold px-2 py-1 rounded-lg focus:border-accent"
                        />
                        <span className="text-xs text-text-tertiary">cm</span>
                      </div>
                    ) : (
                      <span className="text-primary text-sm font-bold bg-secondary px-3 py-1 rounded-lg">{formData.height} cm</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col gap-5">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-text-secondary text-sm font-medium">Blood Group</span>
                    {isEditing ? (
                      <select 
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleInputChange}
                        className="bg-dark/50 border border-white/10 text-accent font-bold px-2 py-1 rounded-lg focus:border-accent outline-none"
                      >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    ) : (
                      <span className="text-primary text-sm font-bold bg-secondary px-3 py-1 rounded-lg">{formData.bloodGroup} Positive</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-text-secondary text-sm font-medium">Last Period Start</span>
                    {isEditing ? (
                      <input 
                        name="lastPeriod"
                        type="date"
                        value={formData.lastPeriod}
                        onChange={handleInputChange}
                        className="bg-dark/50 border border-white/10 text-accent font-bold px-2 py-1 rounded-lg focus:border-accent"
                      />
                    ) : (
                      <span className="text-primary text-sm font-bold bg-secondary px-3 py-1 rounded-lg">
                        {new Date(formData.lastPeriod).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-text-secondary text-sm font-medium">Medications</span>
                    {isEditing ? (
                      <input 
                        name="medications"
                        value={formData.medications}
                        onChange={handleInputChange}
                        className="bg-dark/50 border border-white/10 text-right text-accent font-bold px-2 py-1 rounded-lg focus:border-accent"
                        placeholder="e.g. Metformin"
                      />
                    ) : (
                      <span className="text-primary text-sm font-bold bg-accent/10 text-accent px-3 py-1 rounded-lg">{formData.medications}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="med-card p-6 border-white/5">
            <h3 className="text-lg font-bold text-primary mb-6">Health Shortcuts</h3>
            <div className="space-y-3">
              <button 
                onClick={() => setActiveTab('tracker')}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-secondary/50 border border-white/5 hover:border-accent/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                    <Activity size={18} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-primary">Symptom Log</div>
                    <div className="text-[10px] text-text-secondary font-medium">Record daily symptoms</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-text-secondary group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>

          <div className="med-card p-6 border-white/5">
            <h3 className="text-lg font-bold text-primary mb-6 flex items-center justify-between">
              Activity
              <button className="text-[10px] text-accent font-bold uppercase tracking-widest">See All</button>
            </h3>
            <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/5">
              {recentActivities.map((activity, idx) => (
                <div key={idx} className="relative pl-10 group">
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-secondary border border-white/10 flex items-center justify-center text-text-secondary z-10 group-hover:border-accent/30 transition-colors">
                    {activity.icon}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-primary group-hover:text-accent transition-colors">{activity.description}</div>
                    <div className="text-[10px] text-text-secondary">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="med-card p-4 border-white/5 divide-y divide-white/5">
            <button className="w-full py-3.5 px-2 flex items-center justify-between text-text-secondary hover:text-primary transition-colors group">
              <div className="flex items-center gap-3 text-sm font-medium">
                <Settings size={18} className="group-hover:rotate-45 transition-transform" /> Account Settings
              </div>
              <ChevronRight size={16} />
            </button>
            <button 
              onClick={onLogout}
              className="w-full py-4 px-2 flex items-center justify-between text-red-400 hover:text-red-300 transition-colors"
            >
              <div className="flex items-center gap-3 text-sm font-bold">
                <LogOut size={18} /> Sign Out
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
