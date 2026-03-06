const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    phoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Phone',
      required: [true, 'Phone ID is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
    },
    title: {
      type: String,
      required: [true, 'Review title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Review content is required'],
      trim: true,
      maxlength: [1000, 'Content cannot exceed 1000 characters'],
    },
    verified: {
      type: Boolean,
      default: false,
      description: 'Whether the reviewer verified has purchased the phone',
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    notHelpfulCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for faster queries
reviewSchema.index({ phoneId: 1, userId: 1 });
reviewSchema.index({ phoneId: 1, rating: 1 });

module.exports = mongoose.model('Review', reviewSchema);
