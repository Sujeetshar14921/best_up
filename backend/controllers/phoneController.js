const Phone = require('../models/Phone');
const asyncHandler = require('../middleware/asyncHandler');

// ==================== GET PHONES ====================

/**
 * @desc    Fetch all phones with advanced filtering, search, and pagination
 * @route   GET /api/phones
 * @query   brand, price[lte], price[gte], ram[gte], search, limit, skip, sort
 * @access  Public
 */
const getPhones = asyncHandler(async (req, res) => {
  const { brand, search, isUpcoming, limit = 10, skip = 0, sort = '-createdAt' } = req.query;

  // Build query object
  const query = {};
  if (brand) query.brand = brand;
  if (search) query.$text = { $search: search };
  if (isUpcoming === 'true') query.isUpcoming = true;
  if (isUpcoming === 'false') query.isUpcoming = false;

  // Build price filter if provided
  if (req.query['price[lte]'] || req.query['price[gte]']) {
    query['variants.price'] = {};
    if (req.query['price[lte]']) {
      query['variants.price'].$lte = Number(req.query['price[lte]']);
    }
    if (req.query['price[gte]']) {
      query['variants.price'].$gte = Number(req.query['price[gte]']);
    }
  }

  // Build RAM filter if provided
  if (req.query['ram[gte]']) {
    query['specs.performance.ramOptions'] = {
      $elemMatch: { $gte: Number(req.query['ram[gte]']) },
    };
  }

  // Execute query with pagination
  const total = await Phone.countDocuments(query);
  const phones = await Phone.find(query)
    .limit(Number(limit))
    .skip(Number(skip))
    .sort(sort)
    .select('name brand basePrice specs scores variants overview imageId slug isUpcoming launchDate');

  res.status(200).json({
    success: true,
    total,
    count: phones.length,
    page: Math.floor(Number(skip) / Number(limit)) + 1,
    pages: Math.ceil(total / Number(limit)),
    data: phones,
  });
});

// ==================== GET SINGLE PHONE ====================

/**
 * @desc    Fetch single phone by slug with detailed specs
 * @route   GET /api/phones/:slug
 * @access  Public
 */
const getPhoneBySlug = asyncHandler(async (req, res) => {
  const phone = await Phone.findOne({ slug: req.params.slug });

  if (!phone) {
    res.status(404);
    throw new Error('Phone not found');
  }

  res.status(200).json({
    success: true,
    data: phone,
  });
});

// ==================== GET PHONE BY ID ====================

/**
 * @desc    Fetch single phone by MongoDB ID
 * @route   GET /api/phones/id/:id
 * @access  Public
 */
const getPhoneById = asyncHandler(async (req, res) => {
  const phone = await Phone.findById(req.params.id);

  if (!phone) {
    res.status(404);
    throw new Error('Phone not found');
  }

  res.status(200).json({
    success: true,
    data: phone,
  });
});

// ==================== SMART RECOMMENDATION ENGINE ====================

/**
 * @desc    Get AI-powered phone recommendations based on budget and priority
 * @route   GET /api/phones/recommend
 * @query   budget (required), priority (Gaming|Camera|Vlogging|Battery|Value), limit
 * @access  Public
 * @example GET /api/phones/recommend?budget=25000&priority=Gaming&limit=5
 */
const recommendPhones = asyncHandler(async (req, res) => {
  const { budget, priority = 'Value', limit = 5 } = req.query;

  // ---- Validation ----
  if (!budget || isNaN(budget)) {
    res.status(400);
    throw new Error('Valid budget parameter required');
  }

  if (
    !['Gaming', 'Camera', 'Vlogging', 'Battery', 'Value'].includes(priority)
  ) {
    res.status(400);
    throw new Error(
      'Priority must be one of: Gaming, Camera, Vlogging, Battery, Value'
    );
  }

  // ---- Get recommendations from model ----
  const recommendations = await Phone.getRecommendations({
    budget: Number(budget),
    priority,
    limit: Number(limit),
  });

  if (recommendations.length === 0) {
    return res.status(200).json({
      success: true,
      message: `No phones found in your budget (₹${budget}) for ${priority} priority`,
      data: [],
    });
  }

  // ---- Enrich response with recommendation reasons ----
  const enrichedRecommendations = recommendations.map((phone) => ({
    ...phone,
    recommendationReason: getRecommendationReason(phone, priority),
    bestFor: priority,
    priceRange: {
      min: Math.min(...phone.variants.map((v) => v.price)),
      max: Math.max(...phone.variants.map((v) => v.price)),
    },
  }));

  res.status(200).json({
    success: true,
    count: enrichedRecommendations.length,
    budget: Number(budget),
    priority,
    data: enrichedRecommendations,
  });
});

// ==================== DYNAMIC COMPARISON ====================

/**
 * @desc    Compare multiple phones side-by-side
 * @route   GET /api/phones/compare
 * @query   ids (comma-separated phone IDs or slugs)
 * @access  Public
 * @example GET /api/phones/compare?ids=507f1f77bcf86cd799439011,507f1f77bcf86cd799439012
 */
