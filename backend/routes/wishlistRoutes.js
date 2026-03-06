const express = require('express');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getComparisonList,
  addToComparison,
  removeFromComparison,
  clearComparison,
} = require('../controllers/wishlistController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Wishlist routes
/**
 * @route   GET /api/wishlist
 * @desc    Get user's wishlist
 * @access  Private
 */
router.get('/', verifyToken, getWishlist);

/**
 * @route   POST /api/wishlist/:phoneId
 * @desc    Add phone to wishlist
 * @access  Private
 */
router.post('/:phoneId', verifyToken, addToWishlist);

/**
 * @route   DELETE /api/wishlist/:phoneId
 * @desc    Remove phone from wishlist
 * @access  Private
 */
router.delete('/:phoneId', verifyToken, removeFromWishlist);

// Comparison list routes
/**
 * @route   GET /api/comparison
 * @desc    Get user's comparison list
 * @access  Private
 */
router.get('/comparison', verifyToken, getComparisonList);

/**
 * @route   POST /api/comparison/:phoneId
 * @desc    Add phone to comparison list
 * @access  Private
 */
router.post('/comparison/:phoneId', verifyToken, addToComparison);

/**
 * @route   DELETE /api/comparison/:phoneId
 * @desc    Remove phone from comparison list
 * @access  Private
 */
router.delete('/comparison/:phoneId', verifyToken, removeFromComparison);

/**
 * @route   DELETE /api/comparison
 * @desc    Clear comparison list
 * @access  Private
 */
router.delete('/comparison', verifyToken, clearComparison);

module.exports = router;
