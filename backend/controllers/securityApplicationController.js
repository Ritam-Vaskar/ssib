const SecurityApplication = require('../models/SecurityApplication');
const SecurityGuard = require('../models/SecurityGuard');

// Submit security guard application
exports.submitApplication = async (req, res) => {
  try {
    const {
      fullName,
      dateOfBirth,
      address,
      phoneNumber,
      experience,
      qualifications,
      previousEmployer,
      documents,
      additionalDetails
    } = req.body;

    const application = await SecurityApplication.create({
      user: req.user.id,
      fullName,
      dateOfBirth,
      address,
      phoneNumber,
      experience,
      qualifications,
      previousEmployer,
      documents,
      additionalDetails
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get application status
exports.getApplicationStatus = async (req, res) => {
  try {
    const application = await SecurityApplication.findOne({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    if (!application) {
      return res.status(404).json({ success: false, message: 'No application found' });
    }

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};