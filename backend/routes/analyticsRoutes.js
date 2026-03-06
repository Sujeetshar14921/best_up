/**
 * Analytics Routes
 * Provides trending, statistics, and search data
 */

const express = require('express');
const router = express.Router();
const {
  getTrendingPhones,
  getMostReviewedPhones,
  getPriceStats,
  getTopRatedPhones,
  getPhonesBySegment,
  getSearchSuggestions
} = require('../controllers/analyticsController');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');

// Apply caching to analytics endpoints
router.use(cacheMiddleware);

// ==================== TRENDING & POPULAR ====================

// GET trending phones (last 7 or 30 days)
router.get('/trending', getTrendingPhones);

// GET most reviewed phones
router.get('/most-reviewed', getMostReviewedPhones);

// GET top rated phones by category (gaming, camera, battery, etc)
router.get('/top-rated', getTopRatedPhones);

// ==================== STATISTICS ====================

// GET price statistics
router.get('/price-stats', getPriceStats);

// GET phones grouped by price segment
router.get('/by-segment', getPhonesBySegment);

// ==================== SEARCH & SUGGESTIONS ====================

// GET search suggestions (autocomplete)
router.get('/suggestions', getSearchSuggestions);

module.exports = router;
