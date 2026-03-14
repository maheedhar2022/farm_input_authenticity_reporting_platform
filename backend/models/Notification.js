const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true,
    },
    type: {
      type: String,
      enum: ['Alert', 'Info', 'Warning', 'Success'],
      default: 'Info',
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedModel: {
      type: String,
      enum: ['Product', 'Report', 'CropHistory', null],
      default: null,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for fast queries
notificationSchema.index({ farmerId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
