const asyncHandler = require('express-async-handler');
const Farmer = require('../models/Farmer');
const { success, paginated } = require('../utils/apiResponse');
const { AppError } = require('../middlewares/errorMiddleware');

// @desc    Get farmer profile
// @route   GET /api/farmers/profile
// @access  Private
const getFarmerProfile = asyncHandler(async (req, res) => {
  const farmer = await Farmer.findById(req.farmer._id)
    .populate('cropHistory')
    .select('-password');

  if (!farmer) {
    throw new AppError('Farmer not found', 404);
  }

  success(res, farmer, 'Profile retrieved successfully');
});

// @desc    Update farmer profile
// @route   PUT /api/farmers/profile
// @access  Private
const updateFarmerProfile = asyncHandler(async (req, res) => {
  const farmer = await Farmer.findById(req.farmer._id);

  if (!farmer) {
    throw new AppError('Farmer not found', 404);
  }

  const allowedFields = ['district', 'mandal', 'village', 'acres', 'soilType', 'name'];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      farmer[field] = req.body[field];
    }
  });

  const updatedFarmer = await farmer.save();
  success(res, updatedFarmer, 'Profile updated successfully');
});

// @desc    Get all farmers (Admin)
// @route   GET /api/farmers
// @access  Private/Admin
const getAllFarmers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, district, soilType } = req.query;

  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { phoneNumber: { $regex: search, $options: 'i' } },
      { district: { $regex: search, $options: 'i' } },
    ];
  }
  if (district) query.district = district;
  if (soilType) query.soilType = soilType;

  const skip = (page - 1) * limit;
  const total = await Farmer.countDocuments(query);
  const farmers = await Farmer.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  paginated(res, farmers, page, limit, total, 'Farmers retrieved successfully');
});

// @desc    Search farmers by name/phone/district
// @route   GET /api/farmers/search
// @access  Private/Admin
const searchFarmers = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) {
    throw new AppError('Search query is required', 400);
  }

  const farmers = await Farmer.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { phoneNumber: { $regex: q, $options: 'i' } },
      { district: { $regex: q, $options: 'i' } },
      { village: { $regex: q, $options: 'i' } },
    ],
  })
    .select('name phoneNumber district village acres')
    .limit(20);

  success(res, farmers, 'Search results');
});

// @desc    Delete/deactivate a farmer (Admin)
// @route   DELETE /api/farmers/:id
// @access  Private/Admin
const deleteFarmer = asyncHandler(async (req, res) => {
  const farmer = await Farmer.findById(req.params.id);

  if (!farmer) {
    throw new AppError('Farmer not found', 404);
  }

  // Soft delete — deactivate instead of removing
  farmer.isActive = false;
  await farmer.save();

  success(res, { _id: farmer._id }, 'Farmer deactivated successfully');
});

module.exports = {
  getFarmerProfile,
  updateFarmerProfile,
  getAllFarmers,
  searchFarmers,
  deleteFarmer,
};
