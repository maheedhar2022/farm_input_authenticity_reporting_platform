const asyncHandler = require('express-async-handler');
const cropService = require('../services/cropService');
const { success, created, paginated } = require('../utils/apiResponse');
const mongoose = require('mongoose');

// @desc    Add crop history
// @route   POST /api/crops
// @access  Private
const addCropHistory = asyncHandler(async (req, res) => {
  const crop = await cropService.addCropHistory(req.farmer._id, req.body);
  created(res, crop, 'Crop history added successfully');
});

// @desc    Get crop history for a farmer
// @route   GET /api/crops
// @access  Private
const getCropHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, year, season } = req.query;
  const result = await cropService.getCropHistory(req.farmer._id, { page, limit, year, season });
  paginated(res, result.crops, result.page, result.limit, result.total, 'Crop history retrieved');
});

// @desc    Update crop history entry
// @route   PUT /api/crops/:id
// @access  Private
const updateCropHistory = asyncHandler(async (req, res) => {
  const crop = await cropService.updateCropHistory(req.params.id, req.farmer._id, req.body);
  success(res, crop, 'Crop history updated successfully');
});

// @desc    Delete crop history entry
// @route   DELETE /api/crops/:id
// @access  Private
const deleteCropHistory = asyncHandler(async (req, res) => {
  await cropService.deleteCropHistory(req.params.id, req.farmer._id);
  success(res, null, 'Crop history entry deleted successfully');
});

// @desc    Get crop statistics for the farmer
// @route   GET /api/crops/stats
// @access  Private
const getCropStats = asyncHandler(async (req, res) => {
  const farmerId = new mongoose.Types.ObjectId(req.farmer._id);
  const stats = await cropService.getCropStats(farmerId);
  success(res, stats, 'Crop statistics retrieved');
});

// @desc    Mock image comparison analysis
// @route   POST /api/crops/analyze
// @access  Private
const analyzeCrop = asyncHandler(async (req, res) => {
  const result = cropService.analyzeCropImage(req.body.cropImageBase64 || req.file);
  success(res, result, 'Crop analysis complete');
});

module.exports = {
  addCropHistory,
  getCropHistory,
  updateCropHistory,
  deleteCropHistory,
  getCropStats,
  analyzeCrop,
};
