const express = require('express');
const router = express.Router();
const { getDashboardStats, getRecentActivity } = require('../controllers/adminController');
const { protectAdmin } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.get('/dashboard', protectAdmin, authorize('admin', 'inspector'), getDashboardStats);
router.get('/recent-activity', protectAdmin, authorize('admin', 'inspector'), getRecentActivity);

module.exports = router;
