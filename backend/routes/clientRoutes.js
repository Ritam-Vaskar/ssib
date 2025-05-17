const express = require('express');
const router = express.Router();
const {
  getProfile,
  requestService,
  getBills
} = require('../controllers/clientController');
const protect = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

router.use(protect);
router.use(checkRole(['client']));

router.get('/profile', getProfile);
router.post('/request-service', requestService);
router.get('/bills', getBills);

module.exports = router;