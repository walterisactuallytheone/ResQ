const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const reminderService = require('../services/reminderService');
const Appointment = require('../models/Appointment');
const emailService = require('../services/emailService');

// Middleware to verify if user is logged in
const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, message: 'Please login to continue' });
  }
  next();
};

// Get all reminders for the logged-in user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.session.user._id })
      .sort({ date: 1, time: 1 });
    res.status(200).json({ success: true, data: reminders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new reminder
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const reminder = new Reminder({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      time: req.body.time,
      userId: req.session.user._id,
    });
    
    const newReminder = await reminder.save();
    res.status(201).json({ success: true, data: newReminder });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update a reminder
router.patch('/:id', isAuthenticated, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.session.user._id },
      req.body,
      { new: true }
    );
    
    if (!reminder) {
      return res.status(404).json({ success: false, message: 'Reminder not found' });
    }
    
    res.status(200).json({ success: true, data: reminder });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete a reminder
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      userId: req.session.user._id
    });
    
    if (!reminder) {
      return res.status(404).json({ success: false, message: 'Reminder not found' });
    }
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send a test email reminder
router.post('/test-email', isAuthenticated, async (req, res) => {
  try {
    const result = await reminderService.sendTestEmail(req.session.user.email);
    
    if (result.success) {
      res.status(200).json({ 
        success: true, 
        message: 'Test email sent successfully',
        messageId: result.messageId
      });
    } else {
      throw new Error(result.error || 'Failed to send test email');
    }
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error sending test email', 
      error: error.message 
    });
  }
});

// Start the reminder scheduler
router.post('/start-scheduler', async (req, res) => {
  try {
    reminderService.startScheduler();
    res.status(200).json({ 
      success: true, 
      message: 'Reminder scheduler started'
    });
  } catch (error) {
    console.error('Error starting scheduler:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error starting scheduler', 
      error: error.message 
    });
  }
});

// Stop the reminder scheduler
router.post('/stop-scheduler', async (req, res) => {
  try {
    reminderService.stopScheduler();
    res.status(200).json({ 
      success: true, 
      message: 'Reminder scheduler stopped'
    });
  } catch (error) {
    console.error('Error stopping scheduler:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error stopping scheduler', 
      error: error.message 
    });
  }
});

// Check reminders immediately
router.post('/check-now', async (req, res) => {
  try {
    await reminderService.checkReminders();
    res.status(200).json({ 
      success: true, 
      message: 'Reminder check initiated'
    });
  } catch (error) {
    console.error('Error checking reminders:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error checking reminders', 
      error: error.message 
    });
  }
});

// Test appointment reminder email
router.post('/test-appointment-reminder', isAuthenticated, async (req, res) => {
  try {
    const user = req.session.user;
    
    // Get the user's appointments
    const appointments = await Appointment.find({ user: user._id })
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .limit(1);
    
    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No appointments found to test'
      });
    }
    
    const appointment = appointments[0];
    
    // Send test reminder emails for both types
    const dayResult = await emailService.sendAppointmentReminder(appointment, user, 'day');
    const hourResult = await emailService.sendAppointmentReminder(appointment, user, 'hour');
    
    res.status(200).json({ 
      success: true, 
      message: 'Test appointment reminders sent',
      dayReminder: dayResult,
      hourReminder: hourResult,
      appointmentDetails: {
        doctor: appointment.doctorName,
        date: appointment.appointmentDate,
        time: appointment.appointmentTime
      }
    });
  } catch (error) {
    console.error('Error sending test appointment reminders:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error sending test appointment reminders', 
      error: error.message 
    });
  }
});

module.exports = router;
