const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateAssignmentStatus
} = require('../controllers/securityController');
const protect = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

router.use(protect);
router.use(checkRole(['security']));

router.get('/profile', getProfile);
router.put('/update-assignment', updateAssignmentStatus);

module.exports = router;