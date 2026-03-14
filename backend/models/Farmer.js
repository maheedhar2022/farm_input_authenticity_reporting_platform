const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian phone number'],
    },
    aadhaarNumber: {
      type: String,
      required: [true, 'Aadhaar number is required'],
      unique: true,
      minlength: [12, 'Aadhaar number must be 12 digits'],
      maxlength: [12, 'Aadhaar number must be 12 digits'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['farmer'],
      default: 'farmer',
    },
    district: {
      type: String,
      trim: true,
    },
    mandal: {
      type: String,
      trim: true,
    },
    village: {
      type: String,
      trim: true,
    },
    acres: {
      type: Number,
      min: [0, 'Acres cannot be negative'],
    },
    soilType: {
      type: String,
      enum: ['Red', 'Black', 'Alluvial', 'Laterite', 'Sandy', 'Clay', 'Loamy', 'Other'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    cropHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CropHistory',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: total crop entries
farmerSchema.virtual('totalCrops').get(function () {
  return this.cropHistory ? this.cropHistory.length : 0;
});

module.exports = mongoose.model('Farmer', farmerSchema);
