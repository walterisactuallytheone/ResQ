const express = require('express');
const router = express.Router();
const Medication = require('../models/Medication');

// Middleware to verify if user is logged in
const isAuthenticated = (req, res, next) => {
  console.log('Session data in medication routes:', req.session);
  console.log('Is user logged in?', !!req.session.user);
  
  if (!req.session.user) {
    console.log('Authentication failed: No user in session');
    return res.status(401).json({ success: false, message: 'Please login to continue' });
  }
  console.log('User authenticated:', req.session.user._id);
  next();
};

// Create a new medication
router.post('/', isAuthenticated, async (req, res) => {
  try {
    console.log('Received medication data:', req.body);
    
    const {
      medicationName,
      dosage,
      frequency,
      medicationTimes,
      startDate,
      endDate,
      prescribedBy,
      instructions,
      reminderAtTime,
      reminderBefore
    } = req.body;

    // Validate required fields
    if (!medicationName || !dosage || !frequency || !medicationTimes || !startDate) {
      console.log('Missing required fields:', { 
        medicationName: !!medicationName, 
        dosage: !!dosage, 
        frequency: !!frequency, 
        medicationTimes: !!medicationTimes && medicationTimes.length > 0, 
        startDate: !!startDate 
      });
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Create new medication
    const medication = new Medication({
      medicationName,
      dosage,
      frequency,
      medicationTimes: Array.isArray(medicationTimes) ? medicationTimes : [medicationTimes],
      startDate,
      endDate: endDate || null,
      prescribedBy,
      instructions,
      user: req.session.user._id,
      reminderPreferences: {
        reminderAtTime: reminderAtTime === 'on' || reminderAtTime === '1' || reminderAtTime === true,
        reminderBefore: reminderBefore === 'on' || reminderBefore === '1' || reminderBefore === true
      }
    });

    console.log('Creating medication object:', medication);
    
    await medication.save();
    console.log('Medication saved successfully with ID:', medication._id);
    res.status(201).json({ success: true, data: medication });
  } catch (error) {
    console.error('Error creating medication:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ success: false, message: 'Error creating medication', error: error.message });
  }
});

// Get all medications for the logged-in user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const medications = await Medication.find({ user: req.session.user._id })
      .sort({ createdAt: -1 }); // Sort by creation date, newest first

    res.status(200).json({ success: true, data: medications });
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({ success: false, message: 'Error fetching medications', error: error.message });
  }
});

// Get a specific medication
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const medication = await Medication.findOne({
      _id: req.params.id,
      user: req.session.user._id
    });

    if (!medication) {
      return res.status(404).json({ success: false, message: 'Medication not found' });
    }

    res.status(200).json({ success: true, data: medication });
  } catch (error) {
    console.error('Error fetching medication:', error);
    res.status(500).json({ success: false, message: 'Error fetching medication', error: error.message });
  }
});

// Update a medication
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const {
      medicationName,
      dosage,
      frequency,
      medicationTimes,
      startDate,
      endDate,
      prescribedBy,
      instructions,
      reminderAtTime,
      reminderBefore
    } = req.body;

    // Ensure medication times is an array
    const timesArray = Array.isArray(medicationTimes) ? medicationTimes : [medicationTimes];

    const medication = await Medication.findOneAndUpdate(
      { _id: req.params.id, user: req.session.user._id },
      {
        medicationName,
        dosage,
        frequency,
        medicationTimes: timesArray,
        startDate,
        endDate: endDate || null,
        prescribedBy,
        instructions,
        reminderPreferences: {
          reminderAtTime: reminderAtTime === 'on' || reminderAtTime === '1' || reminderAtTime === true,
          reminderBefore: reminderBefore === 'on' || reminderBefore === '1' || reminderBefore === true
        }
      },
      { new: true }
    );

    if (!medication) {
      return res.status(404).json({ success: false, message: 'Medication not found' });
    }

    res.status(200).json({ success: true, data: medication });
  } catch (error) {
    console.error('Error updating medication:', error);
    res.status(500).json({ success: false, message: 'Error updating medication', error: error.message });
  }
});

// Delete a medication
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const medication = await Medication.findOneAndDelete({
      _id: req.params.id,
      user: req.session.user._id
    });

    if (!medication) {
      return res.status(404).json({ success: false, message: 'Medication not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting medication:', error);
    res.status(500).json({ success: false, message: 'Error deleting medication', error: error.message });
  }
});

module.exports = router; 