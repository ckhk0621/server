const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fs = require('fs');

// Create Schema
const RideBookingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  orderBy: {
    type: String,
    required: true
  },
  passenger: {
    type: [String]
  },
  pickupLocation: {
    type: String,
    required: true
  },
  plate:{
    type: String
  },
  targetLocation: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: Date,
  },
  return: {
    type: String,
    required: true
  },
  driver: {
    type: String,
  },
  numberOfGuest: {
    type: Number
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
  },
  children: {
    type: [Object]
  },
  emailSent:{
    type: String,
    default: 'false'
  },
  rowKey:{
    type: Number
  }
});

module.exports = Ridebooking = mongoose.model('ridebooking', RideBookingSchema);