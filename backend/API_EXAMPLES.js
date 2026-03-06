/**
 * API Examples - How to use the new features
 * Copy & paste these examples in Postman or your API client
 */

// ============================================
// 🏥 HEALTH & MONITORING
// ============================================

/**
 * Check API Health
 * GET http://localhost:5000/api/health
 */
// Response shows uptime, database status, and version

/**
 * Get System Statistics
 * GET http://localhost:5000/api/stats
 */
// Response shows total phones, users, reviews, brands, and average prices

// ============================================
// 📊 ANALYTICS & TRENDING
// ============================================

/**
 * Get Trending Phones (Last 7 Days)
 * GET http://localhost:5000/api/analytics/trending
 * GET http://localhost:5000/api/analytics/trending?limit=5&timeframe=7d
 */

/**
 * Get Most Reviewed Phones
 * GET http://localhost:5000/api/analytics/most-reviewed?limit=10
 */

/**
 * Get Top Gaming Phones
 * GET http://localhost:5000/api/analytics/top-rated?category=gaming&limit=5
 * 
 * Categories: gaming, camera, battery, display, valueForMoney
 */

/**
 * Get Top Camera Phones
 * GET http://localhost:5000/api/analytics/top-rated?category=camera&limit=5
 */

/**
 * Get Price Statistics
 * GET http://localhost:5000/api/analytics/price-stats
 */

/**
 * Get Phones by Price Segment
 * GET http://localhost:5000/api/analytics/by-segment
 * 
 * Returns:
 * - Budget (0-15k)
 * - Mid-Range (15k-40k)
 * - Premium (40k-80k)
 * - Flagship (80k+)
 */

/**
 * Get Search Suggestions (Autocomplete)
 * GET http://localhost:5000/api/analytics/suggestions?q=ip
 * GET http://localhost:5000/api/analytics/suggestions?q=samsung
 */

// ============================================
// 🔍 ADVANCED SEARCH & FILTERING
// ============================================

/**
 * Simple Search
 * GET http://localhost:5000/api/phones?search=iPhone&limit=10
 */

/**
 * Filter by Brand
 * GET http://localhost:5000/api/phones?brand=Apple&limit=10
 */

/**
 * Filter by Price Range
 * GET http://localhost:5000/api/phones?minPrice=50000&maxPrice=100000&limit=10
 */

/**
 * Complex Filter - Best Gaming Phones Under 50k
 * GET http://localhost:5000/api/phones?maxPrice=50000&sort=gaming-desc&limit=10
 */

/**
 * Filter by RAM
 * GET http://localhost:5000/api/phones?minRam=8&limit=10
 */

/**
 * Filter by Display Size & Refresh Rate
 * GET http://localhost:5000/api/phones?minDisplay=6.5&minRefreshRate=120&limit=10
 */

/**
 * Combine Multiple Filters
 * GET http://localhost:5000/api/phones?
 *   search=Galaxy
 *   &brand=Samsung
 *   &minPrice=30000
 *   &maxPrice=80000
 *   &minRam=8
 *   &minRefreshRate=120
 *   &sort=price-asc
 *   &limit=20
 *   &page=1
 */

// ============================================
// 📄 PAGINATION
// ============================================

/**
 * Get Page 1 with 20 items per page
 * GET http://localhost:5000/api/phones?limit=20&page=1
 */

/**
 * Get Page 2
 * GET http://localhost:5000/api/phones?limit=20&page=2
 */

/**
 * Response includes pagination metadata:
 * {
 *   "pagination": {
 *     "currentPage": 1,
 *     "totalPages": 5,
 *     "totalRecords": 87,
 *     "hasNextPage": true,
 *     "nextPage": 2,
 *     "prevPage": null
 *   }
 * }
 */

// ============================================
// 💾 CACHING
// ============================================

/**
 * Check Cache Headers
 * GET http://localhost:5000/api/phones
 * 
 * Response Headers:
 * X-Cache: HIT (from cache) or MISS (fresh from database)
 * X-Cache-Age: 234 (seconds in cache)
 */

/**
 * Cache hits reduce server load
 * Same query within 5 minutes will be cached
 */

// ============================================
// 🚦 RATE LIMITING
// ============================================

/**
 * Rate Limit Info in Response Headers:
 * X-RateLimit-Limit: 100
 * X-RateLimit-Remaining: 95
 * X-RateLimit-Reset: 2026-02-24T10:45:00Z
 * 
 * Limit: 100 requests per 15 minutes per IP
 * If exceeded: 429 Too Many Requests
 */

// ============================================
// ✅ VALIDATION EXAMPLES
// ============================================

/**
 * Create Phone (Valid Request)
 * POST http://localhost:5000/api/phones/admin/phones
 * Content-Type: application/json
 */
// {
//   "name": "iPhone 16 Pro",
//   "brand": "Apple",
//   "basePrice": 129999,
//   "overview": "Premium flagship phone",
//   "pros": ["Great camera", "Fast processor"],
//   "cons": ["Expensive"],
//   "variants": [
//     {
//       "ram": 8,
//       "storage": 256,
//       "color": "Black",
//       "price": 129999,
//       "sku": "IP16P-8-256",
//       "stock": 50
//     }
//   ]
// }

/**
 * Invalid Request (Missing Required Fields)
 * Response:
 * {
 *   "success": false,
 *   "error": "Validation Error",
 *   "details": [
 *     {
 *       "field": "name",
 *       "message": "\"name\" is required"
 *     }
 *   ]
 * }
 */

// ============================================
// 🎯 COMMON USE CASES
// ============================================

/**
 * 1. Show Trending Phones on Homepage
 * GET /api/analytics/trending?limit=10
 */

/**
 * 2. Auto-complete Search Bar
 * GET /api/analytics/suggestions?q=user_input
 */

/**
 * 3. Filter Phones by Budget
 * GET /api/phones?minPrice=10000&maxPrice=30000&sort=rating-desc
 */

/**
 * 4. Gaming-focused Recommendation
 * GET /api/analytics/top-rated?category=gaming&limit=5
 */

/**
 * 5. Camera Phones for Photographers
 * GET /api/analytics/top-rated?category=camera&limit=10
 */

/**
 * 6. Best Value Phones
 * GET /api/analytics/top-rated?category=valueForMoney&limit=10
 */

/**
 * 7. Price Comparison
 * GET /api/analytics/price-stats
 */

/**
 * 8. Monitor API Health
 * GET /api/health
 */

/**
 * 9. System Status Dashboard
 * GET /api/stats
 */

/**
 * 10. Infinite Scroll Pagination
 * GET /api/phones?limit=20&page=1
 * GET /api/phones?limit=20&page=2
 * GET /api/phones?limit=20&page=3
 */

// ============================================
// 🔗 RESPONSE HEADERS TO CHECK
// ============================================

/*
Content-Type: application/json
X-Cache: HIT|MISS
X-Cache-Age: <seconds>
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: <ISO datetime>
*/
