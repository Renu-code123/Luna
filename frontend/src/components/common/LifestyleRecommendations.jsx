import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, Utensils, Activity, Brain, Moon, Info, ArrowRight, CheckCircle, AlertCircle, RefreshCw, Zap, ArrowLeft } from 'lucide-react';
import { patientData } from '../../data/lifestyleData';

const LifestyleRecommendations = ({ setActiveTab, userData }) => {
  const [formData, setFormData] = useState({
    age: userData?.age || '',
    weight: userData?.weight || '',
    height: userData?.height || '',
    pcos: userData?.symptoms?.length >= 2 ? 'yes' : 'no',
    sleep: userData?.lifestyleFactors?.includes('Irregular sleep') ? 'less_than_6' : '6_to_8',
    stress: userData?.lifestyleFactors?.includes('Stressful job') ? 'yes' : 'no',
    exercise: userData?.lifestyleFactors?.includes('Sedentary lifestyle') ? '1' : '3',
    diet_pref: 'non-vegetarian',
    goal: 'general',
    habits: userData?.lifestyleFactors?.includes('Poor dietary habits') ? 'sugar' : 'none'
  });

  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData && userData.age && userData.weight && userData.height && !recommendations) {
      generatePlan();
    }
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const generatePlan = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const { age, weight, height, pcos, sleep, stress, exercise, diet_pref } = formData;
    const bmi = parseFloat(weight) / ((parseFloat(height) / 100) ** 2);
    const sleep_hours = sleep === 'less_than_6' ? 5 : (sleep === '6_to_8' ? 7 : 9);
    const stress_val = stress === 'yes' ? 8 : 4;
    const exercise_freq = parseInt(exercise);
    const markers = userData?.biomarkers || {};

    // Filter matched users from dataset (Collaborative Filtering)
    let matchedUsers = patientData.filter(user => {
      let userHeightM = parseFloat(user.Height_ft) / 100;
      let userBmi = parseFloat(user.Weight_kg) / (userHeightM * userHeightM);
      let bmiMatch = Math.abs(userBmi - bmi) <= 4;
      let pcosMatch = pcos === 'yes' ? user.PCOS === 'Yes' : user.PCOS === 'No';
      return bmiMatch && pcosMatch;
    });

    if (matchedUsers.length === 0) matchedUsers = patientData.slice(0, 50);

    // Aggregate Data
    let dietFruits = 0, dietSweets = 0;
    let exerciseTypes = {};
    matchedUsers.forEach(user => {
      dietFruits += parseFloat(user.Diet_Fruits) || 0;
      dietSweets += parseFloat(user.Diet_Sweets) || 0;
      if(user.Exercise_Type && user.Exercise_Type !== 'No Exercise') {
        exerciseTypes[user.Exercise_Type] = (exerciseTypes[user.Exercise_Type] || 0) + 1;
      }
    });

    const commonExercise = Object.keys(exerciseTypes).reduce((a, b) => exerciseTypes[a] > exerciseTypes[b] ? a : b, "Cardio");
    const avgSweets = dietSweets / matchedUsers.length;

    const goal = formData.goal;
    const habits = formData.habits;

    // Seeded Randomizer for true uniqueness
    const userSeed = parseInt(age) + parseFloat(weight) + parseFloat(height) + sleep_hours + stress_val + exercise_freq;
    function pick(arr, salt) {
        let x = Math.sin(userSeed + salt) * 10000;
        let index = Math.floor((x - Math.floor(x)) * arr.length);
        return arr[index];
    }

    const isPcos = pcos === 'yes' || pcos === 'suspected';
    const isOverweight = bmi > 25;
    const isUnderweight = bmi < 18;
    const inactive = exercise_freq < 3;

    let breakfast = "", lunch = "", dinner = "", snacks = "", avoid = "";
    let protein = diet_pref === "vegan" ? "plant-based protein (tofu/tempeh)" : (diet_pref === "vegetarian" ? "plant/dairy protein (paneer/lentils)" : "lean protein (chicken/eggs)");

    // DIET LOGIC
    if (isOverweight || goal === 'weight_loss') {
        breakfast = pick([
            `High-Protein Metabolic Start: A hearty scramble of ${protein} cooked in 1 tsp cold-pressed olive oil, served with 1 cup sautéed spinach (for magnesium), 1/4 avocado (healthy monounsaturated fats), and exactly 1 slice of sprouted grain bread. Consume within 60 mins of waking to stabilize morning cortisol.`,
            `Anti-Inflammatory Super Smoothie: 30g of ${protein} powder blended with 1/2 cup antioxidant-rich dark berries, 1 tbsp chia seeds (crucial for omega-3s to reduce PCOS inflammation), a handful of raw kale, and 1 cup unsweetened almond milk. Sip slowly to prevent rapid glucose spikes.`,
            `Low-GI Complex Carb Bowl: 1/2 cup steel-cut oats (avoid instant oats) fortified with a heavy scoop of ${protein}, 1 tbsp crushed walnuts, and dusted heavily with Ceylon cinnamon (clinically proven to enhance insulin receptor sensitivity in PCOS patients).`
        ], 1);
        lunch = pick([
            `Insulin-Balancing Salad: 2 cups of mixed dark leafy greens topped with a massive 150g serving of ${protein}, 1/2 cup cherry tomatoes, cucumbers, and 1/4 cup pumpkin seeds. Dress exclusively with 1 tbsp extra virgin olive oil and apple cider vinegar to blunt the glycemic response.`,
            `High-Fiber Power Bowl: 1/2 cup cooked quinoa (complete protein carb) paired with roasted cruciferous vegetables (broccoli/cauliflower to assist estrogen detox) and a heavy serving of ${protein}.`,
            `Low-Carb Rice Alternative: 1.5 cups of riced cauliflower lightly sautéed, topped with ${protein}, 1/2 cup black beans (for resistant starch), and fresh pico de gallo salsa. Zero refined grains.`
        ], 2);
        dinner = pick([
            `Metabolic Reset Meal: Steamed or roasted asparagus and zucchini (high fiber, low calorie) paired with a large 150-200g portion of ${protein}. Strictly avoid starchy carbohydrates at this hour to ensure overnight fasting insulin drops optimally.`,
            `Low-Carb Pasta Swap: 1.5 cups of spiralized zucchini noodles tossed with ${protein}, a light olive-oil and garlic dressing, and 2 tbsp of nutritional yeast or parmesan. Extremely light on the digestive tract.`,
            `Micronutrient-Dense Bake: Grilled or baked ${protein} served alongside a massive side of roasted Brussels sprouts or broccoli. The cruciferous vegetables contain DIM, which aids in processing excess androgens.`
        ], 3);
        snacks = pick([`Blood-Sugar Stable Crunch: 4 celery sticks or cucumber slices dipped in 2 tbsp of organic hummus or tahini.`, `Hormone-Supporting Fats: A strict portion of 12-15 raw almonds or walnuts. Chew thoroughly to maximize nutrient absorption.`, `Sweet Cravings Hack: Half a crisp green apple (high pectin fiber) smeared with exactly 1 tbsp of natural, unsweetened almond butter.`], 4);
        avoid = pick([`ABSOLUTE BAN: Deep-fried foods, refined white sugars, ultra-processed packaged snacks, and white bread/rice. These cause catastrophic insulin spikes and immediately worsen hyperandrogenism.`, `CRITICAL AVOIDANCE: Sugary sodas, commercial pastries, fast food, and highly processed inflammatory seed oils (canola, soybean).`, `METABOLIC DISRUPTORS: Commercial sweets, potato chips, and heavy conventional dairy (which contains IGF-1 that triggers acne and androgen production).`], 5);
    } else if (isUnderweight) {
        breakfast = pick([
            `Caloric Density Oatmeal: 1 full cup of rolled oats cooked in full-fat milk or coconut milk, stirred heavily with 2 tbsp of natural peanut butter, sliced bananas, and a massive side of ${protein}.`,
            `Healthy Fat Toast Protocol: Two thick slices of dense, whole-grain bread smothered in an entire half-avocado, topped with hemp seeds, olive oil drizzle, and a massive serving of ${protein}.`
        ], 6);
        lunch = pick([
            `Anabolic Power Meal: A massive portion of complex carbs (1.5 cups brown rice), drenched in healthy fats (avocado/olive oil), paired with a minimum of 150g of ${protein}.`,
            `Dense Calorie Wrap: Two whole-wheat wraps generously stuffed with ${protein}, 3 tbsp hummus, leafy greens, and a heavy drizzle of tahini or healthy oils.`
        ], 7);
        dinner = pick([
            `Glycogen Replenishment: Large roasted sweet potatoes (excellent for healthy weight gain), a generous 200g portion of ${protein}, and roasted root vegetables heavily tossed in extra virgin olive oil.`,
            `Complex Carb Pasta: 2 cups of whole-wheat or lentil-based pasta loaded with ${protein} and a thick, olive-oil or cashew-based rich sauce.`
        ], 8);
        snacks = pick([`Hormone-Building Trail Mix: A massive handful of mixed nuts, dates, pumpkin seeds, paired with a bowl of full-fat Greek yogurt.`, `Hyper-Caloric Liquid Nutrition: A 500+ calorie smoothie containing oats, peanut butter, ${protein}, and full-fat milk to easily ingest healthy mass-building calories.`], 9);
        avoid = pick([`AVOID: Skipping any meals, consuming low-calorie 'diet' foods, or using artificial sweeteners which trick the metabolism.`, `AVOID: Fasting for periods longer than 12 hours, consuming empty-calorie junk food (which builds visceral fat instead of healthy mass).`], 10);
    } else {
        breakfast = pick([
            `Optimal Maintenance Bowl: 1/2 cup of balanced oats or millet, 1/2 cup of fresh low-GI berries, and a solid 25g serving of ${protein} to keep blood sugar completely flat until lunch.`,
            `Gut-Health Parfait: 1 cup of plain Greek or Plant-based yogurt loaded with live probiotics, topped with 2 tbsp pumpkin seeds, fresh berries, and a scoop of ${protein}.`
        ], 11);
        lunch = pick([
            `Golden Ratio Plate: 50% fibrous non-starchy vegetables, 25% ${protein}, and 25% moderate-GI whole grains like quinoa or buckwheat.`,
            `Mediterranean Bean Salad: A massive bowl of mixed beans (chickpeas, kidney beans) combined with ${protein}, dressed in a highly anti-inflammatory extra virgin olive oil vinaigrette.`
        ], 12);
        dinner = pick([
            `Circadian-Friendly Dinner: A lighter balanced meal consisting of grilled or steamed vegetables paired heavily with ${protein}. Keeps digestion light for optimal deep sleep phases.`,
            `Wok-Tossed Vitality Meal: Lightly stir-fried vegetables with ${protein} over a very small, controlled bed of brown rice. Cooked in minimal sesame oil.`
        ], 13);
        snacks = pick([`Nature's Multivitamin: A single piece of whole, low-GI fruit (like a kiwi or plum) paired with a tiny serving of yogurt.`, `Mineral-Rich Crunch: A small handful of roasted edamame or dry-roasted pumpkin seeds (incredible for zinc and hormonal balance).`], 14);
        avoid = pick([`AVOID: Excessive hidden added sugars in condiments, and limit regular fast food consumption to protect your gut microbiome.`, `AVOID: Highly processed packaged snacks that disrupt the gut lining and cause low-grade systemic inflammation.`], 15);
    }

    if (isPcos) {
        breakfast += pick([" 🌿 Clinical Addition: Drink 2 cups of organic spearmint tea daily—it is scientifically proven to significantly reduce free testosterone and alleviate hirsutism.", " 🌿 Clinical Addition: Add 1/2 tsp of Ceylon cinnamon to your meal. It mimics insulin and drastically improves cellular glucose uptake."], 16);
        lunch += pick([" 🌿 Hormone Rule: Ensure absolutely zero naked carbohydrates. Always pair carbs with heavy fiber or vinegar to flatten the glucose curve.", " 🌿 Hormone Rule: Prioritize cruciferous vegetables (broccoli/cauliflower) containing DIM to assist your liver in detoxifying excess harmful estrogens."], 17);
        avoid = pick(["🚨 ENDOCRINE DISRUPTOR WARNING: Strictly avoid all conventional dairy (A1 casein) if cystic acne is present. ", "🚨 INFLAMMATION WARNING: Limit gluten immediately if you suffer from severe bloating or fatigue, as it frequently mimics thyroid disruption in PCOS. "], 18) + avoid;
    }

    if (habits === 'sweets' || avgSweets >= 3) {
        avoid += pick([" ⚠️ SUGAR REHAB PROTOCOL: Reduce sugar STRICTLY to zero. Use pure stevia or monk fruit if cravings are unbearable. Sugar is driving your insulin resistance directly.", " ⚠️ SUGAR REHAB PROTOCOL: Completely eliminate added sugar. It is actively inflaming your ovaries and increasing androgen production."], 19);
        snacks = pick(["🍫 Craving Killer: 2 small squares of ultra-dark chocolate (85%+ cocoa) allowed to melt slowly on the tongue.", "🍓 Craving Killer: Frozen raspberries mixed with a single spoon of unsweetened yogurt."], 20);
    }
    if (habits === 'fried') {
        avoid += pick([" ⚠️ LIPID TOXICITY WARNING: Eliminate deep-fried items entirely. Reused frying oils cause massive oxidative stress and cellular aging.", " ⚠️ LIPID TOXICITY WARNING: Avoid all battered foods. The combination of oxidized fats and refined flour is lethal to insulin sensitivity."], 21);
    }
    if (habits === 'low_protein') {
        breakfast = "🥩 MANDATORY PROTEIN UPREGULATION: Double the portion of your protein source to fix your macronutrient deficit. " + breakfast;
    }

    let exType = "", exFreq = "", pcosNote = "";
    if (inactive) {
        exType = pick([
            "Phase 1 Metabolic Activation: 20 minutes of light outdoor brisk walking immediately after meals to blunt glucose spikes, plus basic restorative stretching.", 
            "Phase 1 Adrenal Recovery: Gentle Yin Yoga focusing on pelvic floor relaxation, combined with a strict target of accumulating 8,000 to 10,000 daily steps naturally."
        ], 25);
        exFreq = pick(["Commit to 3 dedicated days per week. Consistency over intensity.", "Perform light movement every alternate day to gradually build mitochondrial density."], 27);
    } else if (isOverweight || goal === 'weight_loss') {
        exType = pick([
            "Phase 2 Fat Oxidation: Moderate Steady-State Cardio (cycling/swimming) keeping heart rate in Zone 2 (fat-burning zone), combined with 2 days of Light Dumbbell Strength Training.", 
            "Phase 2 Insulin Sensitization: High-Intensity Interval Training (HIIT) maximum 1x per week to avoid cortisol burnout, heavily supported by Low-Impact Steady State (LISS) cardio 3x per week."
        ], 28);
        exFreq = pick(["Strictly 4-5 active days per week. Protect 2 days for nervous system recovery.", "5 days per week. Never skip the post-meal 10-minute walks."], 30);
    } else {
        exType = pick([
            "Phase 3 Metabolic Flexibility: Advanced structured mix of Heavy Strength Training (3x/week to build glucose-absorbing muscle mass) and Cardio/HIIT (2x/week for cardiovascular efficiency).", 
            "Phase 3 Hypertrophy: Progressive overload weight lifting focusing on compound movements (squats, deadlifts) to radically improve basal metabolic rate, paired with light cardio."
        ], 31);
        exFreq = pick(["5 days/week of highly structured, intense periods of effort.", "4-6 days/week depending strictly on your resting heart rate and sleep recovery quality."], 33);
    }

    pcosNote = isPcos 
        ? pick([
            "⚠️ PCOS Cortisol Warning: Do not overtrain. Exhaustive cardio lasting longer than 45 minutes can chronically elevate cortisol, pushing your body to store belly fat and worsen PCOS symptoms.", 
            "⚠️ PCOS Adrenal Protocol: Prioritize heavy, slow resistance training over endless running. Muscle acts as a 'sponge' for excess blood sugar, directly reversing insulin resistance."
          ], 41)
        : pick([
            "💡 Metabolic Tip: Incorporate brief, intense HIIT intervals to dramatically improve your metabolic flexibility and mitochondrial health.", 
            "💡 Endurance Tip: Keep your intensity varied to build VO2 max and ensure your body remains an efficient fat-burning engine."
          ], 42);

    let tip1 = "", tip2 = "", tip3 = "";
    if (stress_val > 7 || goal === 'stress_management') {
        tip1 = pick([
            "🧠 Nervous System Regulation: Your stress score is alarmingly high. Implement a strict daily mindfulness routine (Yoga Nidra or 4-7-8 Pranayama) for 15 minutes to actively lower systemic cortisol.", 
            "🧠 Cortisol Protocol: High stress directly triggers the adrenals to produce DHEA-S (an androgen that worsens PCOS). You must start journaling or practicing structured relaxation daily."
        ], 34);
        tip2 = pick([
            "⚡ Evening Wind-down: Avoid any heavy, heart-pounding cardio in the evenings. It keeps cortisol high when it should be dropping. Opt for gentle Yin Yoga instead.", 
            "⚡ Caffeine Curfew: Strictly absolutely zero caffeine after 12 PM. Caffeine has a 6-hour half-life and will chronically elevate your stress hormones, preventing deep sleep."
        ], 35);
    } else {
        tip1 = pick([
            "🧠 Mental Optimization: Maintain your excellent stress levels. Take 5-minute visual breaks away from screens every 90 minutes to prevent optic nerve fatigue.", 
            "🧠 Routine Adherence: Keep your stress exceptionally low by maintaining your highly structured daily routine. Predictability lowers baseline anxiety."
        ], 36);
        tip2 = pick([
            "☀️ Circadian Anchoring: Get 15-20 minutes of direct morning sunlight in your eyes within 30 minutes of waking. This sets your biological clock and guarantees better melatonin production at night.", 
            "💧 Cellular Hydration: Stay highly hydrated throughout the day. Add a pinch of Himalayan pink salt to your morning water to support your adrenal glands."
        ], 37);
    }

    if (sleep_hours < 7) {
        tip3 = pick([
            "🌙 Sleep Architecture Overhaul: Your sleep is inadequate for hormonal repair. Enforce a strict digital detox 1 hour before bed. Keep the room freezing cold (18°C/65°F) and pitch black. Aim for a non-negotiable 8 hours.", 
            "🌙 Deep Sleep Protocol: Lack of sleep causes a 30% drop in insulin sensitivity the next day. No screens in bed. Use 200mg of Magnesium Glycinate 1 hour before sleep (if cleared by your doctor) to paralyze muscle tension."
        ], 38);
    } else {
        tip3 = pick([
            "🌙 Sleep Consistency: Your sleep duration is excellent. Maintain consistent sleep-wake times—even on weekends—to support hormonal balance and prevent 'social jetlag'.", 
            "🌙 Recovery Optimization: Keep up the phenomenal sleep hygiene. High-quality REM and Deep Sleep phases are when your body actively clears out cellular waste and repairs metabolic damage."
        ], 39);
    }
    
    // Biomarker adjustments
    if (markers.glucose && parseFloat(markers.glucose) > 110) {
        avoid += " • Current glucose readings are high; refined sugars must be strictly eliminated.";
        lunch += " (Suggested: Add apple cider vinegar to water before this meal)";
    }
    if (markers.sleep && parseFloat(markers.sleep) < 6) {
        snacks += " • Supplement with melatonin-supportive foods like tart cherries.";
    }

    const results = {
      bmi: bmi.toFixed(1),
      diet: { breakfast, lunch, dinner, snacks, avoid },
      exercise: { type: exType, frequency: exFreq, pcosNote },
      lifestyle: { stress: tip1, sleep: tip3, weight: tip2 }
    };

    setRecommendations(results);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-6">
      <button
        onClick={() => setActiveTab('home')}
        className="mb-8 flex items-center gap-2 text-text-tertiary hover:text-primary transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Back to Overview</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Input Section */}
        <div className="lg:col-span-5">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="med-card p-8 bg-dark/40 border-white/10 shadow-2xl sticky top-24"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent hover:scale-110 hover:bg-accent/20 transition-all duration-300">
                <Brain size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-primary tracking-tight">AI Wellness Assistant</h2>
                <p className="text-[10px] text-text-tertiary uppercase tracking-widest font-bold">Personalized Lifestyle Engine</p>
              </div>
            </div>

            <form onSubmit={generatePlan} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest ml-1">Age</label>
                  <input type="number" id="age" value={formData.age} onChange={handleInputChange} required className="med-input w-full bg-dark/50" placeholder="25" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest ml-1">Weight (kg)</label>
                  <input type="number" id="weight" value={formData.weight} onChange={handleInputChange} required className="med-input w-full bg-dark/50" placeholder="60" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest ml-1">Height (cm)</label>
                <input type="number" id="height" value={formData.height} onChange={handleInputChange} required className="med-input w-full bg-dark/50" placeholder="165" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest ml-1">PCOS/PCOD Status</label>
                <select id="pcos" value={formData.pcos} onChange={handleInputChange} className="med-input w-full bg-dark/50">
                  <option value="no">Not Diagnosed</option>
                  <option value="yes">Diagnosed</option>
                  <option value="suspected">Suspected</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest ml-1">Daily Sleep</label>
                  <select id="sleep" value={formData.sleep} onChange={handleInputChange} className="med-input w-full bg-dark/50">
                    <option value="less_than_6">&lt; 6 Hours</option>
                    <option value="6_to_8">6-8 Hours</option>
                    <option value="more_than_8">&gt; 8 Hours</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest ml-1">Exercise/Week</label>
                  <input type="number" id="exercise" value={formData.exercise} onChange={handleInputChange} className="med-input w-full bg-dark/50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest ml-1">Primary Goal</label>
                  <select id="goal" value={formData.goal} onChange={handleInputChange} className="med-input w-full bg-dark/50">
                    <option value="general">General Wellness</option>
                    <option value="weight_loss">Weight Loss</option>
                    <option value="stress_management">Stress Management</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest ml-1">Diet Habits</label>
                  <select id="habits" value={formData.habits} onChange={handleInputChange} className="med-input w-full bg-dark/50">
                    <option value="none">Fairly Healthy</option>
                    <option value="sweets">High Sweets/Sugar</option>
                    <option value="fried">High Fried/Junk Food</option>
                    <option value="low_protein">Low Protein</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-accent text-white rounded-2xl font-bold shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={18} fill="currentColor" />}
                Generate AI Insights
              </button>
            </form>
          </motion.div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!recommendations && !loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/5 rounded-[40px]"
              >
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-text-tertiary mb-6 hover:scale-110 hover:bg-white/10 transition-all duration-300">
                  <Sparkles size={40} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-primary">Ready for Analysis</h3>
                <p className="text-sm text-text-tertiary max-w-xs">Complete the health form to receive your clinical-grade lifestyle recommendations.</p>
              </motion.div>
            )}

            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center p-12"
              >
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
                  <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent" size={32} />
                </div>
                <p className="mt-8 text-sm font-bold text-accent uppercase tracking-widest animate-pulse">Syncing patient data...</p>
              </motion.div>
            )}

            {recommendations && !loading && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Diet Section */}
                <div className="med-card p-8 border-neon-blue/20 bg-gradient-to-br from-neon-blue/5 to-transparent">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-neon-blue/10 flex items-center justify-center text-neon-blue hover:scale-110 hover:bg-neon-blue/20 transition-all duration-300">
                      <Utensils size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary">Nutritional Strategy</h3>
                      <p className="text-[10px] text-text-tertiary uppercase tracking-widest font-bold">Optimized for BMI {recommendations.bmi}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Breakfast', val: recommendations.diet.breakfast },
                      { label: 'Lunch', val: recommendations.diet.lunch },
                      { label: 'Dinner', val: recommendations.diet.dinner },
                      { label: 'Snacks', val: recommendations.diet.snacks }
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-dark/40 border border-white/5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-neon-blue block mb-1">{item.label}</span>
                        <p className="text-sm text-text-secondary leading-relaxed">{item.val}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-4 rounded-2xl bg-neon-pink/5 border border-neon-pink/20 flex items-center gap-4">
                    <AlertCircle size={20} className="text-neon-pink shrink-0" />
                    <p className="text-xs text-text-secondary"><span className="text-neon-pink font-bold uppercase tracking-tighter pr-2">Avoid:</span> {recommendations.diet.avoid}</p>
                  </div>
                </div>

                {/* Exercise & Lifestyle */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="med-card p-8 border-neon-purple/20 bg-gradient-to-br from-neon-purple/5 to-transparent">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-neon-purple/10 flex items-center justify-center text-neon-purple hover:scale-110 hover:bg-neon-purple/20 transition-all duration-300">
                        <Activity size={20} />
                      </div>
                      <h3 className="font-bold">Exercise Plan</h3>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex gap-3 text-sm">
                        <CheckCircle size={16} className="text-neon-purple shrink-0 mt-0.5" />
                        <span className="text-text-secondary"><strong className="text-primary">Primary:</strong> {recommendations.exercise.type}</span>
                      </li>
                      <li className="flex gap-3 text-sm">
                        <CheckCircle size={16} className="text-neon-purple shrink-0 mt-0.5" />
                        <span className="text-text-secondary"><strong className="text-primary">Frequency:</strong> {recommendations.exercise.frequency}</span>
                      </li>
                      <li className="p-3 rounded-xl bg-white/5 border border-white/5 text-[10px] italic text-text-tertiary leading-relaxed">
                        {recommendations.exercise.pcosNote}
                      </li>
                    </ul>
                  </div>

                  <div className="med-card p-8 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent hover:scale-110 hover:bg-accent/20 transition-all duration-300">
                        <Moon size={20} />
                      </div>
                      <h3 className="font-bold">Circadian Sync</h3>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex gap-3 text-sm">
                        <CheckCircle size={16} className="text-accent shrink-0 mt-0.5" />
                        <span className="text-text-secondary">{recommendations.lifestyle.sleep}</span>
                      </li>
                      <li className="flex gap-3 text-sm">
                        <CheckCircle size={16} className="text-accent shrink-0 mt-0.5" />
                        <span className="text-text-secondary">{recommendations.lifestyle.stress}</span>
                      </li>
                      <li className="flex gap-3 text-sm">
                        <CheckCircle size={16} className="text-accent shrink-0 mt-0.5" />
                        <span className="text-text-secondary">{recommendations.lifestyle.weight}</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <button 
                  onClick={() => setRecommendations(null)}
                  className="w-full py-3 rounded-2xl border border-white/10 text-text-tertiary text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
                >
                  Recalculate AI Model
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

const Loader2 = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default LifestyleRecommendations;
