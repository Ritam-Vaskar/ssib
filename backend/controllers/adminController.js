const SecurityGuard = require('../models/SecurityGuard');
const Client = require('../models/Client');
const Assignment = require('../models/Assignment');
const Bill = require('../models/Bill');
const Application = require('../models/Application');
const SecurityApplication = require('../models/SecurityApplication');
const mongoose = require('mongoose');


// Get all security guards
exports.getAllGuards = async (req, res) => {
  try {
    const guards = await SecurityGuard.find().populate('user', 'name email');
    res.status(200).json({ success: true, data: guards });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Assign guard to client
exports.assignGuard = async (req, res) => {
  try {
    const { guardId, clientId, startDate, endDate, shift, location } = req.body;

    const assignment = await Assignment.create({
      guard: guardId,
      client: clientId,
      startDate,
      endDate,
      shift,
      location
    });

    // Update guard status
    await SecurityGuard.findByIdAndUpdate(guardId, {
      status: 'assigned',
      currentAssignment: assignment._id
    });

    // Update client's active assignments
    await Client.findByIdAndUpdate(clientId, {
      $push: { activeAssignments: assignment._id }
    });

    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Generate bill
exports.generateBill = async (req, res) => {
  try {
    const { assignmentId, amount, dueDate } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const bill = await Bill.create({
      assignment: assignmentId,
      client: assignment.client,
      amount,
      dueDate
    });

    res.status(201).json({ success: true, data: bill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all clients
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().populate('user', 'name email');
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all client applications
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find().populate('user', 'name email');
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all security guard applications
exports.getAllSecurityApplications = async (req, res) => {
  try {
    const applications = await SecurityApplication.find().populate('user', 'name email');
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Process security guard application
exports.processSecurityApplication = async (req, res) => {
  try {
    const { applicationId, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ success: false, message: 'Invalid application ID' });
    }

    const application = await SecurityApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Application has already been processed' });
    }

    // If status is 'approved', create a security guard
    let guard = null;
    if (status === 'approved') {
      guard = await SecurityGuard.create({
        user: application.user,
        fullName: application.fullName,
        dateOfBirth: application.dateOfBirth,
        address: application.address,
        phoneNumber: application.phoneNumber,
        experience: application.experience,
        qualifications: application.qualifications,
        status: 'available'
      });
    }

    // Update application status
    application.status = status;
    application.updatedAt = Date.now();
    await application.save();

    res.status(200).json({
      success: true,
      message: `Application ${status} successfully`,
      data: { application, guard }
    });
  } catch (error) {
    console.error('Error in processSecurityApplication:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// accept application
exports.acceptApplication = async (req, res) => {
  try {
    const { applicationId, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ success: false, message: 'Invalid application ID' });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Application has already been processed' });
    }

    // If status is 'approved', create a client
    let client = null;
    if (status === 'approved') {
      client = await Client.create({
        user: application.user,
        serviceType: application.serviceType,
        location: application.location,
        startDate: application.startDate,
        endDate: application.endDate,
        numberOfGuards: application.numberOfGuards
      });
    }

    // Update application status
    application.status = status;
    application.updatedAt = Date.now();
    await application.save();

    res.status(200).json({
      success: true,
      message: `Application ${status} successfully`,
      data: { application, client }
    });
  } catch (error) {
    console.error('Error in acceptApplication:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
