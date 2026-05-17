const express = require('express');
const router = express.Router();
const { getStoreStats } = require('../controllers/ownerController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('owner'));

router.get('/stats', getStoreStats);

module.exports = router;
