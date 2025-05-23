const express = require('express');
const router = express.Router();
const {
  getProfile,
  requestService,
  getBills,
  submitApplication
} = require('../controllers/clientController');
const protect = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

router.use(protect);
router.use(checkRole(['client']));

router.get('/profile', getProfile);
router.get('/bills', getBills);
router.post('/submit-application', submitApplication);

module.exports = router;