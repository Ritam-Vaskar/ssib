const Client = require('../models/Client');
const Assignment = require('../models/Assignment');
const Bill = require('../models/Bill');

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

// Request new service
exports.requestService = async (req, res) => {
  try {
    const { serviceType, address } = req.body;

    const client = await Client.findOneAndUpdate(
      { user: req.user.id },
      { serviceType, address },
      { new: true, runValidators: true }
    );

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