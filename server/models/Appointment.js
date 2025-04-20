const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctorName: {
    type: String,
    required: true,
    trim: true
  },
  speciality: {
    type: String, 
    required: true,
    trim: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reminderPreferences: {
    reminderDay: {
      type: Boolean,
      default: true
    },
    reminderHour: {
      type: Boolean,
      default: true
    },
    reminderAtTime: {
      type: Boolean,
      default: true
    }
  },
  emailNotifications: {
    dayBefore: {
      sent: { type: Boolean, default: false },
      sentAt: Date
    },
    hourBefore: {
      sent: { type: Boolean, default: false },
      sentAt: Date
    },
    atTime: {
      sent: { type: Boolean, default: false },
      sentAt: Date
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment; 