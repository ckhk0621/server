const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PhotoSchema = new Schema({
  gallery: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  title: {
    type: String,
  },
  images:{
    type: Array,
    data: Buffer
  },
  author: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Photo = mongoose.model('photo', PhotoSchema);