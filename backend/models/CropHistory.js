const mongoose = require('mongoose');

const cropHistorySchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true,
    },
    cropType: {
      type: String,
      required: [true, 'Crop type is required'],
      trim: true,
    },
    yieldAmount: {
      type: Number,
      required: [true, 'Yield amount is required'],
      min: [0, 'Yield cannot be negative'],
    },
    cultivationDuration: {
      type: String,
      required: [true, 'Cultivation duration is required'],
      trim: true,
    },
    year: {
      type: String,
      required: [true, 'Year is required'],
    },
    season: {
      type: String,
      enum: ['Kharif', 'Rabi', 'Zaid'],
    },
    status: {
      type: String,
      enum: ['Planted', 'Growing', 'Harvested', 'Failed'],
      default: 'Planted',
    },
    notes: {
      type: String,
      trim: true,
    },
    images: [
      {
        type: String, // file paths
      },
    ],
  },
  { timestamps: true }
);

// Index for farmer lookups
cropHistorySchema.index({ farmerId: 1, year: 1 });

module.exports = mongoose.model('CropHistory', cropHistorySchema);
