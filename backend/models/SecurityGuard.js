const mongoose = require('mongoose');

const securityGuardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'assigned', 'on-leave'],
    default: 'available'
  },
  experience: {
    type: Number,
    required: true
  },
  specialization: [{
    type: String,
    enum: ['residential', 'corporate', 'event', 'personal']
  }],
  currentAssignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    default: null
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: [{
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client'
    },
    rating: Number,
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }]
});

module.exports = mongoose.model('SecurityGuard', securityGuardSchema);