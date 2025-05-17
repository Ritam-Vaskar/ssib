const SecurityGuard = require('../models/SecurityGuard');
const Assignment = require('../models/Assignment');

// Get guard profile
exports.getProfile = async (req, res) => {
  try {
    const guard = await SecurityGuard.findOne({ user: req.user.id })
      .populate('currentAssignment');
    res.status(200).json({ success: true, data: guard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update assignment status
exports.updateAssignmentStatus = async (req, res) => {
  try {
    const { assignmentId, status, report } = req.body;

    const assignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      {
        status,
        $push: {
          reports: {
            date: new Date(),
            content: report,
            status
          }
        }
      },
      { new: true }
    );

    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};