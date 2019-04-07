const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fs = require('fs');

// Create Schema
const NoticeSchema = new Schema({
  user:{
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  public: {
    type: String,
    required: true
  },
  images:{
    type: String,
    data: Buffer
  },
  text:{
    type: String
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