const express = require('express');
const router = express.Router();
const {
  getAllGuards,
  assignGuard,
  generateBill,
  getAllClients,
  getAllApplications,
  acceptApplication
} = require('../controllers/adminController');
const protect = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

router.use(protect);
router.use(checkRole(['admin']));

router.get('/guards', getAllGuards);
router.get('/clients', getAllClients);
router.get('/applications', getAllApplications);
router.post('/assign-guard', assignGuard);
router.post('/generate-bill', generateBill);
router.post('/accept-application', acceptApplication);

module.exports = router;