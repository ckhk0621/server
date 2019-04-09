const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fs = require('fs');

// Create Schema
const MemoSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String
  },
  public: {
    type: String,
    required: true
  },
  priority: {
    type: String
  },
  author: {
    type: String
  },
  images: {
    type: Array,
    data: Buffer
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Memo = mongoose.model('memo', MemoSchema);