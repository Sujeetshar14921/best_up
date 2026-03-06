/**
 * Analytics Controller
 * Provides trending, popular, and analytics data
 */

const Phone = require('../models/Phone');
const Review = require('../models/Review');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Get trending phones based on reviews and views
 * @route   GET /api/analytics/trending
 * @query   limit, timeframe
 * @access  Public
 */
const getTrendingPhones = asyncHandler(async (req, res) => {
  const { limit = 10, timeframe = '7d' } = req.query;

  const timeMs = timeframe === '7d' ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
  const since = new Date(Date.now() - timeMs);

  // Get reviews grouped by phone
  const trendingData = await Review.aggregate([
    {
      $match: {
        createdAt: { $gte: since }
      }
    },
    {
      $group: {
        _id: '$phoneId',
        count: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: parseInt(limit)
    }
  ]);

  // Fetch phone details
  const phoneIds = trendingData.map(t => t._id);
  const phones = await Phone.find({ _id: { $in: phoneIds } }).select('name brand basePrice scores variants slug imageId');

  // Merge data
  const result = trendingData.map(trend => {
    const phone = phones.find(p => p._id.toString() === trend._id.toString());
    return {
      ...phone?.toObject(),
      reviewCount: trend.count,
      avgRating: trend.avgRating.toFixed(2),
      trendScore: trend.count * (trend.avgRating / 5) // Popularity score
    };
  }).sort((a, b) => b.trendScore - a.trendScore);

  res.status(200).json({
    success: true,
    timeframe,
    count: result.length,
    data: result
  });
});

/**
 * @desc    Get most reviewed phones
 * @route   GET /api/analytics/most-reviewed
 * @query   limit
 * @access  Public
 */
const getMostReviewedPhones = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const mostReviewed = await Review.aggregate([
    {
      $group: {
        _id: '$phoneId',
        reviewCount: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    },
    {
      $sort: { reviewCount: -1 }
    },
    {
      $limit: parseInt(limit)
    }
  ]);

  const phoneIds = mostReviewed.map(m => m._id);
  const phones = await Phone.find({ _id: { $in: phoneIds } }).select('name brand basePrice scores variants slug imageId');

  const result = mostReviewed.map(m => {
    const phone = phones.find(p => p._id.toString() === m._id.toString());
    return {
      ...phone?.toObject(),
      reviewCount: m.reviewCount,
      avgRating: m.avgRating.toFixed(2)
    };
  });

  res.status(200).json({
    success: true,
    count: result.length,
    data: result
  });
});

/**
 * @desc    Get price range statistics
 * @route   GET /api/analytics/price-stats
 * @access  Public
 */
const getPriceStats = asyncHandler(async (req, res) => {
  const stats = await Phone.aggregate([
    {
      $group: {
        _id: '$brand',
        avgPrice: { $avg: '$basePrice' },
        minPrice: { $min: '$basePrice' },
        maxPrice: { $max: '$basePrice' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { avgPrice: -1 }
    }
  ]);

  const overall = await Phone.aggregate([
    {
      $group: {
        _id: null,
        avgPrice: { $avg: '$basePrice' },
        minPrice: { $min: '$basePrice' },
        maxPrice: { $max: '$basePrice' },
        totalPhones: { $sum: 1 }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    overall: overall[0],
    byBrand: stats
  });
});

/**
 * @desc    Get top rated phones
 * @route   GET /api/analytics/top-rated
 * @query   limit, category
 * @access  Public
 */
const getTopRatedPhones = asyncHandler(async (req, res) => {
  const { limit = 10, category = 'valueForMoney' } = req.query;

  const validCategories = ['gaming', 'camera', 'battery', 'display', 'valueForMoney'];
  const sortField = `scores.${validCategories.includes(category) ? category : 'valueForMoney'}`;

  const phones = await Phone.find({})
    .select('name brand basePrice scores variants slug imageId')
    .sort({ [sortField]: -1 })
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    category,
    count: phones.length,
    data: phones
  });
});

/**
 * @desc    Get phones by price segment
 * @route   GET /api/analytics/by-segment
 * @access  Public
 */
const getPhonesBySegment = asyncHandler(async (req, res) => {
  const segments = [
    { name: 'Budget', min: 0, max: 15000 },
    { name: 'Mid-Range', min: 15001, max: 40000 },
    { name: 'Premium', min: 40001, max: 80000 },
    { name: 'Flagship', min: 80001, max: Infinity }
  ];

  const result = {};

  for (const segment of segments) {
    const phones = await Phone.countDocuments({
      basePrice: { $gte: segment.min, $lte: segment.max }
    });
    
    const avgScore = await Phone.aggregate([
      {
        $match: {
          basePrice: { $gte: segment.min, $lte: segment.max }
        }
      },
      {
        $group: {
          _id: null,
          avgValueScore: { $avg: '$scores.valueForMoney' }
        }
      }
    ]);

    result[segment.name] = {
      count: phones,
      avgScore: avgScore[0]?.avgValueScore || 0
    };
  }

  res.status(200).json({
    success: true,
    data: result
  });
});

/**
 * @desc    Get search suggestions/autocomplete
 * @route   GET /api/analytics/suggestions
 * @query   q
 * @access  Public
 */
const getSearchSuggestions = asyncHandler(async (req, res) => {
  const { q = '' } = req.query;

  if (q.length < 1) {
    return res.status(200).json({
      success: true,
      data: {
        phones: [],
        brands: [],
        suggestion: 'Start typing to see suggestions'
      }
    });
  }

  // Get phone suggestions
  const phoneSuggestions = await Phone.find(
    {
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } }
      ]
    },
    { name: 1, brand: 1, slug: 1 }
  ).limit(5);

  // Get unique brands matching search
  const brandSuggestions = await Phone.distinct('brand', {
    brand: { $regex: q, $options: 'i' }
  }).limit(5);

  res.status(200).json({
    success: true,
    data: {
      phones: phoneSuggestions,
      brands: brandSuggestions,
      count: phoneSuggestions.length
    }
  });
});

module.exports = {
  getTrendingPhones,
  getMostReviewedPhones,
  getPriceStats,
  getTopRatedPhones,
  getPhonesBySegment,
  getSearchSuggestions
};
