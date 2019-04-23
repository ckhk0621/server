const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fs = require('fs');

// Create Schema
const InoutSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  staff: {
    type: String,
    required: true
  },
  type: {
    type: String
  },
  remark: {
    type: String
  },
  inout: {
    type: Array,
    required: true
  },
  author: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Inout = mongoose.model('inout', InoutSchema);