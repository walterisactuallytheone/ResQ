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
      reminderHour,
      reminderAtTime
    } = req.body;

    console.log('Parsed fields:', { 
      doctorName, 
      speciality, 
      appointmentDate, 
      appointmentTime, 
      location,
      reminderDay,
      reminderHour,
      reminderAtTime
    });

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

    // Handle checkbox values - convert any truthy values to true
    const reminderDayValue = reminderDay === '1' || reminderDay === 'on' || reminderDay === 'true' || reminderDay === true;
    const reminderHourValue = reminderHour === '1' || reminderHour === 'on' || reminderHour === 'true' || reminderHour === true;
    const reminderAtTimeValue = reminderAtTime === '1' || reminderAtTime === 'on' || reminderAtTime === 'true' || reminderAtTime === true;
    
    console.log('Processed reminder preferences:', { 
      reminderDay: reminderDayValue, 
      reminderHour: reminderHourValue,
      reminderAtTime: reminderAtTimeValue
    });

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
        reminderDay: reminderDayValue,
        reminderHour: reminderHourValue,
        reminderAtTime: reminderAtTimeValue
      },
      emailNotifications: {
        dayBefore: { sent: false },
        hourBefore: { sent: false },
        atTime: { sent: false }
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

    // Ensure all appointments have emailNotifications and reminderPreferences
    const processedAppointments = appointments.map(appointment => {
      const appointmentObj = appointment.toObject();
      
      // Ensure reminderPreferences exists
      if (!appointmentObj.reminderPreferences) {
        appointmentObj.reminderPreferences = {
          reminderDay: true,
          reminderHour: true,
          reminderAtTime: true
        };
      } else if (appointmentObj.reminderPreferences.reminderAtTime === undefined) {
        // Add reminderAtTime if it doesn't exist
        appointmentObj.reminderPreferences.reminderAtTime = true;
      }
      
      // Ensure emailNotifications exists
      if (!appointmentObj.emailNotifications) {
        appointmentObj.emailNotifications = {
          dayBefore: { sent: false },
          hourBefore: { sent: false },
          atTime: { sent: false }
        };
      } else {
        // Make sure dayBefore and hourBefore exist
        if (!appointmentObj.emailNotifications.dayBefore) {
          appointmentObj.emailNotifications.dayBefore = { sent: false };
        }
        if (!appointmentObj.emailNotifications.hourBefore) {
          appointmentObj.emailNotifications.hourBefore = { sent: false };
        }
        if (!appointmentObj.emailNotifications.atTime) {
          appointmentObj.emailNotifications.atTime = { sent: false };
        }
      }
      
      return appointmentObj;
    });

    console.log(`Returning ${processedAppointments.length} appointments`);
    
    res.status(200).json({ success: true, data: processedAppointments });
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
      reminderHour,
      reminderAtTime
    } = req.body;

    console.log('Update appointment data:', { 
      doctorName, 
      speciality, 
      appointmentDate, 
      appointmentTime, 
      location,
      reminderDay,
      reminderHour,
      reminderAtTime
    });

    // Get the current appointment
    const currentAppointment = await Appointment.findOne({
      _id: req.params.id,
      user: req.session.user._id
    });

    if (!currentAppointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Handle checkbox values - convert any truthy values to true
    const reminderDayValue = reminderDay === '1' || reminderDay === 'on' || reminderDay === 'true' || reminderDay === true;
    const reminderHourValue = reminderHour === '1' || reminderHour === 'on' || reminderHour === 'true' || reminderHour === true;
    const reminderAtTimeValue = reminderAtTime === '1' || reminderAtTime === 'on' || reminderAtTime === 'true' || reminderAtTime === true;
    
    console.log('Processed reminder preferences:', { 
      reminderDay: reminderDayValue, 
      reminderHour: reminderHourValue,
      reminderAtTime: reminderAtTimeValue
    });

    // Create update object
    const updateData = {
      doctorName,
      speciality,
      appointmentDate,
      appointmentTime,
      location,
      notes,
      reminderPreferences: {
        reminderDay: reminderDayValue,
        reminderHour: reminderHourValue,
        reminderAtTime: reminderAtTimeValue
      }
    };

    // Reset email notifications if date or time changes
    if (appointmentDate !== currentAppointment.appointmentDate.toISOString() || 
        appointmentTime !== currentAppointment.appointmentTime) {
      updateData.emailNotifications = {
        dayBefore: { sent: false },
        hourBefore: { sent: false },
        atTime: { sent: false }
      };
      console.log('Reset email notifications due to date/time change');
    } else if (!currentAppointment.emailNotifications || 
              !currentAppointment.emailNotifications.dayBefore ||
              !currentAppointment.emailNotifications.hourBefore ||
              !currentAppointment.emailNotifications.atTime) {
      updateData.emailNotifications = {
        dayBefore: { sent: false },
        hourBefore: { sent: false },
        atTime: { sent: false }
      };
      console.log('Set default email notifications because they were missing');
    }

    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, user: req.session.user._id },
      updateData,
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