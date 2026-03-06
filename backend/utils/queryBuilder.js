/**
 * Advanced Filtering & Pagination Helper
 * Provides utilities for complex queries
 */

const buildAdvancedFilter = (query) => {
  const filters = {};

  // Price range filter
  if (query.minPrice || query.maxPrice) {
    filters.basePrice = {};
    if (query.minPrice) filters.basePrice.$gte = Number(query.minPrice);
    if (query.maxPrice) filters.basePrice.$lte = Number(query.maxPrice);
  }

  // RAM filter
  if (query.minRam) {
    filters['specs.performance.ramOptions'] = {
      $elemMatch: { $gte: Number(query.minRam) }
    };
  }

  // Storage filter
  if (query.storage) {
    filters['variants.storage'] = Number(query.storage);
  }

  // Display size filter
  if (query.minDisplay || query.maxDisplay) {
    filters['specs.display.size'] = {};
    if (query.minDisplay) filters['specs.display.size'].$gte = Number(query.minDisplay);
    if (query.maxDisplay) filters['specs.display.size'].$lte = Number(query.maxDisplay);
  }

  // Refresh rate filter
  if (query.minRefreshRate) {
    filters['specs.display.refreshRate'] = {
      $gte: Number(query.minRefreshRate)
    };
  }

  // Brand filter (case-insensitive)
  if (query.brand) {
    filters.brand = { $regex: query.brand, $options: 'i' };
  }

  // Multiple brands
  if (query.brands) {
    const brandList = Array.isArray(query.brands) ? query.brands : [query.brands];
    filters.brand = { $in: brandList.map(b => new RegExp(b, 'i')) };
  }

  return filters;
};

/**
 * Build sorting object
 */
const buildSort = (sortBy = 'createdAt') => {
  const sortOptions = {
    'price-asc': { basePrice: 1 },
    'price-desc': { basePrice: -1 },
    'name-asc': { name: 1 },
    'name-desc': { name: -1 },
    'rating-desc': { 'scores.valueForMoney': -1 },
    'gaming-desc': { 'scores.gaming': -1 },
    'camera-desc': { 'scores.camera': -1 },
    'battery-desc': { 'scores.battery': -1 },
    'newest': { createdAt: -1 },
    'oldest': { createdAt: 1 },
    'trending': { reviewCount: -1 }
  };

  return sortOptions[sortBy] || { [sortBy]: -1 };
};

/**
 * Calculate pagination
 */
const calculatePagination = (limit = 10, page = 1) => {
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  return { skip, limit: limitNum, page: pageNum };
};

/**
 * Format pagination response
 */
const getPaginationMeta = (total, limit, page) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    currentPage: page,
    totalPages,
    totalRecords: total,
    recordsPerPage: limit,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null
  };
};

module.exports = {
  buildAdvancedFilter,
  buildSort,
  calculatePagination,
  getPaginationMeta
};