const comparePhones = asyncHandler(async (req, res) => {
  const { ids } = req.query;

  // ---- Validation ----
  if (!ids || typeof ids !== 'string') {
    res.status(400);
    throw new Error('Phone IDs required in query parameter (comma-separated)');
  }

  const phoneIds = ids.split(',').filter((id) => id.trim());

  if (phoneIds.length < 2) {
    res.status(400);
    throw new Error('At least 2 phones required for comparison');
  }

  if (phoneIds.length > 5) {
    res.status(400);
    throw new Error('Maximum 5 phones can be compared at once');
  }

  // ---- Try to match by ID or slug ----
  let phones = await Phone.find({
    $or: [
      { _id: { $in: phoneIds } },
      { slug: { $in: phoneIds } },
    ],
  });

  if (phones.length === 0) {
    res.status(404);
    throw new Error('No phones found for comparison');
  }

  // ---- Get comparison data with winners ----
  const comparison = await Phone.comparePhones(phones.map((p) => p._id));

  // ---- Create detailed comparison table ----
  const comparisonMetrics = {
    basicInfo: ['name', 'brand', 'basePrice'],
    performance: [
      'processor',
      'antutuScore',
      'ramOptions',
      'coolingSystem',
    ],
    display: ['size', 'refreshRate', 'touchSamplingRate', 'brightness'],
    camera: [
      'rear.main.megapixels',
      'rear.main.ois',
      'telephoto',
      'front.videoCapable4K',
    ],
    battery: ['capacity', 'chargingSpeed', 'wirelessCharging'],
    scores: ['gaming', 'camera', 'battery', 'valueForMoney'],
  };

  res.status(200).json({
    success: true,
    comparisonCount: phones.length,
    comparisonMetrics,
    winner: comparison.winner,
    phones: comparison.phones,
    recommendation: generateComparisonRecommendation(comparison.phones),
  });
});

// ==================== CREATE PHONE ====================

/**
 * @desc    Add a new phone (Admin only)
 * @route   POST /api/phones
 * @body    Complete phone object with specs, variants, etc.
 * @access  Private (Admin)
 */
const createPhone = asyncHandler(async (req, res) => {
  // ---- Validation ----
  if (!req.body.name || !req.body.brand || !req.body.basePrice) {
    res.status(400);
    throw new Error('Name, brand, and basePrice are required');
  }

  if (!req.body.specs || !req.body.variants || req.body.variants.length === 0) {
    res.status(400);
    throw new Error('Specs and at least one variant are required');
  }

  // ---- Create phone ----
  const phone = await Phone.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Phone created successfully',
    data: phone,
  });
});

// ==================== UPDATE PHONE ====================

/**
 * @desc    Update phone details (Admin only)
 * @route   PUT /api/phones/:slug
 * @access  Private (Admin)
 */
const updatePhone = asyncHandler(async (req, res) => {
  let phone = await Phone.findOne({ slug: req.params.slug });

  if (!phone) {
    res.status(404);
    throw new Error('Phone not found');
  }

  // ---- Update phone ----
  phone = await Phone.findOneAndUpdate(
    { slug: req.params.slug },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: 'Phone updated successfully',
    data: phone,
  });
});

// ==================== DELETE PHONE ====================

/**
 * @desc    Delete phone (Admin only)
 * @route   DELETE /api/phones/:slug
 * @access  Private (Admin)
 */
const deletePhone = asyncHandler(async (req, res) => {
  const phone = await Phone.findOne({ slug: req.params.slug });

  if (!phone) {
    res.status(404);
    throw new Error('Phone not found');
  }

  await Phone.deleteOne({ slug: req.params.slug });

  res.status(200).json({
    success: true,
    message: 'Phone deleted successfully',
  });
});

// ==================== HELPER FUNCTIONS ====================

/**
 * Generate recommendation reason based on priority
 */
function getRecommendationReason(phone, priority) {
  const reasons = {
    Gaming: `Best for gaming with AnTuTu score of ${phone.specs.performance.antutuScore.toLocaleString()} and ${phone.specs.display.refreshRate}Hz display`,
    Camera: `Excellent camera setup with ${phone.specs.camera.rear.main.megapixels}MP main sensor${
      phone.specs.camera.rear.main.ois ? ' with OIS' : ''
    }`,
    Vlogging: `Perfect for content creators with ${phone.specs.camera.front.videoCapable4K ? '4K' : 'FHD'} front camera${
      phone.specs.camera.rear.main.ois ? ' and stabilization' : ''
    }`,
    Battery: `${phone.specs.battery.capacity}mAh battery with ${phone.specs.battery.chargingSpeed}W fast charging`,
    Value: `Outstanding value with scores: Gaming ${phone.scores.gaming}, Camera ${phone.scores.camera}, Battery ${phone.scores.battery}`,
  };
  return reasons[priority] || 'Highly recommended phone';
}

/**
 * Generate comparison recommendation
 */
function generateComparisonRecommendation(phones) {
  if (phones.length === 0) return 'No phones to compare';

  const avgPrices = phones.map((p) => p.minVariantPrice);
  const minPrice = Math.min(...avgPrices);
  const cheapest = phones.find((p) => p.minVariantPrice === minPrice);

  return `Best value: ${cheapest.name} at ₹${minPrice.toLocaleString()}`;
}

module.exports = {
  getPhones,
  getPhoneBySlug,
  getPhoneById,
  recommendPhones,
  comparePhones,
  createPhone,
  updatePhone,
  deletePhone,
};