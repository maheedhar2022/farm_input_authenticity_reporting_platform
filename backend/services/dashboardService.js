const Farmer = require('../models/Farmer');
const Product = require('../models/Product');
const Report = require('../models/Report');
const CropHistory = require('../models/CropHistory');
const User = require('../models/User');

/**
 * Get dashboard statistics for admin
 */
const getDashboardStats = async () => {
  const [
    totalFarmers,
    activeFarmers,
    totalProducts,
    genuineProducts,
    suspiciousProducts,
    counterfeitProducts,
    totalReports,
    pendingReports,
    reviewedReports,
    resolvedReports,
    criticalReports,
    totalCropEntries,
    totalAdmins,
  ] = await Promise.all([
    Farmer.countDocuments(),
    Farmer.countDocuments({ isActive: true }),
    Product.countDocuments(),
    Product.countDocuments({ authenticityStatus: 'Genuine' }),
    Product.countDocuments({ authenticityStatus: 'Suspicious' }),
    Product.countDocuments({ authenticityStatus: 'Counterfeit' }),
    Report.countDocuments(),
    Report.countDocuments({ reportStatus: 'Pending' }),
    Report.countDocuments({ reportStatus: 'Reviewed' }),
    Report.countDocuments({ reportStatus: 'Resolved' }),
    Report.countDocuments({ priority: 'Critical' }),
    CropHistory.countDocuments(),
    User.countDocuments(),
  ]);

  return {
    farmers: {
      total: totalFarmers,
      active: activeFarmers,
      inactive: totalFarmers - activeFarmers,
    },
    products: {
      total: totalProducts,
      genuine: genuineProducts,
      suspicious: suspiciousProducts,
      counterfeit: counterfeitProducts,
    },
    reports: {
      total: totalReports,
      pending: pendingReports,
      reviewed: reviewedReports,
      resolved: resolvedReports,
      critical: criticalReports,
    },
    crops: {
      totalEntries: totalCropEntries,
    },
    admins: {
      total: totalAdmins,
    },
  };
};

/**
 * Get recent activity across the platform
 */
const getRecentActivity = async (limit = 10) => {
  const [recentReports, recentFarmers, recentProducts] = await Promise.all([
    Report.find()
      .populate('farmerId', 'name phoneNumber')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean(),
    Farmer.find()
      .select('name phoneNumber district createdAt')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean(),
    Product.find()
      .select('productName brand batchCode authenticityStatus createdAt')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean(),
  ]);

  return {
    recentReports,
    recentFarmers,
    recentProducts,
  };
};

module.exports = { getDashboardStats, getRecentActivity };
