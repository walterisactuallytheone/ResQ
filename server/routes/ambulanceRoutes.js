const express = require('express');
const router = express.Router();
const Ambulance = require('../models/ambulanceModel');

// @route   POST /api/ambulance/book
// @desc    Book a new ambulance
// @access  Public
router.post('/book', async (req, res) => {
  try {
    const {
      ambulanceType,
      emergencyType,
      patientName,
      contactNumber,
      pickupAddress,
      pickupLatitude,
      pickupLongitude,
      landmark,
      destinationAddress,
      destinationLatitude,
      destinationLongitude,
      additionalInfo
    } = req.body;

    // Check required fields
    if (!ambulanceType || !emergencyType || !patientName || !contactNumber || !pickupAddress || !pickupLatitude || !pickupLongitude) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Create new ambulance booking
    const newAmbulance = new Ambulance({
      ambulanceType,
      emergencyType,
      patientName,
      contactNumber,
      pickupAddress,
      pickupLatitude,
      pickupLongitude,
      landmark,
      destinationAddress,
      destinationLatitude,
      destinationLongitude,
      additionalInfo,
      // Associate with user if logged in
      userId: req.session.user ? req.session.user._id : null
    });

    // Calculate estimated arrival time (10 minutes from now for emergency)
    const estimatedArrival = new Date();
    estimatedArrival.setMinutes(estimatedArrival.getMinutes() + 10);
    newAmbulance.estimatedArrivalTime = estimatedArrival;

    // Save to database
    await newAmbulance.save();

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'Ambulance booked successfully',
      data: {
        bookingId: newAmbulance._id,
        estimatedArrival: newAmbulance.estimatedArrivalTime
      }
    });
  } catch (error) {
    console.error('Error booking ambulance:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/ambulance/bookings
// @desc    Get user's ambulance bookings
// @access  Private
router.get('/bookings', async (req, res) => {
  try {
    // Check if user is logged in
    if (!req.session.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Find bookings for this user
    const bookings = await Ambulance.find({ userId: req.session.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching ambulance bookings:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/ambulance/status/:id
// @desc    Get status of a specific ambulance booking
// @access  Public (with booking ID)
router.get('/status/:id', async (req, res) => {
  try {
    const booking = await Ambulance.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    return res.status(200).json({
      success: true,
      data: {
        status: booking.status,
        estimatedArrival: booking.estimatedArrivalTime,
        patientName: booking.patientName,
        ambulanceType: booking.ambulanceType
      }
    });
  } catch (error) {
    console.error('Error fetching ambulance status:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/ambulance/cancel/:id
// @desc    Cancel an ambulance booking
// @access  Public (with booking ID)
router.post('/cancel/:id', async (req, res) => {
  try {
    const booking = await Ambulance.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check if the booking can be cancelled
    if (booking.status === 'Completed') {
      return res.status(400).json({ success: false, message: 'Cannot cancel a completed booking' });
    }

    // Update booking status
    booking.status = 'Cancelled';
    booking.updatedAt = Date.now();
    await booking.save();

    return res.status(200).json({
      success: true,
      message: 'Ambulance booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error cancelling ambulance booking:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/ambulance/complete/:id
// @desc    Mark an ambulance booking as complete
// @access  Public (with booking ID)
router.post('/complete/:id', async (req, res) => {
  try {
    const booking = await Ambulance.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check if the booking can be completed
    if (booking.status === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Cannot complete a cancelled booking' });
    }

    // Update booking status
    booking.status = 'Completed';
    booking.updatedAt = Date.now();
    await booking.save();

    return res.status(200).json({
      success: true,
      message: 'Ambulance booking completed successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error completing ambulance booking:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router; 