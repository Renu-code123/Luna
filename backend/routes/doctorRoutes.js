const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
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

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/doctors/nearby
// @desc    Get nearby doctors based on location
// @access  Private
router.get('/nearby', verifyToken, async (req, res) => {
  try {
    const { lat, lng, radius = 10, specialty } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    
    // Convert to numbers
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const searchRadius = parseFloat(radius);
    
    // Find doctors within radius
    // Note: In a real app, you would use MongoDB's geospatial queries
    // For simplicity, we'll just return all doctors and filter on the client side
    let query = {};
    
    if (specialty) {
      query.specialty = specialty;
    }
    
    const doctors = await Doctor.find(query);
    
    // Filter doctors based on distance (simplified approach)
    const nearbyDoctors = doctors.filter(doctor => {
      if (!doctor.location.coordinates || !doctor.location.coordinates.lat || !doctor.location.coordinates.lng) {
        return false;
      }
      
      // Calculate distance using Haversine formula (simplified)
      const R = 6371; // Earth's radius in km
      const dLat = (doctor.location.coordinates.lat - latitude) * Math.PI / 180;
      const dLng = (doctor.location.coordinates.lng - longitude) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(latitude * Math.PI / 180) * Math.cos(doctor.location.coordinates.lat * Math.PI / 180) * 
        Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      return distance <= searchRadius;
    });
    
    res.json(nearbyDoctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/doctors/:id
// @desc    Get doctor by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/doctors/:id/reviews
// @desc    Add review for a doctor
// @access  Private
router.post('/:id/reviews', verifyToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // Check if user already reviewed this doctor
    const alreadyReviewed = doctor.reviews.find(
      review => review.user.toString() === req.userId
    );
    
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Doctor already reviewed' });
    }
    
    const review = {
      user: req.userId,
      rating: Number(rating),
      comment,
      date: new Date()
    };
    
    doctor.reviews.push(review);
    
    // Update average rating
    doctor.rating = doctor.reviews.reduce((acc, item) => item.rating + acc, 0) / doctor.reviews.length;
    
    await doctor.save();
    
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/doctors
// @desc    Add a new doctor (admin only in a real app)
// @access  Public (for demo purposes)
router.post('/', async (req, res) => {
  try {
    const {
      name,
      specialty,
      location,
      contact,
      specializations,
      acceptingNewPatients
    } = req.body;
    
    const doctor = await Doctor.create({
      name,
      specialty,
      location,
      contact,
      specializations,
      acceptingNewPatients
    });
    
    res.status(201).json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;