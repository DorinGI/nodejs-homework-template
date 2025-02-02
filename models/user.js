const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ['starter', 'pro', 'business'],
    default: 'starter',
  },
  avatarURL: {
    type: String,
  },
  token: {
    type: String,
    default: null,
  },
});

const User = model('User', userSchema);
module.exports = User;
