import React, { useState, useEffect } from 'react';
import * as mlApi from '../../services/mlApi';
import { calculateBMI } from '../../utils/healthUtils';
import { Activity, ShieldCheck, Heart, Stethoscope, FileText, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

const EarlyDetection = ({ userData, setActiveTab }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [riskFactors, setRiskFactors] = useState([]);
  const [otherRisks, setOtherRisks] = useState({});

  const predictRisk = async () => {
    if (!userData.age || !userData.weight || !userData.height) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const heightInMeters = userData.height / 100;
      const bmi = userData.weight / (heightInMeters * heightInMeters);
      
      let score = 5; // Base line
      const factors = [];
      
      // Age factor
      if (userData.age > 30) score += 5;
      
      // BMI / Metabolic
      let metabolicScore = 0;
      if (bmi > 25) { metabolicScore += 15; factors.push("Elevated BMI (Metabolic Stress)"); }
      if (bmi > 30) { metabolicScore += 15; factors.push("Obesity (High Insulin Resistance Risk)"); }
      if (userData.symptoms.includes('Weight gain')) { metabolicScore += 10; factors.push("Rapid Weight Gain"); }
      if (userData.lifestyleFactors.includes('Poor dietary habits')) metabolicScore += 10;
      if (userData.lifestyleFactors.includes('Sedentary lifestyle')) metabolicScore += 10;
      
      // Ovarian / Cycle
      let ovarianScore = 0;
      if (userData.cycleRegularity === 'irregular') { ovarianScore += 30; factors.push("Irregular Menstrual Cycle"); }
      if (userData.cycleRegularity === 'absent') { ovarianScore += 45; factors.push("Absent Menstrual Cycle (Amenorrhea)"); }
      if (userData.symptoms.includes('Pelvic pain')) { ovarianScore += 15; factors.push("Pelvic Pain (Possible Ovarian Cysts)"); }
      
      // Hyperandrogenism
      let androgenScore = 0;
      if (userData.symptoms.includes('Excess hair growth')) { androgenScore += 25; factors.push("Hirsutism (Excess Androgens)"); }
      if (userData.symptoms.includes('Acne')) { androgenScore += 15; factors.push("Persistent Acne"); }
      if (userData.symptoms.includes('Hair loss')) { androgenScore += 10; factors.push("Androgenic Alopecia (Hair Loss)"); }
      
      // Clinical Biomarkers Integration
      const markers = userData.biomarkers || {};
      if (markers.glucose && parseFloat(markers.glucose) > 100) {
        metabolicScore += 15;
        factors.push(`Hyperglycemia (${markers.glucose} mg/dL)`);
      }
      if (markers.sleep && parseFloat(markers.sleep) < 6) {
        metabolicScore += 10;
        factors.push(`Sleep Deprivation (${markers.sleep} hrs)`);
      }
      if (markers.heartRate && parseFloat(markers.heartRate) > 100) {
        metabolicScore += 5;
        factors.push(`Elevated Resting HR (${markers.heartRate} bpm)`);
      }
      if (markers.bloodPressure) {
        const sys = parseInt(markers.bloodPressure.split('/')[0]);
        if (sys >= 140) {
          metabolicScore += 15;
          factors.push(`Hypertension (${markers.bloodPressure})`);
        }
      }
      
      score += (metabolicScore + ovarianScore + androgenScore);
      let riskScore = Math.min(99, score);
      
      // Attempt ML API call to mix with heuristic
      try {
        const pcosPayload = {
          'Age (yrs)': parseFloat(userData.age),
          'Weight (Kg)': parseFloat(userData.weight),
          'Height(Cm)': parseFloat(userData.height),
          'BMI': bmi,
          'Cycle(R/I)': userData.cycleRegularity === 'irregular' ? 4 : (userData.cycleRegularity === 'absent' ? 5 : 2),
          'Pimples(Y/N)': userData.symptoms.includes('Acne') ? 1 : 0,
          'hair growth(Y/N)': userData.symptoms.includes('Excess hair growth') ? 1 : 0,
          'Weight gain(Y/N)': userData.symptoms.includes('Weight gain') ? 1 : 0,
          'Hair loss(Y/N)': userData.symptoms.includes('Hair loss') ? 1 : 0,
          'Reg.Exercise(Y/N)': userData.lifestyleFactors.includes('Sedentary lifestyle') ? 0 : 1,
          'Fast food (Y/N)': userData.lifestyleFactors.includes('Poor dietary habits') ? 1 : 0,
        };
        const pcosResult = await mlApi.predictPCOS(pcosPayload);
        if (pcosResult && pcosResult.probability !== undefined) {
           riskScore = Math.round((riskScore * 0.4) + (pcosResult.probability * 100 * 0.6));
        }
      } catch (e) {
        console.warn("ML API unavailable, using advanced dynamic heuristic completely.");
      }

      // Differentiation: PCOD vs PCOS
      let conditionType = "Normal";
      if (riskScore >= 40) {
         if (metabolicScore >= 20 && androgenScore >= 15 && ovarianScore > 0) {
            conditionType = "PCOS (Polycystic Ovary Syndrome)";
         } else {
            conditionType = "PCOD (Polycystic Ovarian Disease)";
         }
      }

      let riskLevel = "Low";
      if (riskScore >= 65) riskLevel = "High";
      else if (riskScore >= 35) riskLevel = "Moderate";

      // Future Health Predictions (Diabetes, Cardio)
      let diabetesRisk = Math.min(95, Math.round((bmi > 25 ? 30 : 10) + (userData.age * 0.5) + (metabolicScore * 0.8)));
      let heartRisk = Math.min(95, Math.round((bmi > 28 ? 25 : 10) + (userData.age * 0.6) + (userData.lifestyleFactors.includes('Smoking') ? 25 : 0) + (metabolicScore * 0.5)));
      
      try {
        const dRes = await mlApi.predictDiabetes({ BMI: bmi, Age: userData.age });
        if (dRes && dRes.probability) diabetesRisk = Math.round((diabetesRisk * 0.3) + (dRes.probability * 100 * 0.7));
        
        const hRes = await mlApi.predictHeart({ Age: userData.age, BMI: bmi });
        if (hRes && hRes.probability) heartRisk = Math.round((heartRisk * 0.3) + (hRes.probability * 100 * 0.7));
      } catch (e) { }

      let additionalRisks = {
        diabetes: diabetesRisk,
        heart: heartRisk,
        obesity: bmi > 30 ? "Grade I Obesity" : (bmi > 25 ? "Overweight" : "Normal Range")
      };

      const recommendationData = {
        primary: riskLevel === "High" ? `Immediate clinical consultation recommended to evaluate for ${conditionType}.` : "Focus on preventative lifestyle adjustments.",
        rules: {
          diet: bmi > 25 ? "Focus on insulin-sensitizing Low-GI foods." : "Maintain balanced anti-inflammatory nutrition.",
          exercise: "Establish 150min/week of moderate-intensity movement.",
          stress: "Prioritize sleep hygiene (7-8h) and cortisol management."
        }
      };

      setResult({
        score: riskScore,
        futureScore: Math.min(99, Math.round(Math.max(riskScore, diabetesRisk, heartRisk) * 1.05)),
        level: riskLevel,
        condition: conditionType,
        recommendation: getRiskRecommendation(riskLevel, conditionType),
        lifestyleTip: recommendationData.primary,
        rules: recommendationData.rules,
      });
      
      setOtherRisks(additionalRisks);
      setRiskFactors(factors.slice(0, 5));
    } catch (error) {
      console.error("Critical failure in diagnostic model", error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskRecommendation = (level, condition) => {
    if (level === "Low") return "Your clinical profile indicates a low probability of endocrine disorders. Maintain current wellness practices.";
    if (level === "Moderate") return `Presence of several diagnostic markers detected. The pattern suggests potential ${condition}. We recommend a baseline hormone panel (FSH, LH, Testosterone) and pelvic ultrasound.`;
    return `Significant correlation with ${condition} diagnostic criteria. Note: PCOS affects systemic metabolism, while PCOD is primarily ovarian. Urgent consultation with an endocrinologist or gynecologist is advised for formal diagnosis.`;
  };
  
  useEffect(() => {
    if (userData && userData.age && userData.weight && userData.height) {
      predictRisk();
    }
  }, [userData.age, userData.weight, userData.height, userData.cycleRegularity, userData.symptoms, userData.lifestyleFactors]);
  
  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <button
        onClick={() => setActiveTab('assessment')}
        className="mb-8 flex items-center gap-2 text-text-tertiary hover:text-primary transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Back to Assessment</span>
      </button>

      <div className="med-card">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
          <Activity className="text-accent" size={24} />
          <h2 className="heading-large font-bold text-primary">Diagnostic Analysis</h2>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-t-accent border-r-transparent border-b-white/10 border-l-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-secondary font-medium">Running clinical predictive models...</p>
          </div>
        ) : result ? (
          <div className="space-y-10">
            {/* Primary Scores */}
            <div className="flex flex-col md:flex-row items-center justify-around gap-12 bg-tertiary p-8 rounded-2xl border border-white/5">
              <div className="flex flex-col items-center">
                <div className="text-xs text-text-tertiary mb-3 uppercase tracking-wider font-semibold">Current Risk Profile</div>
                <div className={`text-6xl font-bold mb-4 tracking-tighter ${
                  result.level === "Low" ? "text-emerald-400" : 
                  result.level === "Moderate" ? "text-amber-400" : 
                  "text-rose-400"
                }`}>
                  {result.score}<span className="text-3xl text-secondary">%</span>
                </div>
                <div className={`px-4 py-1.5 rounded-lg text-sm font-semibold mb-2 ${
                  result.level === "Low" ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20" : 
                  result.level === "Moderate" ? "bg-amber-400/10 text-amber-400 border border-amber-400/20" : 
                  "bg-rose-400/10 text-rose-400 border border-rose-400/20"
                }`}>
                  {result.level} Probability
                </div>
                <div className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                  result.condition.includes("PCOS") ? "bg-rose-400/20 text-rose-400 border border-rose-400/30 shadow-[0_0_15px_rgba(251,113,133,0.2)]" : 
                  result.condition.includes("PCOD") ? "bg-amber-400/20 text-amber-400 border border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.2)]" : 
                  "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
                }`}>
                  {result.condition === 'Normal' ? 'No PCOS/PCOD Detected' : `Pattern: ${result.condition.split(' (')[0]}`}
                </div>
              </div>

              <div className="w-px h-32 bg-white/5 hidden md:block"></div>

              <div className="flex flex-col items-center">
                <div className="text-xs text-text-tertiary mb-3 uppercase tracking-wider font-semibold">Future Risk Trajectory</div>
                <div className="relative mb-2">
                   <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                      <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                        strokeDasharray={364} 
                        strokeDashoffset={364 - (364 * result.futureScore) / 100} 
                        className={`${result.futureScore > 50 ? 'text-amber-400' : 'text-blue-400'} transition-all duration-1000 ease-out`} 
                        strokeLinecap="round" 
                      />
                   </svg>
                   <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-3xl font-bold text-primary">{result.futureScore}%</span>
                   </div>
                </div>
                <div className="text-[11px] text-text-secondary mt-1 font-medium">Combined longitudinal score</div>
              </div>
            </div>

            {/* Analysis details */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">Clinical Evaluation</h3>
              <div className="p-6 rounded-xl border border-accent/20 bg-accent/5 mb-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <p className="body-medium text-secondary mb-6 relative z-10">{result.recommendation}</p>
                <button 
                  onClick={() => setActiveTab('lifestyle')} 
                  className="px-6 py-3 bg-accent text-dark rounded-xl font-bold shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:scale-105 transition-all flex items-center gap-2 relative z-10"
                >
                  <Sparkles size={18} /> View Your Personalized Lifestyle Plan
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-tertiary p-5 rounded-xl border border-white/5">
                  <h4 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2"><ShieldCheck size={16} className="text-accent" /> Identified Vectors</h4>
                  <ul className="space-y-2">
                    {riskFactors.length > 0 ? riskFactors.map((factor, index) => (
                      <li key={index} className="text-sm text-secondary flex items-start gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-accent/50 mt-1.5 shrink-0"></div>
                         {factor}
                      </li>
                    )) : <li className="text-sm text-text-tertiary">No significant risk vectors identified.</li>}
                  </ul>
                </div>
                
                {Object.keys(otherRisks).length > 0 && (
                  <div className="bg-tertiary p-5 rounded-xl border border-white/5">
                    <h4 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2"><Heart size={16} className="text-rose-400" /> Correlated Conditions</h4>
                    <div className="space-y-4">
                      <div>
                         <div className="flex justify-between text-sm mb-1">
                           <span className="text-secondary font-medium">Type 2 Diabetes Risk</span>
                           <span className={otherRisks.diabetes > 50 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>{otherRisks.diabetes}%</span>
                         </div>
                         <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden"><div className={`h-full ${otherRisks.diabetes > 50 ? 'bg-rose-400' : 'bg-emerald-400'}`} style={{width: `${otherRisks.diabetes}%`}}></div></div>
                      </div>
                      <div>
                         <div className="flex justify-between text-sm mb-1">
                           <span className="text-secondary font-medium">Cardiovascular Disease Risk</span>
                           <span className={otherRisks.heart > 50 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>{otherRisks.heart}%</span>
                         </div>
                         <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden"><div className={`h-full ${otherRisks.heart > 50 ? 'bg-rose-400' : 'bg-emerald-400'}`} style={{width: `${otherRisks.heart}%`}}></div></div>
                      </div>
                    </div>
                    
                    <div className="mt-5 pt-5 border-t border-white/5">
                      <h5 className="text-xs font-bold text-primary mb-2 uppercase tracking-widest">Why This Matters</h5>
                      <p className="text-xs text-secondary leading-relaxed">
                        Women with irregular hormonal cycles are significantly more prone to severe metabolic shifts over a 10-year horizon.
                        An elevated future score indicates rising insulin resistance, which directly acts as a precursor for <strong>Type 2 Diabetes</strong> and accelerates <strong>Cardiovascular complications</strong> if left unmanaged.
                        <br/><br/>
                        <span className="text-accent">Intervention Tip:</span> Lowering your BMI by just 5% can reduce this future risk profile by up to 30%.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                        <span className="text-sm text-secondary block">Adiposity Index: <span className="text-primary font-bold">{otherRisks.obesity.replace(/_/g, ' ')}</span></span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Plan */}
            <div className="border border-accent/20 bg-accent/5 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-accent mb-4 uppercase tracking-wider">AI Intervention Protocol</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-primary rounded-xl border border-white/5 shadow-sm">
                    <h4 className="text-primary font-medium mb-1 text-sm">Nutrition</h4>
                    <p className="text-xs text-secondary leading-relaxed">{result.rules?.diet || "Adopt an anti-inflammatory, balanced diet."}</p>
                  </div>
                  <div className="p-4 bg-primary rounded-xl border border-white/5 shadow-sm">
                    <h4 className="text-primary font-medium mb-1 text-sm">Movement</h4>
                    <p className="text-xs text-secondary leading-relaxed">{result.rules?.exercise || "Establish a daily low-impact exercise routine."}</p>
                  </div>
                  <div className="p-4 bg-primary rounded-xl border border-white/5 shadow-sm">
                    <h4 className="text-primary font-medium mb-1 text-sm">Regulation</h4>
                    <p className="text-xs text-secondary leading-relaxed">{result.rules?.stress || "Integrate mindfulness to manage cortisol."}</p>
                  </div>
                </div>
                <div className="bg-primary p-4 rounded-xl border border-white/5 text-center">
                   <p className="text-sm text-secondary">
                     Primary Focus: <span className="text-primary font-medium">{result.lifestyleTip}</span>
                   </p>
                </div>
            </div>
            
            {/* Next Steps */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">Recommended Actions</h3>
              <div className="space-y-3">
                <div className="bg-tertiary border border-white/5 rounded-xl p-4 flex items-center justify-between group hover:border-white/10 transition-colors cursor-pointer" onClick={() => setActiveTab('tracker')}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary font-bold">1</div>
                    <div>
                      <h4 className="text-sm font-semibold text-primary">Establish Tracking Baseline</h4>
                      <p className="text-xs text-secondary">Log daily anomalies to train your personal AI model.</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-text-tertiary group-hover:text-primary transition-colors" />
                </div>
                
                <div className="bg-tertiary border border-white/5 rounded-xl p-4 flex items-center justify-between group hover:border-white/10 transition-colors cursor-pointer" onClick={() => setActiveTab('resources')}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary font-bold">2</div>
                    <div>
                      <h4 className="text-sm font-semibold text-primary">Review Medical Literature</h4>
                      <p className="text-xs text-secondary">Access evidence-based studies matching your profile.</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-text-tertiary group-hover:text-primary transition-colors" />
                </div>
                
                <div className="bg-tertiary border border-white/5 rounded-xl p-4 flex items-center justify-between group hover:border-white/10 transition-colors cursor-pointer" onClick={() => setActiveTab('doctors')}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary font-bold">3</div>
                    <div>
                      <h4 className="text-sm font-semibold text-primary">Schedule Consultation</h4>
                      <p className="text-xs text-secondary">Connect with board-certified specialists in your network.</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-text-tertiary group-hover:text-primary transition-colors" />
                </div>
              </div>
            </div>
            
            <div className="pt-6 text-center border-t border-white/5">
              <button 
                onClick={() => setActiveTab('profile')}
                className="btn-secondary"
              >
                Return to Patient Portal
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-24">
            <FileText size={48} className="text-text-tertiary mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-primary mb-2">Insufficient Clinical Data</h3>
            <p className="text-secondary mb-6 max-w-md mx-auto">Please complete your baseline assessment profile to generate an AI-powered diagnostic analysis.</p>
            <button 
              onClick={() => setActiveTab('assessment')}
              className="btn-primary"
            >
              Complete Baseline Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EarlyDetection;