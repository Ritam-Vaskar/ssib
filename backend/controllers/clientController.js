const Client = require('../models/Client');
const Assignment = require('../models/Assignment');
const Bill = require('../models/Bill');
const Application = require('../models/Application');

// Get client profile
exports.getProfile = async (req, res) => {
  try {
    const client = await Client.findOne({ user: req.user.id })
      .populate('activeAssignments');
    res.status(200).json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// Get bills
exports.getBills = async (req, res) => {
  try {
    const client = await Client.findOne({ user: req.user.id });
    const bills = await Bill.find({ client: client._id })
      .populate('assignment');
    res.status(200).json({ success: true, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Submit application
exports.submitApplication = async (req, res) => {
  try {
    const { serviceType, location, startDate, endDate, numberOfGuards, additionalDetails } = req.body;

    const application = await Application.create({
      user: req.user.id,
      serviceType,
      location,
      startDate,
      endDate,
      numberOfGuards,
      additionalDetails
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};