const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  medicationName: {
    type: String,
    required: true,
    trim: true
  },
  dosage: {
    type: String,
    required: true,
    trim: true
  },
  frequency: {
    type: String,
    required: true,
    trim: true
  },
  medicationTimes: {
    type: [String], // Store time as HH:MM format strings in an array
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: false
  },
  prescribedBy: {
    type: String,
    trim: true
  },
  instructions: {
    type: String,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reminderPreferences: {
    reminderAtTime: {
      type: Boolean,
      default: true
    },
    reminderBefore: {
      type: Boolean,
      default: true
    }
  },
  emailNotifications: {
    // Track email status for each medication time
    // Format: { "08:00": { atTimeSent: true, atTimeSentAt: Date, beforeSent: true, beforeSentAt: Date } }
    type: Map,
    of: {
      atTimeSent: { type: Boolean, default: false },
      atTimeSentAt: Date,
      beforeSent: { type: Boolean, default: false },
      beforeSentAt: Date
    },
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Medication = mongoose.model('Medication', medicationSchema);

module.exports = Medication; 