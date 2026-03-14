const express = require('express');
const router = express.Router();
const {
  createReport,
  getReports,
  getReportById,
  getAllReports,
  updateReportStatus,
} = require('../controllers/reportController');
const { protect, protectAdmin } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { createReportRules, updateReportStatusRules } = require('../middlewares/validators/reportValidator');
const upload = require('../config/multer');

// Farmer routes
router.route('/')
  .post(
    protect,
    upload.fields([
      { name: 'receiptImage', maxCount: 1 },
      { name: 'productImage', maxCount: 1 },
    ]),
    createReportRules,
    createReport
  )
  .get(protect, getReports);

// Admin routes
router.get('/all', protectAdmin, authorize('admin', 'inspector'), getAllReports);
router.put('/:id/status', protectAdmin, authorize('admin', 'inspector'), updateReportStatusRules, updateReportStatus);

// Shared detail route
router.get('/:id', protect, getReportById);

module.exports = router;
