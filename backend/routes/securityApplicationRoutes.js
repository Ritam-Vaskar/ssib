const express = require('express');
const router = express.Router();
const {
  submitApplication,
  getApplicationStatus
} = require('../controllers/securityApplicationController');
const protect = require('../middleware/auth');

router.use(protect);

router.post('/submit', submitApplication);
router.get('/status', getApplicationStatus);

module.exports = router;