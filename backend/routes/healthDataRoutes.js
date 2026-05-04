const express = require('express');
const router = express.Router();
const HealthData = require('../models/HealthData');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// @route   GET /api/health/data
// @desc    Get user's health data
// @access  Private
router.get('/data', verifyToken, async (req, res) => {
  try {
    let healthData = await HealthData.findOne({ user: req.userId });
    
    if (!healthData) {
      // Create new health data record if none exists
      healthData = await HealthData.create({
        user: req.userId,
        cycleData: [],
        symptoms: [],
        lifestyleFactors: {},
        riskAssessment: {}
      });
    }
    
    res.json(healthData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/health/cycle
// @desc    Add new cycle data
// @access  Private
router.post('/cycle', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate, symptoms, mood, notes } = req.body;
    
    let healthData = await HealthData.findOne({ user: req.userId });
    
    if (!healthData) {
      healthData = await HealthData.create({
        user: req.userId,
        cycleData: [],
        symptoms: [],
        lifestyleFactors: {},
        riskAssessment: {}
      });
    }
    
    healthData.cycleData.push({
      startDate,
      endDate,
      symptoms,
      mood,
      notes
    });
    
    // Add symptoms to the symptoms array if they don't already exist
    if (symptoms && symptoms.length > 0) {
      symptoms.forEach(symptom => {
        const existingSymptom = healthData.symptoms.find(s => s.name === symptom);
        if (!existingSymptom) {
          healthData.symptoms.push({
            name: symptom,
            severity: 5, // Default medium severity
            date: new Date()
          });
        }
      });
    }
    
    await healthData.save();
    
    res.status(201).json(healthData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/health/lifestyle
// @desc    Update lifestyle factors
// @access  Private
router.put('/lifestyle', verifyToken, async (req, res) => {
  try {
    const { exercise, diet, stress, sleep } = req.body;
    
    let healthData = await HealthData.findOne({ user: req.userId });
    
    if (!healthData) {
      healthData = await HealthData.create({
        user: req.userId,
        cycleData: [],
        symptoms: [],
        lifestyleFactors: {},
        riskAssessment: {}
      });
    }
    
    healthData.lifestyleFactors = {
      exercise: exercise !== undefined ? exercise : healthData.lifestyleFactors.exercise,
      diet: diet || healthData.lifestyleFactors.diet,
      stress: stress !== undefined ? stress : healthData.lifestyleFactors.stress,
      sleep: sleep !== undefined ? sleep : healthData.lifestyleFactors.sleep
    };
    
    await healthData.save();
    
    res.json(healthData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/health/symptoms
// @desc    Add new symptom
// @access  Private
router.post('/symptoms', verifyToken, async (req, res) => {
  try {
    const { name, severity } = req.body;
    
    let healthData = await HealthData.findOne({ user: req.userId });
    
    if (!healthData) {
      healthData = await HealthData.create({
        user: req.userId,
        cycleData: [],
        symptoms: [],
        lifestyleFactors: {},
        riskAssessment: {}
      });
    }
    
    healthData.symptoms.push({
      name,
      severity,
      date: new Date()
    });
    
    await healthData.save();
    
    res.status(201).json(healthData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/health/risk-assessment
// @desc    Calculate and save risk assessment
// @access  Private
router.post('/risk-assessment', verifyToken, async (req, res) => {
  try {
    const { age, bmi, symptoms, lifestyleFactors, familyHistory, diagnosedWithPCOS } = req.body;
    
    // Simple risk calculation algorithm
    let score = 0;
    const riskFactors = [];
    
    // Age factor (higher risk between 15-35)
    if (age >= 15 && age <= 35) {
      score += 10;
      riskFactors.push('Age between 15-35');
    }
    
    // BMI factor
    if (bmi >= 25) {
      score += 15;
      riskFactors.push('BMI above 25');
    }
    
    // Family history
    if (familyHistory) {
      score += 20;
      riskFactors.push('Family history of PCOS/PCOD');
    }
    
    // Already diagnosed
    if (diagnosedWithPCOS) {
      score += 30;
      riskFactors.push('Previous PCOS/PCOD diagnosis');
    }
    
    // Symptoms
    const highRiskSymptoms = ['Irregular periods', 'Excessive hair growth', 'Weight gain', 'Acne', 'Hair loss'];
    let symptomCount = 0;
    
    if (symptoms && symptoms.length > 0) {
      symptoms.forEach(symptom => {
        if (highRiskSymptoms.includes(symptom)) {
          symptomCount++;
        }
      });
      
      score += symptomCount * 5;
      
      if (symptomCount > 0) {
        riskFactors.push(`${symptomCount} PCOS-related symptoms`);
      }
    }
    
    // Lifestyle factors
    if (lifestyleFactors) {
      if (!lifestyleFactors.exercise) {
        score += 5;
        riskFactors.push('Sedentary lifestyle');
      }
      
      if (lifestyleFactors.stress && lifestyleFactors.stress > 7) {
        score += 5;
        riskFactors.push('High stress levels');
      }
      
      if (lifestyleFactors.sleep && lifestyleFactors.sleep < 6) {
        score += 5;
        riskFactors.push('Poor sleep habits');
      }
    }
    
    // Cap score at 100
    score = Math.min(score, 100);
    
    // Determine risk level
    let level;
    if (score < 30) {
      level = 'low';
    } else if (score < 60) {
      level = 'moderate';
    } else {
      level = 'high';
    }
    
    // Save risk assessment
    let healthData = await HealthData.findOne({ user: req.userId });
    
    if (!healthData) {
      healthData = await HealthData.create({
        user: req.userId,
        cycleData: [],
        symptoms: [],
        lifestyleFactors: {},
        riskAssessment: {}
      });
    }
    
    healthData.riskAssessment = {
      score,
      level,
      factors: riskFactors,
      lastUpdated: new Date()
    };
    
    await healthData.save();
    
    res.json({
      score,
      level,
      factors: riskFactors
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;