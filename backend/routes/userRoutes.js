const express = require('express');
const router = express.Router();
const { getStores, submitRating } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('user'));

router.get('/stores', getStores);
router.post('/rate', submitRating);

module.exports = router;
