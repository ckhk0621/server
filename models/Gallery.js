const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const GallerySchema = new Schema({
  title: {
    type: String,
    unique: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  year: {
    type: Date,
  },
  description: {
    type: String
  },
  author: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  images: [],
});

module.exports = Gallery = mongoose.model('gallery', GallerySchema);