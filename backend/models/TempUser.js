const mongoose = require('mongoose');
const tempUserSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    otp: {
      type: String,
      required: true
    },
    otpExpiry: {
      type: Date,
      required: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  module.exports = mongoose.model('TempUser', tempUserSchema);
  
  