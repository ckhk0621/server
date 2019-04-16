const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fs = require('fs');

// Create Schema
const DestinationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  name: {
    type: String,
    required: true
  },
  remark: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Destination = mongoose.model('destination', DestinationSchema);