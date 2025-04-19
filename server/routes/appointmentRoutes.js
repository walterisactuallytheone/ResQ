const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const jwt = require('jsonwebtoken');

// Middleware to verify if user is logged in
const isAuthenticated = (req, res, next) => {
  console.log('Session data:', req.session);
  console.log('Is user logged in?', !!req.session.user);
  
  if (!req.session.user) {
    console.log('Authentication failed: No user in session');
    return res.status(401).json({ success: false, message: 'Please login to continue' });
  }
  console.log('User authenticated:', req.session.user._id);
  next();
};

// Create a new appointment
router.post('/', isAuthenticated, async (req, res) => {
  try {
    console.log('Received appointment data:', req.body);
    
    const {
      doctorName,
      speciality,
      appointmentDate,
      appointmentTime,
      location,
      notes,
      reminderDay,
      reminderHour
    } = req.body;

    console.log('Parsed fields:', { doctorName, speciality, appointmentDate, appointmentTime, location });

    // Validate required fields
    if (!doctorName || !speciality || !appointmentDate || !appointmentTime || !location) {
      console.log('Missing required fields:', { 
        doctorName: !!doctorName, 
        speciality: !!speciality, 
        appointmentDate: !!appointmentDate, 
        appointmentTime: !!appointmentTime, 
        location: !!location 
      });
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Create new appointment
    const appointment = new Appointment({
      doctorName,
      speciality,
      appointmentDate,
      appointmentTime,
      location,
      notes,
      user: req.session.user._id,
      reminderPreferences: {
        reminderDay: reminderDay === 'on' || reminderDay === true,
        reminderHour: reminderHour === 'on' || reminderHour === true
      }
    });

    console.log('Creating appointment object:', appointment);
    
    await appointment.save();
    console.log('Appointment saved successfully with ID:', appointment._id);
    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    console.error('Error creating appointment:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ success: false, message: 'Error creating appointment', error: error.message });
  }
});

// Get all appointments for the logged-in user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.session.user._id })
      .sort({ appointmentDate: 1, appointmentTime: 1 }); // Sort by date and time

    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ success: false, message: 'Error fetching appointments', error: error.message });
  }
});

// Get a specific appointment
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: req.session.user._id
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ success: false, message: 'Error fetching appointment', error: error.message });
  }
});

// Update an appointment
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const {
      doctorName,
      speciality,
      appointmentDate,
      appointmentTime,
      location,
      notes,
      reminderDay,
      reminderHour
    } = req.body;

    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, user: req.session.user._id },
      {
        doctorName,
        speciality,
        appointmentDate,
        appointmentTime,
        location,
        notes,
        reminderPreferences: {
          reminderDay: reminderDay === 'on' || reminderDay === true,
          reminderHour: reminderHour === 'on' || reminderHour === true
        }
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ success: false, message: 'Error updating appointment', error: error.message });
  }
});

// Delete an appointment
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndDelete({
      _id: req.params.id,
      user: req.session.user._id
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ success: false, message: 'Error deleting appointment', error: error.message });
  }
});

module.exports = router; 