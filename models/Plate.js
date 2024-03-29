const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PlateSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Plate = mongoose.model('plate', PlateSchema);