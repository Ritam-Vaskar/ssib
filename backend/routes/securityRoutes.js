const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateAssignmentStatus
} = require('../controllers/securityController');
const {
  submitApplication,
  getApplicationStatus
} = require('../controllers/securityApplicationController');
const protect = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

router.use(protect);
router.use(checkRole(['security']));

router.get('/profile', getProfile);
router.put('/update-assignment', updateAssignmentStatus);

// Security Application Routes
router.post('/application/submit', submitApplication);
router.get('/application/status', getApplicationStatus);

module.exports = router;