const mongoose = require('mongoose');

const ambulanceSchema = new mongoose.Schema({
  ambulanceType: {
    type: String,
    required: true,
    enum: ['Basic', 'Advanced', 'Cardiac', 'Neonatal']
  },
  emergencyType: {
    type: String,
    required: true,
    enum: ['Cardiac', 'Accident', 'Breathing', 'Pregnancy', 'Other']
  },
  patientName: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  pickupAddress: {
    type: String,
    required: true
  },
  pickupLatitude: {
    type: Number,
    required: true
  },
  pickupLongitude: {
    type: Number,
    required: true
  },
  landmark: {
    type: String
  },
  destinationAddress: {
    type: String
  },
  destinationLatitude: {
    type: Number
  },
  destinationLongitude: {
    type: Number
  },
  additionalInfo: {
    type: String
  },
  status: {
    type: String,
    enum: ['Pending', 'Dispatched', 'InProgress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  estimatedArrivalTime: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Update the updatedAt field on save
ambulanceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Ambulance = mongoose.model('Ambulance', ambulanceSchema);

module.exports = Ambulance; 