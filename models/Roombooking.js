const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fs = require('fs');

// Create Schema
const RoombookingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  reservation: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
  },
  content: {
    type: String,
  },
  remark: {
    type: String,
  },
  createdat: {
    type: Date,
    default: Date.now
  }
});

module.exports = Roombooking = mongoose.model('roombooking', RoombookingSchema);