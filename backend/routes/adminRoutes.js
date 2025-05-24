const express = require('express');
const router = express.Router();
const {
  getAllGuards,
  assignGuard,
  generateBill,
  getAllClients,
  getAllApplications,
  acceptApplication,
  getAllSecurityApplications,
  acceptSecurityApplication,
  rejectSecurityApplication,
  getAssignmentDetails,
  withdrawGuard
} = require('../controllers/adminController');
const protect = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

router.use(protect);
router.use(checkRole(['admin']));

router.get('/guards', getAllGuards);
router.get('/clients', getAllClients);
router.get('/applications', getAllApplications);
router.get('/security-applications', getAllSecurityApplications);
router.post('/assign-guard', assignGuard);
router.post('/generate-bill', generateBill);
router.post('/accept-application', acceptApplication);
router.post('/accept-security-application', acceptSecurityApplication);
router.post('/reject-security-application', rejectSecurityApplication);
router.get('/assignments/:id', getAssignmentDetails);
router.post('/withdraw-guard', withdrawGuard);

module.exports = router;