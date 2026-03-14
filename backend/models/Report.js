const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true,
    },
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    batchCode: {
      type: String,
      trim: true,
    },
    receiptImage: {
      type: String, // file path
    },
    productImage: {
      type: String, // file path
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    reportStatus: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Resolved'],
      default: 'Pending',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    location: {
      type: String,
      trim: true,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolutionNotes: {
      type: String,
      trim: true,
    },
    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Index for status queries
reportSchema.index({ reportStatus: 1, priority: 1 });
reportSchema.index({ farmerId: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
