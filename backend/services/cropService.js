const CropHistory = require('../models/CropHistory');
const Farmer = require('../models/Farmer');
const { AppError } = require('../middlewares/errorMiddleware');

/**
 * Add a crop history entry and link it to the farmer
 */
const addCropHistory = async (farmerId, data) => {
  const crop = await CropHistory.create({
    farmerId,
    ...data,
  });

  // Also push to the farmer's cropHistory array
  await Farmer.findByIdAndUpdate(farmerId, {
    $push: { cropHistory: crop._id },
  });

  return crop;
};

/**
 * Get crop history for a farmer with optional filters
 */
const getCropHistory = async (farmerId, { page = 1, limit = 10, year, season }) => {
  const query = { farmerId };
  if (year) query.year = year;
  if (season) query.season = season;

  const skip = (page - 1) * limit;
  const total = await CropHistory.countDocuments(query);
  const crops = await CropHistory.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return { crops, total, page: parseInt(page), limit: parseInt(limit) };
};

/**
 * Update a crop history entry
 */
const updateCropHistory = async (cropId, farmerId, data) => {
  const crop = await CropHistory.findOne({ _id: cropId, farmerId });
  if (!crop) {
    throw new AppError('Crop history entry not found', 404);
  }

  Object.assign(crop, data);
  await crop.save();
  return crop;
};

/**
 * Delete a crop history entry
 */
const deleteCropHistory = async (cropId, farmerId) => {
  const crop = await CropHistory.findOneAndDelete({ _id: cropId, farmerId });
  if (!crop) {
    throw new AppError('Crop history entry not found', 404);
  }

  // Also remove from farmer's cropHistory array
  await Farmer.findByIdAndUpdate(farmerId, {
    $pull: { cropHistory: cropId },
  });

  return crop;
};

/**
 * Get aggregated crop statistics for a farmer
 */
const getCropStats = async (farmerId) => {
  const stats = await CropHistory.aggregate([
    { $match: { farmerId: farmerId } },
    {
      $group: {
        _id: '$cropType',
        totalYield: { $sum: '$yieldAmount' },
        avgYield: { $avg: '$yieldAmount' },
        count: { $sum: 1 },
        years: { $addToSet: '$year' },
      },
    },
    { $sort: { totalYield: -1 } },
  ]);

  const totalEntries = await CropHistory.countDocuments({ farmerId });

  return { stats, totalEntries };
};

/**
 * Mock crop image analysis
 */
const analyzeCropImage = (imageData) => {
  if (!imageData) {
    throw new AppError('No image data provided', 400);
  }

  // Mock ML analysis result
  const analyses = [
    { status: 'Healthy', confidence: 0.95, message: 'The crop appears healthy with good growth patterns.' },
    { status: 'Moderate Stress', confidence: 0.78, message: 'Signs of mild nutrient deficiency detected.' },
    { status: 'Disease Detected', confidence: 0.88, message: 'Possible fungal infection. Consider applying fungicide.' },
  ];

  return analyses[Math.floor(Math.random() * analyses.length)];
};

module.exports = {
  addCropHistory,
  getCropHistory,
  updateCropHistory,
  deleteCropHistory,
  getCropStats,
  analyzeCropImage,
};
