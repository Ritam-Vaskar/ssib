const express = require('express');
const router = express.Router();
const {
  getAllGuards,
  assignGuard,
  generateBill
} = require('../controllers/adminController');
const protect = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

router.use(protect);
router.use(checkRole(['admin']));

router.get('/guards', getAllGuards);
router.post('/assign-guard', assignGuard);
router.post('/generate-bill', generateBill);

module.exports = router;