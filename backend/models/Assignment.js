const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  guard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SecurityGuard',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  location: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  shift: {
    type: String,
    enum: ['day', 'night', '24h'],
    required: true
  },
  requirements: String,
  reports: [{
    date: Date,
    content: String,
    status: String
  }]
});

module.exports = mongoose.model('Assignment', assignmentSchema);