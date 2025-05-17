const SecurityGuard = require('../models/SecurityGuard');
const Client = require('../models/Client');
const Assignment = require('../models/Assignment');
const Bill = require('../models/Bill');

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