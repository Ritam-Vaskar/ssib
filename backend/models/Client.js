const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  serviceType: {
    type: String,
    enum: ['residential', 'corporate', 'event', 'personal'],
    required: true
  },
  activeAssignments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment'
  }],
  billingInfo: {
    accountName: String,
    accountNumber: String,
    bankName: String
  }
});

module.exports = mongoose.model('Client', clientSchema);