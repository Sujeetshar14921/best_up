const Review = require('../models/Review');
const Phone = require('../models/Phone');
const asyncHandler = require('../middleware/asyncHandler');
const mongoose = require('mongoose');

/**
 * @desc    Get all reviews for a phone
 * @route   GET /api/reviews/phone/:phoneId
 * @access  Public
 */
exports.getPhoneReviews = asyncHandler(async (req, res) => {
  const { phoneId } = req.params;
  const { page = 1, limit = 10, sortBy = '-createdAt' } = req.query;

  // Check if phone exists
  const phone = await Phone.findById(phoneId);
  if (!phone) {
    return res.status(404).json({
      success: false,
      message: 'Phone not found',
    });
  }

  const skip = (page - 1) * limit;

  const reviews = await Review.find({ phoneId, isActive: true })
    .populate('userId', 'name email')
    .sort(sortBy)
    .skip(skip)
    .limit(Number(limit));

  const total = await Review.countDocuments({ phoneId, isActive: true });

  // Calculate review stats
  const ratingData = await Review.aggregate([
    { $match: { phoneId: phone._id, isActive: true } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        totalHelpful: { $sum: '$helpfulCount' },
        totalNotHelpful: { $sum: '$notHelpfulCount' },
        positiveReviews: {
          $sum: {
            $cond: [{ $gte: ['$rating', 4] }, 1, 0],
          },
        },
        ratingDistribution: {
          $push: '$rating',
        },
      },
    },
  ]);

  const averageRating = ratingData[0]?.averageRating || 0;
  const ratingDistribution = ratingData[0]?.ratingDistribution || [];

  res.status(200).json({
    success: true,
    data: {
      phone: {
        id: phone._id,
        name: phone.name,
      },
      reviews,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
      },
      stats: {
        averageRating: parseFloat(averageRating.toFixed(2)),
        totalReviews: ratingData[0]?.totalReviews || 0,
        totalHelpful: ratingData[0]?.totalHelpful || 0,
        totalNotHelpful: ratingData[0]?.totalNotHelpful || 0,
        positiveFeedbackRate: ratingData[0]?.totalReviews
          ? Math.round((ratingData[0].positiveReviews / ratingData[0].totalReviews) * 100)
          : 0,
        ratingDistribution: calculateRatingDistribution(ratingDistribution),
      },
    },
  });
});

/**
 * @desc    Get review stats for multiple phones
 * @route   GET /api/reviews/stats?phoneIds=id1,id2
 * @access  Public
 */
exports.getReviewStatsBulk = asyncHandler(async (req, res) => {
  const raw = req.query.phoneIds || '';
  const phoneIds = String(raw)
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id && id.match(/^[0-9a-fA-F]{24}$/));

  if (phoneIds.length === 0) {
    return res.status(200).json({
      success: true,
      data: {},
    });
  }

  const objectIds = phoneIds.map((id) => new mongoose.Types.ObjectId(id));

  const stats = await Review.aggregate([
    { $match: { phoneId: { $in: objectIds }, isActive: true } },
    {
      $group: {
        _id: '$phoneId',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        totalHelpful: { $sum: '$helpfulCount' },
        totalNotHelpful: { $sum: '$notHelpfulCount' },
        positiveReviews: {
          $sum: {
            $cond: [{ $gte: ['$rating', 4] }, 1, 0],
          },
        },
      },
    },
  ]);

  const byPhoneId = {};
  stats.forEach((s) => {
    byPhoneId[String(s._id)] = {
      averageRating: Number((s.averageRating || 0).toFixed(2)),
      totalReviews: s.totalReviews || 0,
      totalHelpful: s.totalHelpful || 0,
      totalNotHelpful: s.totalNotHelpful || 0,
      positiveFeedbackRate: s.totalReviews
        ? Math.round((s.positiveReviews / s.totalReviews) * 100)
        : 0,
    };
  });

  res.status(200).json({
    success: true,
    data: byPhoneId,
  });
});

/**
 * @desc    Add a review for a phone
 * @route   POST /api/reviews
 * @access  Private
 */
exports.addReview = asyncHandler(async (req, res) => {
  const { phoneId, rating, title, content } = req.validatedData;
  const userId = req.user.userId;

  // Check if phone exists
  const phone = await Phone.findById(phoneId);
  if (!phone) {
    return res.status(404).json({
      success: false,
      message: 'Phone not found',
    });
  }

  // Check if user already reviewed this phone
  const existingReview = await Review.findOne({ phoneId, userId });
  if (existingReview) {
    return res.status(400).json({
      success: false,
      message: 'You have already reviewed this phone. You can update your review instead.',
    });
  }

  // Create review
  const review = await Review.create({
    phoneId,
    userId,
    rating,
    title,
    content,
  });

  // Populate user details
  await review.populate('userId', 'name email');

  res.status(201).json({
    success: true,
    message: 'Review added successfully',
    data: review,
  });
});

/**
 * @desc    Update a review
 * @route   PUT /api/reviews/:reviewId
 * @access  Private
 */
exports.updateReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { rating, title, content } = req.validatedData;
  const userId = req.user.userId;

  let review = await Review.findById(reviewId);
  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found',
    });
  }

  // Check ownership
  if (review.userId.toString() !== userId) {
    return res.status(403).json({
      success: false,
      message: 'You can only update your own review',
    });
  }

  review = await Review.findByIdAndUpdate(
    reviewId,
    { rating, title, content },
    { new: true }
  ).populate('userId', 'name email');

  res.status(200).json({
    success: true,
    message: 'Review updated successfully',
    data: review,
  });
});

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:reviewId
 * @access  Private
 */
exports.deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.userId;

  const review = await Review.findById(reviewId);
  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found',
    });
  }

  // Check ownership or admin
  if (review.userId.toString() !== userId && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'You can only delete your own review',
    });
  }

  // Soft delete
  review.isActive = false;
  await review.save();

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
  });
});

/**
 * @desc    Mark review as helpful
 * @route   PUT /api/reviews/:reviewId/helpful
 * @access  Private
 */
exports.markHelpful = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { helpful } = req.body;

  const review = await Review.findById(reviewId);
  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found',
    });
  }

  if (helpful) {
    review.helpfulCount += 1;
  } else {
    review.notHelpfulCount += 1;
  }

  await review.save();

  res.status(200).json({
    success: true,
    message: 'Thank you for your feedback',
    data: {
      helpfulCount: review.helpfulCount,
      notHelpfulCount: review.notHelpfulCount,
    },
  });
});

/**
 * @desc    Get user's reviews
 * @route   GET /api/reviews/user/:userId
 * @access  Public
 */
exports.getUserReviews = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const reviews = await Review.find({ userId, isActive: true })
    .populate('phoneId', 'name brand')
    .populate('userId', 'name')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    data: reviews,
  });
});

/**
 * Helper function to calculate rating distribution
 */
function calculateRatingDistribution(ratings) {
  const distribution = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  ratings.forEach((rating) => {
    distribution[rating]++;
  });

  return distribution;
}
