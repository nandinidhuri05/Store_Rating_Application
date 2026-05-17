const express = require('express');
const router = express.Router();
const { getStats, getUsers, addUser, getStores, addStore, impersonateUser } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.post('/users', addUser);
router.get('/stores', getStores);
router.post('/stores', addStore);
router.get('/impersonate/:id', impersonateUser);

module.exports = router;
