import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  TrendingUp, Activity, Calendar, 
  Droplet, Heart, Zap, CheckCircle2, AlertCircle,
  ArrowUpRight, ArrowDownRight, Share, Download, ArrowLeft, Upload, Save, Info
} from 'lucide-react';

const Dashboard = ({ userData, setUserData, calculateBMI, setActiveTab }) => {
  const bmiValue = calculateBMI();
  const fileInputRef = useRef(null);
  
  // Local UI State (Data itself is global)
  const [isExporting, setIsExporting] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Never');
  const [showSuccess, setShowSuccess] = useState(false);
  
  const biomarkersData = userData?.biomarkers || {
    glucose: '',
    bloodPressure: '',
    heartRate: '',
    sleep: ''
  };

  const history = [
    { date: 'Jan', weight: 72, bmi: 26.4 },
    { date: 'Feb', weight: 71.2, bmi: 26.1 },
    { date: 'Mar', weight: 70.5, bmi: 25.8 },
    { date: 'Current', weight: parseFloat(userData?.weight) || 69.8, bmi: parseFloat(bmiValue) || 25.5 },
  ];

  // Logic to calculate status based on ranges
  const getStatus = (label, val) => {
    if (!val) return { text: 'No Data', color: 'text-amber-400/50', type: 'empty' };
    const num = parseFloat(val);
    
    switch(label) {
      case 'Glucose':
        if (num < 100) return { text: 'Optimal', color: 'text-emerald-400' };
        if (num <= 125) return { text: 'Elevated', color: 'text-amber-400' };
        return { text: 'High Risk', color: 'text-rose-400' };
      case 'Blood Pressure':
        const sys = parseInt(val.split('/')[0]);
        if (sys < 120) return { text: 'Optimal', color: 'text-emerald-400' };
        if (sys < 140) return { text: 'Elevated', color: 'text-amber-400' };
        return { text: 'High', color: 'text-rose-400' };
      case 'Heart Rate':
        if (num >= 60 && num <= 100) return { text: 'Healthy', color: 'text-emerald-400' };
        return { text: 'Check Pulse', color: 'text-amber-400' };
      case 'Sleep Quality':
        if (num >= 7 && num <= 9) return { text: 'Optimal', color: 'text-emerald-400' };
        if (num >= 6) return { text: 'Good', color: 'text-amber-400' };
        return { text: 'Suboptimal', color: 'text-rose-400' };
      default:
        return { text: 'User-entered', color: 'text-blue-400' };
    }
  };

  const biomarkers = [
    { label: 'Glucose', value: biomarkersData.glucose ? `${biomarkersData.glucose} mg/dL` : 'No Data', icon: <Droplet size={18} />, key: 'glucose' },
    { label: 'Blood Pressure', value: biomarkersData.bloodPressure ? biomarkersData.bloodPressure : 'No Data', icon: <Heart size={18} />, key: 'bloodPressure' },
    { label: 'Heart Rate', value: biomarkersData.heartRate ? `${biomarkersData.heartRate} bpm` : 'No Data', icon: <Activity size={18} />, key: 'heartRate' },
    { label: 'Sleep Quality', value: biomarkersData.sleep ? `${biomarkersData.sleep} hrs` : 'No Data', icon: <Zap size={18} />, key: 'sleep' },
  ];

  const dailyTasks = [
    { task: "Morning Yoga (20 min)", done: true },
    { task: "Low-GI Breakfast", done: true },
    { task: "Spearmint Tea (Cup 1)", done: false },
    { task: "Evening Walk (30 min)", done: false },
  ];

  // Dynamic Insights Logic
  const generateInsight = () => {
    if (!biomarkersData.glucose && !biomarkersData.sleep) return "Statistical correlation indicates sleep quality degrades when evening walks are missed. Maintaining a consistent 20:00 schedule may stabilize overnight cortisol variance.";
    
    let insights = [];
    if (parseFloat(biomarkersData.glucose) > 110) insights.push("Elevated glucose detected. Consider increasing fiber intake during lunch to blunt the post-prandial glycemic response.");
    if (parseFloat(biomarkersData.sleep) < 6) insights.push("Sleep duration is below target. Cortisol levels may be elevated tomorrow; prioritize magnesium-rich foods.");
    if (biomarkersData.bloodPressure && parseInt(biomarkersData.bloodPressure.split('/')[0]) > 130) insights.push("BP is trending high. Ensure sodium intake is below 1500mg today and prioritize deep breathing exercises.");
    
    return insights.length > 0 ? insights[0] : "Current biomarkers are within stable parameters. Maintain current routine for metabolic consistency.";
  };

  const handleSaveData = () => {
    setLastUpdated(new Date().toLocaleTimeString());
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleExport = async () => {
    setIsExporting(true);
    const dashboardElement = document.getElementById('dashboard-content');
    
    if (!dashboardElement) {
        setIsExporting(false);
        return;
    }

    // Prepare for export
    dashboardElement.classList.add('export-mode');
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
            compress: true
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        
        await pdf.html(dashboardElement, {
            callback: function (doc) {
                doc.save(`Luna_Health_Report_${new Date().toISOString().split('T')[0]}.pdf`);
                dashboardElement.classList.remove('export-mode');
                setIsExporting(false);
            },
            x: 10,
            y: 10,
            width: pdfWidth - 20, // Margin of 10mm on each side
            windowWidth: 1200,
            autoPaging: 'text', // Handles multi-page gracefully
            html2canvas: {
                scale: 0.25, // Adjust scale to fit A4 width better with the windowWidth
                useCORS: true,
                backgroundColor: '#0b1120',
                logging: false,
            }
        });
    } catch (err) {
        console.error("Export failed", err);
        dashboardElement.classList.remove('export-mode');
        setIsExporting(false);
        alert("Report generation failed. Please check your browser permissions.");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
       const text = event.target.result;
       const lines = text.split('\n').filter(line => line.trim().length > 0);
       if (lines.length >= 2) {
           const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
           const values = lines[1].split(',').map(v => v.trim());
           
           let newBiomarkers = { ...biomarkersData };
           headers.forEach((h, i) => {
               if (h.includes('glucose')) newBiomarkers.glucose = values[i];
               if (h.includes('bloodpressure') || h.includes('bp')) newBiomarkers.bloodPressure = values[i];
               if (h.includes('heartrate') || h.includes('hr')) newBiomarkers.heartRate = values[i];
               if (h.includes('sleep')) newBiomarkers.sleep = values[i];
           });
           
           setUserData(prev => ({ ...prev, biomarkers: newBiomarkers }));
           setLastUpdated(new Date().toLocaleTimeString() + " (Imported)");
       }
    };
    reader.readAsText(file);
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto py-6 px-6 pb-24 overflow-y-auto max-h-[calc(100vh-100px)] scroll-smooth">
      <button
        onClick={() => setActiveTab('home')}
        className="mb-8 flex items-center gap-2 text-text-tertiary hover:text-primary transition-colors group no-export"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Back to Overview</span>
      </button>

      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight mb-1">
            Health Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-sm text-text-secondary font-medium">AI Syncing Enabled • Last updated: <span className="text-blue-400 font-bold">{lastUpdated}</span></p>
          </div>
        </div>
        <div className="flex gap-3">
           <input type="file" accept=".csv" onChange={handleFileUpload} ref={fileInputRef} className="hidden" />
           <button onClick={() => fileInputRef.current?.click()} className="p-2.5 rounded-xl bg-primary/50 backdrop-blur-md shadow-sm border border-white/5 text-text-secondary hover:text-primary hover:border-blue-500/30 transition-all flex items-center gap-2">
             <Upload size={18} /> <span className="hidden sm:inline text-xs font-black uppercase tracking-widest">Import Data</span>
           </button>
           <button onClick={handleExport} disabled={isExporting} className="btn-secondary shadow-sm hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all flex items-center gap-2 bg-blue-500/10 border-blue-500/20 text-blue-400">
             <Download size={18} /> <span className="text-xs font-black uppercase tracking-widest">{isExporting ? 'Generating...' : 'Export PDF'}</span>
           </button>
        </div>
      </div>

      {/* Data Input Section */}
      <div className="bg-[#121826]/80 backdrop-blur-xl p-6 rounded-[24px] border border-white/5 mb-8 shadow-2xl relative overflow-hidden group no-export">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
         <div className="flex items-center gap-2 mb-6">
            <Save size={16} className="text-blue-400" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-tertiary">Quick Entry Portal</h3>
         </div>
         <div className="flex flex-col xl:flex-row gap-6 items-end">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
               <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest ml-1">Glucose (mg/dL)</label>
                  <input type="number" value={biomarkersData.glucose} onChange={e => setUserData({...userData, biomarkers: {...biomarkersData, glucose: e.target.value}})} className="med-input bg-[#0f172a] border-white/5 text-white focus:border-blue-500/50 transition-all placeholder-white/10" placeholder="e.g. 95" />
               </div>
               <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest ml-1">Blood Pressure</label>
                  <input type="text" value={biomarkersData.bloodPressure} onChange={e => setUserData({...userData, biomarkers: {...biomarkersData, bloodPressure: e.target.value}})} className="med-input bg-[#0f172a] border-white/5 text-white focus:border-blue-500/50 transition-all placeholder-white/10" placeholder="e.g. 118/78" />
               </div>
               <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest ml-1">Heart Rate (bpm)</label>
                  <input type="number" value={biomarkersData.heartRate} onChange={e => setUserData({...userData, biomarkers: {...biomarkersData, heartRate: e.target.value}})} className="med-input bg-[#0f172a] border-white/5 text-white focus:border-blue-500/50 transition-all placeholder-white/10" placeholder="e.g. 72" />
               </div>
               <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest ml-1">Sleep (hrs)</label>
                  <input type="number" step="0.1" value={biomarkersData.sleep} onChange={e => setUserData({...userData, biomarkers: {...biomarkersData, sleep: e.target.value}})} className="med-input bg-[#0f172a] border-white/5 text-white focus:border-blue-500/50 transition-all placeholder-white/10" placeholder="e.g. 7.5" />
               </div>
               <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest ml-1">Weight (kg)</label>
                  <input type="number" step="0.1" value={userData.weight} onChange={e => setUserData({...userData, weight: e.target.value})} className="med-input bg-[#0f172a] border-white/5 text-white focus:border-blue-500/50 transition-all placeholder-white/10" placeholder="e.g. 70" />
               </div>
            </div>
            <button onClick={handleSaveData} className={`w-full xl:w-auto px-10 py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 ${showSuccess ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-blue-500 text-white shadow-blue-500/20'}`}>
               {showSuccess ? <CheckCircle2 size={16} /> : <Save size={16} />}
               {showSuccess ? 'Synced!' : 'Sync Data'}
            </button>
         </div>
      </div>

      <div id="dashboard-content" className="bg-[#0b1120] p-4 rounded-3xl border border-white/5">
        
        {/* PDF Only Header */}
        <div className="hidden pdf-only flex justify-between items-center mb-10 pb-6 border-b border-white/10">
            <div>
                <h1 className="text-2xl font-black text-white">LUNA</h1>
                <p className="text-xs text-text-tertiary uppercase tracking-[0.3em]">Patient Health Report</p>
            </div>
            <div className="text-right">
                <p className="text-[10px] font-black text-white uppercase">{new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}</p>
                <p className="text-[10px] text-blue-400 font-bold uppercase">ID: {userData?.id || 'P-88291'}</p>
            </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {biomarkers.map((mark, i) => {
            const status = getStatus(mark.label, biomarkersData[mark.key]);
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-[24px] bg-[#121826] border border-white/5 hover:border-blue-500/20 hover:shadow-[0_0_30px_rgba(59,130,246,0.05)] transition-all duration-500 flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-4">
                   <div className="p-3 rounded-2xl bg-white/5 text-blue-400 border border-white/5">
                      {mark.icon}
                   </div>
                   <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 border border-white/5">
                      <div className={`w-1.5 h-1.5 rounded-full ${status.text === 'No Data' ? 'bg-white/20' : 'bg-emerald-500'}`}></div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-text-tertiary">Real-time</span>
                   </div>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-primary tracking-tighter mb-1">{mark.value}</h2>
                  <div className="flex items-center gap-2">
                     <p className="text-[10px] text-text-tertiary font-black uppercase tracking-widest">{mark.label}</p>
                     <div className="w-1 h-1 rounded-full bg-white/10"></div>
                     <span className={`text-[10px] font-black uppercase tracking-widest ${status.color}`}>
                        {status.text}
                     </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-[#121826] p-8 rounded-[24px] border border-white/5 flex flex-col relative h-[450px] shadow-sm overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none"></div>
               
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 relative z-10">
                  <div>
                     <h2 className="text-xl font-black text-primary tracking-tight">Anthropometric Progress</h2>
                     <p className="text-xs text-text-tertiary uppercase tracking-widest font-bold mt-1">Weight & BMI Analytics</p>
                  </div>
                  <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/5 shadow-inner">
                     <button className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg bg-blue-500 text-white shadow-lg">History</button>
                     <button className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg text-text-tertiary hover:text-primary transition-colors">Goal</button>
                  </div>
               </div>

               <div className="relative flex-1 flex items-end justify-between px-2 sm:px-6 gap-4 sm:gap-8 pb-10">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.03]">
                     {[...Array(5)].map((_, i) => <div key={i} className="w-full h-[1px] bg-white"></div>)}
                  </div>

                 {history.map((item, idx) => (
                   <div key={idx} className="flex-1 flex flex-col items-center group relative h-[250px]">
                      <div className="absolute bottom-0 w-full flex justify-center gap-2 items-end">
                         <motion.div 
                           initial={{ height: 0 }}
                           animate={{ height: item.weight * 2.8 }}
                           className="w-full max-w-[36px] bg-blue-500/20 rounded-t-xl relative transition-all group-hover:bg-blue-500/40 border-t-2 border-blue-500/30"
                         >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1e293b] border border-white/10 text-[10px] font-black text-white px-3 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 whitespace-nowrap z-20">
                               {item.weight} kg
                            </div>
                         </motion.div>
                         <motion.div 
                           initial={{ height: 0 }}
                           animate={{ height: item.bmi * 5.5 }}
                           className="w-2.5 bg-blue-400/60 rounded-t-sm"
                         />
                      </div>
                      <span className="absolute -bottom-8 text-[10px] font-black uppercase tracking-widest text-text-tertiary">{item.date}</span>
                   </div>
                 ))}
               </div>

               <div className="pt-8 mt-auto border-t border-white/5 flex gap-8 justify-center relative z-10">
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary">
                     <div className="w-3 h-3 rounded-sm bg-blue-500/20 border border-blue-500/50"></div>
                     <span>Body Mass (kg)</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary">
                     <div className="w-3 h-3 rounded-sm bg-blue-400/60"></div>
                     <span>BMI Index</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-6">
             <div className="bg-[#121826] p-8 rounded-[24px] border border-white/5 flex flex-col items-center shadow-lg hover:border-blue-500/10 transition-all duration-300">
                <h3 className="w-full text-xs font-black uppercase tracking-[0.2em] text-text-tertiary mb-8">Metabolic Wellness</h3>
                <div className="relative w-40 h-40 mb-6">
                   <svg className="w-full h-full transform -rotate-90">
                      <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/5" />
                      <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" 
                         strokeDasharray={439.8} 
                         strokeDashoffset={439.8 - (439.8 * 82) / 100} 
                         className="text-blue-500 transition-all duration-1500 ease-out drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]" 
                         strokeLinecap="round" 
                      />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-primary tracking-tighter">82</span>
                      <span className="text-[10px] uppercase tracking-widest font-black text-emerald-400 mt-2">Optimal</span>
                   </div>
                </div>
                <p className="text-[13px] text-text-secondary text-center leading-relaxed">System performance is exceptional. All critical markers are syncing with projected targets.</p>
             </div>

             <div className="bg-[#121826] p-8 rounded-[24px] border border-white/5 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-tertiary">Daily Protocol</h3>
                   <div className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[9px] font-black tracking-widest uppercase">Active</div>
                </div>
                <ul className="space-y-2">
                   {dailyTasks.map((item, i) => (
                      <li key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0 group cursor-pointer transition-all hover:pl-2">
                         <span className={`text-sm font-bold ${item.done ? 'text-text-tertiary/40 line-through' : 'text-primary'}`}>{item.task}</span>
                         <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${item.done ? 'bg-emerald-500 text-white border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-white/10 group-hover:border-blue-400'}`}>
                            {item.done && <CheckCircle2 size={12} strokeWidth={4} />}
                         </div>
                      </li>
                   ))}
                </ul>
             </div>

             {/* AI Insight Section */}
             <div className="bg-[#0f172a] p-8 rounded-[24px] border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.05)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 blur-[60px] rounded-full -mr-20 -mt-20 pointer-events-none group-hover:bg-blue-500/20 transition-all duration-700"></div>
                <div className="flex items-center gap-3 mb-4 relative z-10">
                   <div className="p-2 rounded-lg bg-blue-500/20">
                      <Info size={18} className="text-blue-400" />
                   </div>
                   <h4 className="text-xs font-black uppercase tracking-widest text-primary">Clinical Insight</h4>
                </div>
                <p className="text-[13px] text-text-secondary leading-relaxed relative z-10 italic">
                   "{generateInsight()}"
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
