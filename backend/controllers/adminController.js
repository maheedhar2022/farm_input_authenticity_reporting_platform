const asyncHandler = require('express-async-handler');
const dashboardService = require('../services/dashboardService');
const { success } = require('../utils/apiResponse');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getDashboardStats();
  success(res, stats, 'Dashboard statistics retrieved');
});

// @desc    Get recent activity across the platform
// @route   GET /api/admin/recent-activity
// @access  Private/Admin
const getRecentActivity = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const activity = await dashboardService.getRecentActivity(limit);
  success(res, activity, 'Recent activity retrieved');
});

module.exports = { getDashboardStats, getRecentActivity };
