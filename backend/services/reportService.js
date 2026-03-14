const Report = require('../models/Report');
const { AppError } = require('../middlewares/errorMiddleware');

/**
 * Create a new counterfeit report
 */
const createReport = async (farmerId, data) => {
  const report = await Report.create({
    farmerId,
    ...data,
  });
  return report;
};

/**
 * Get all reports for a farmer
 */
const getReportsByFarmer = async (farmerId, { page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const total = await Report.countDocuments({ farmerId });
  const reports = await Report.find({ farmerId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return { reports, total, page: parseInt(page), limit: parseInt(limit) };
};

/**
 * Get a single report by ID
 */
const getReportById = async (reportId) => {
  const report = await Report.findById(reportId)
    .populate('farmerId', 'name phoneNumber district')
    .populate('resolvedBy', 'name email role');

  if (!report) {
    throw new AppError('Report not found', 404);
  }
  return report;
};

/**
 * Get all reports (admin) with filters
 */
const getAllReports = async ({ page = 1, limit = 10, status, priority }) => {
  const query = {};
  if (status) query.reportStatus = status;
  if (priority) query.priority = priority;

  const skip = (page - 1) * limit;
  const total = await Report.countDocuments(query);
  const reports = await Report.find(query)
    .populate('farmerId', 'name phoneNumber district')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return { reports, total, page: parseInt(page), limit: parseInt(limit) };
};

/**
 * Update report status (admin) with status transition validation
 */
const updateReportStatus = async (reportId, { reportStatus, resolutionNotes, resolvedBy }) => {
  const report = await Report.findById(reportId);
  if (!report) {
    throw new AppError('Report not found', 404);
  }

  // Validate status transition
  const validTransitions = {
    Pending: ['Reviewed', 'Resolved'],
    Reviewed: ['Resolved'],
    Resolved: [], // terminal state
  };

  if (!validTransitions[report.reportStatus].includes(reportStatus)) {
    throw new AppError(
      `Cannot transition from '${report.reportStatus}' to '${reportStatus}'`,
      400
    );
  }

  report.reportStatus = reportStatus;

  if (reportStatus === 'Resolved') {
    report.resolvedBy = resolvedBy;
    report.resolvedAt = new Date();
    report.resolutionNotes = resolutionNotes || '';
  }

  if (resolutionNotes) {
    report.resolutionNotes = resolutionNotes;
  }

  await report.save();
  return report;
};

module.exports = {
  createReport,
  getReportsByFarmer,
  getReportById,
  getAllReports,
  updateReportStatus,
};
