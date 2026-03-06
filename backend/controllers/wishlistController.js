const User = require('../models/User');
const Phone = require('../models/Phone');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Get user's wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
exports.getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const user = await User.findById(userId).populate('wishlist');
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    data: {
      count: user.wishlist.length,
      phones: user.wishlist,
    },
  });
});

/**
 * @desc    Add phone to wishlist
 * @route   POST /api/wishlist/:phoneId
 * @access  Private
 */
exports.addToWishlist = asyncHandler(async (req, res) => {
  const { phoneId } = req.params;
  const userId = req.user.userId;

  // Check if phone exists
  const phone = await Phone.findById(phoneId);
  if (!phone) {
    return res.status(404).json({
      success: false,
      message: 'Phone not found',
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Check if already in wishlist
  if (user.wishlist.includes(phoneId)) {
    return res.status(400).json({
      success: false,
      message: 'Phone is already in your wishlist',
    });
  }

  user.wishlist.push(phoneId);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Phone added to wishlist',
    data: {
      wishlistCount: user.wishlist.length,
    },
  });
});

/**
 * @desc    Remove phone from wishlist
 * @route   DELETE /api/wishlist/:phoneId
 * @access  Private
 */
exports.removeFromWishlist = asyncHandler(async (req, res) => {
  const { phoneId } = req.params;
  const userId = req.user.userId;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Check if phone is in wishlist
  if (!user.wishlist.includes(phoneId)) {
    return res.status(400).json({
      success: false,
      message: 'Phone is not in your wishlist',
    });
  }

  user.wishlist = user.wishlist.filter((id) => id.toString() !== phoneId);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Phone removed from wishlist',
    data: {
      wishlistCount: user.wishlist.length,
    },
  });
});

/**
 * @desc    Get user's comparison list
 * @route   GET /api/comparison
 * @access  Private
 */
exports.getComparisonList = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const user = await User.findById(userId).populate('comparisonList');
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    data: {
      count: user.comparisonList.length,
      phones: user.comparisonList,
    },
  });
});

/**
 * @desc    Add phone to comparison list
 * @route   POST /api/comparison/:phoneId
 * @access  Private
 */
exports.addToComparison = asyncHandler(async (req, res) => {
  const { phoneId } = req.params;
  const userId = req.user.userId;

  // Check if phone exists
  const phone = await Phone.findById(phoneId);
  if (!phone) {
    return res.status(404).json({
      success: false,
      message: 'Phone not found',
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Limit comparison list to 5 phones
  if (user.comparisonList.length >= 5) {
    return res.status(400).json({
      success: false,
      message: 'You can only compare up to 5 phones at a time',
    });
  }

  // Check if already in comparison list
  if (user.comparisonList.includes(phoneId)) {
    return res.status(400).json({
      success: false,
      message: 'Phone is already in your comparison list',
    });
  }

  user.comparisonList.push(phoneId);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Phone added to comparison list',
    data: {
      comparisonCount: user.comparisonList.length,
    },
  });
});

/**
 * @desc    Remove phone from comparison list
 * @route   DELETE /api/comparison/:phoneId
 * @access  Private
 */
exports.removeFromComparison = asyncHandler(async (req, res) => {
  const { phoneId } = req.params;
  const userId = req.user.userId;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Check if phone is in comparison list
  if (!user.comparisonList.includes(phoneId)) {
    return res.status(400).json({
      success: false,
      message: 'Phone is not in your comparison list',
    });
  }

  user.comparisonList = user.comparisonList.filter((id) => id.toString() !== phoneId);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Phone removed from comparison list',
    data: {
      comparisonCount: user.comparisonList.length,
    },
  });
});

/**
 * @desc    Clear comparison list
 * @route   DELETE /api/comparison
 * @access  Private
 */
exports.clearComparison = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  user.comparisonList = [];
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Comparison list cleared',
  });
});
