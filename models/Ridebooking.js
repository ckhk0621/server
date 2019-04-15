const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fs = require('fs');

// Create Schema
const RideBookingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  passenger: {
    type: String,
    required: true
  },
  pickupLocation: {
    type: String,
    required: true
  },
  targetLocation: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  return: {
    type: String,
    required: true
  },
  numberOfGuest: {
    type: String
  },
  guest: {
    type: [String]
  },
  remark: {
    type: String
  },
  createdat: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'Pending'
  }
});

module.exports = Ridebooking = mongoose.model('ridebooking', RideBookingSchema);