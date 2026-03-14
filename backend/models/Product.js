const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    batchCode: {
      type: String,
      required: [true, 'Batch code is required'],
      unique: true,
      trim: true,
    },
    manufacturer: {
      type: String,
      required: [true, 'Manufacturer is required'],
      trim: true,
    },
    qrCode: {
      type: String,
      required: [true, 'QR code is required'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Fertilizer', 'Pesticide', 'Seed', 'Equipment', 'Other'],
      default: 'Other',
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      min: [0, 'Price cannot be negative'],
    },
    mfgDate: {
      type: Date,
    },
    expiryDate: {
      type: Date,
    },
    authenticityStatus: {
      type: String,
      enum: ['Genuine', 'Counterfeit', 'Suspicious'],
      default: 'Genuine',
    },
    verificationCount: {
      type: Number,
      default: 0,
    },
    lastVerifiedAt: {
      type: Date,
    },
    qrCodeImage: {
      type: String, // path to generated QR code image
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: check if expired
productSchema.virtual('isExpired').get(function () {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
});

// Index for fast batch/qr lookups
productSchema.index({ batchCode: 1 });
productSchema.index({ qrCode: 1 });

module.exports = mongoose.model('Product', productSchema);
