const mongoose = require('mongoose');

const HealthDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cycleData: [{
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date
    },
    symptoms: [{
      type: String
    }],
    mood: {
      type: String,
      enum: ['excellent', 'good', 'neutral', 'poor', 'very-poor']
    },
    notes: {
      type: String
    }
  }],
  symptoms: [{
    name: {
      type: String,
      required: true
    },
    severity: {
      type: Number,
      min: 1,
      max: 10
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  lifestyleFactors: {
    exercise: {
      type: Boolean,
      default: false
    },
    diet: {
      type: String,
      enum: ['balanced', 'vegetarian', 'vegan', 'keto', 'other']
    },
    stress: {
      type: Number,
      min: 1,
      max: 10
    },
    sleep: {
      type: Number,
      min: 0,
      max: 24
    }
  },
  riskAssessment: {
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    level: {
      type: String,
      enum: ['low', 'moderate', 'high']
    },
    factors: [{
      type: String
    }],
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HealthData', HealthDataSchema);