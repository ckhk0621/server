const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const NoticeSchema = new Schema({
  user:{
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  text:{
    type: String,
    required: true
  },
  name: {
    type: String
  },
  avator:{
    type: String
  },
  likes: [
    {
      user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  comments: [
    {
      user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avator:{
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Notice = mongoose.model('notice', NoticeSchema);