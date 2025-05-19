const mongoose = require('mongoose');

const tempUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name']
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide password']
  },
  role: {
    type: String,
    enum: ['admin', 'client', 'security'],
    default: 'client'
  },
  otp: {
    type: String,
    required: [true, 'OTP is required']
  },
  otpExpiry: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 900 // Automatically deletes after 15 minutes (900 seconds)
  }
});

module.exports = mongoose.model('TempUser', tempUserSchema);
