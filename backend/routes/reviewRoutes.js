const express = require('express');
const {
  getPhoneReviews,
  addReview,
  updateReview,
  deleteReview,
  markHelpful,
  getUserReviews,
} = require('../controllers/reviewController');
const { verifyToken } = require('../middleware/authMiddleware');
const { reviewSchema, validate } = require('../middleware/validationMiddleware');

const router = express.Router();

/**
 * @route   GET /api/reviews/phone/:phoneId
 * @desc    Get all reviews for a specific phone
 * @access  Public
 */
router.get('/phone/:phoneId', getPhoneReviews);

/**
 * @route   GET /api/reviews/user/:userId
 * @desc    Get all reviews by a specific user
 * @access  Public
 */
router.get('/user/:userId', getUserReviews);

/**
 * @route   POST /api/reviews
 * @desc    Add a new review for a phone
 * @access  Private
 */
router.post('/', verifyToken, validate(reviewSchema), addReview);

/**
 * @route   PUT /api/reviews/:reviewId
 * @desc    Update a review
 * @access  Private
 */
router.put('/:reviewId', verifyToken, validate(reviewSchema), updateReview);

/**
 * @route   DELETE /api/reviews/:reviewId
 * @desc    Delete a review
 * @access  Private
 */
router.delete('/:reviewId', verifyToken, deleteReview);

/**
 * @route   PUT /api/reviews/:reviewId/helpful
 * @desc    Mark review as helpful or not helpful
 * @access  Private
 */
router.put('/:reviewId/helpful', verifyToken, markHelpful);

module.exports = router;
