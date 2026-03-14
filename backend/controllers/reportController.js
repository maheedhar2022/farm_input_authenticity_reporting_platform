const asyncHandler = require('express-async-handler');
const reportService = require('../services/reportService');
const { success, created, paginated } = require('../utils/apiResponse');

// @desc    Create a fake product report
// @route   POST /api/reports
// @access  Private
const createReport = asyncHandler(async (req, res) => {
  const report = await reportService.createReport(req.farmer._id, req.body);
  created(res, report, 'Report submitted successfully');
});

// @desc    Get all reports for the logged in farmer
// @route   GET /api/reports
// @access  Private
const getReports = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await reportService.getReportsByFarmer(req.farmer._id, { page, limit });
  paginated(res, result.reports, result.page, result.limit, result.total, 'Reports retrieved');
});

// @desc    Get a single report by ID
// @route   GET /api/reports/:id
// @access  Private
const getReportById = asyncHandler(async (req, res) => {
  const report = await reportService.getReportById(req.params.id);
  success(res, report, 'Report retrieved successfully');
});

// @desc    Get all reports (Admin)
// @route   GET /api/reports/all
// @access  Private/Admin
const getAllReports = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, priority } = req.query;
  const result = await reportService.getAllReports({ page, limit, status, priority });
  paginated(res, result.reports, result.page, result.limit, result.total, 'All reports retrieved');
});

// @desc    Update report status (Admin)
// @route   PUT /api/reports/:id/status
// @access  Private/Admin
const updateReportStatus = asyncHandler(async (req, res) => {
  const report = await reportService.updateReportStatus(req.params.id, {
    reportStatus: req.body.reportStatus,
    resolutionNotes: req.body.resolutionNotes,
    resolvedBy: req.user._id,
  });
  success(res, report, 'Report status updated successfully');
});

module.exports = {
  createReport,
  getReports,
  getReportById,
  getAllReports,
  updateReportStatus,
};
