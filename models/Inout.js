const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fs = require('fs');

// Create Schema
const InoutSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  title: {
    type: String,
    required: true
  },
  remark: {
    type: String
  },
  inout: {
    type: String
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