#!/usr/bin/env node

/**
 * Quick Reference: New Backend Features
 * Run this file or read it for quick help
 */

const features = {
  "🔐 Rate Limiting": {
    description: "100 requests per 15 minutes per IP",
    file: "middleware/rateLimiter.js",
    headers: [
      "X-RateLimit-Limit: 100",
      "X-RateLimit-Remaining: 95",
      "X-RateLimit-Reset: 2026-02-24T10:45:00Z"
    ],
    usage: "Automatic - applied to all routes"
  },
  
  "💾 Response Caching": {
    description: "5-minute cache for GET requests",
    file: "middleware/cacheMiddleware.js",
    headers: [
      "X-Cache: HIT (from cache)",
      "X-Cache: MISS (fresh from DB)",
      "X-Cache-Age: 234 (seconds)"
    ],
    usage: "Automatic - applied to all GET routes"
  },
  
  "✅ Request Validation": {
    description: "Joi validation for all inputs",
    file: "middleware/joiValidation.js",
    schemas: [
      "phone - Create/update phone",
      "userRegister - User registration",
      "userLogin - User login",
      "searchQuery - Search filters",
      "review - Create review",
      "brand - Create brand"
    ],
    usage: "Add validate('schema') middleware to routes"
  },
  
  "📊 Analytics Endpoints": {
    description: "6 new analytics endpoints",
    file: "controllers/analyticsController.js",
    endpoints: [
      "GET /api/analytics/trending - Trending phones",
      "GET /api/analytics/most-reviewed - Most reviewed",
      "GET /api/analytics/top-rated - Top rated by category",
      "GET /api/analytics/price-stats - Price statistics",
      "GET /api/analytics/by-segment - Phones by price segment",
      "GET /api/analytics/suggestions - Search suggestions"
    ]
  },
  
  "🏥 Health Monitoring": {
    description: "Health check and system stats",
    file: "controllers/healthController.js",
    endpoints: [
      "GET /api/health - API health status",
      "GET /api/stats - System statistics"
    ]
  },
  
  "🔍 Advanced Filtering": {
    description: "Advanced query & pagination helpers",
    file: "utils/queryBuilder.js",
    functions: [
      "buildAdvancedFilter() - Complex filtering",
      "buildSort() - Multiple sort options",
      "calculatePagination() - Pagination logic",
      "getPaginationMeta() - Pagination info"
    ]
  }
};

const sortOptions = [
  "price-asc    → Lowest price first",
  "price-desc   → Highest price first",
  "name-asc     → A to Z",
  "name-desc    → Z to A",
  "rating-desc  → Highest rating first",
  "gaming-desc  → Best gaming phones",
  "camera-desc  → Best camera phones",
  "battery-desc → Best battery",
  "newest       → Recently added",
  "oldest       → Oldest first"
];

const categories = [
  "gaming      → Gaming performance",
  "camera      → Camera quality",
  "battery     → Battery life",
  "display     → Display quality",
  "valueForMoney → Value for money"
];

const examples = {
  "Trending Phones": "GET /api/analytics/trending?limit=10",
  "Top Gaming": "GET /api/analytics/top-rated?category=gaming&limit=5",
  "Budget Phones": "GET /api/phones?maxPrice=30000&limit=10",
  "Samsung Phones": "GET /api/phones?brand=Samsung&limit=10",
  "Price Stats": "GET /api/analytics/price-stats",
  "Search Suggest": "GET /api/analytics/suggestions?q=iphone",
  "Health Check": "GET /api/health",
  "System Stats": "GET /api/stats"
};

// Print formatted output
console.log("\n" + "=".repeat(60));
console.log("🚀 BESTUP BACKEND - NEW FEATURES QUICK REFERENCE");
console.log("=".repeat(60) + "\n");

// Print features
Object.entries(features).forEach(([name, details]) => {
  console.log(`\n${name}`);
  console.log("-".repeat(40));
  console.log(`📄 File: ${details.file}`);
  console.log(`📝 Description: ${details.description}`);
  
  if (details.headers) {
    console.log("📤 Response Headers:");
    details.headers.forEach(h => console.log(`   • ${h}`));
  }
  
  if (details.schemas) {
    console.log("📋 Schemas:");
    details.schemas.forEach(s => console.log(`   • ${s}`));
  }
  
  if (details.endpoints) {
    console.log("🔗 Endpoints:");
    details.endpoints.forEach(e => console.log(`   • ${e}`));
  }
  
  if (details.functions) {
    console.log("⚙️ Functions:");
    details.functions.forEach(f => console.log(`   • ${f}`));
  }
});

// Print sort options
console.log("\n\n" + "=".repeat(60));
console.log("🔀 SORT OPTIONS");
console.log("=".repeat(60));
sortOptions.forEach(opt => console.log(`   ${opt}`));

// Print categories
console.log("\n\n" + "=".repeat(60));
console.log("📂 RATING CATEGORIES");
console.log("=".repeat(60));
categories.forEach(cat => console.log(`   ${cat}`));

// Print examples
console.log("\n\n" + "=".repeat(60));
console.log("📌 QUICK EXAMPLES");
console.log("=".repeat(60));
Object.entries(examples).forEach(([name, url]) => {
  console.log(`\n${name}:`);
  console.log(`   ${url}`);
});

// Print response headers info
console.log("\n\n" + "=".repeat(60));
console.log("📊 RESPONSE HEADERS TO CHECK");
console.log("=".repeat(60));
console.log(`
   X-Cache: HIT | MISS
   X-Cache-Age: <seconds>
   X-RateLimit-Limit: 100
   X-RateLimit-Remaining: 95
   X-RateLimit-Reset: <date>
`);

// Print tips
console.log("\n" + "=".repeat(60));
console.log("💡 QUICK TIPS");
console.log("=".repeat(60));
console.log(`
   1️⃣  Check X-Cache header to see caching status
   2️⃣  Monitor X-RateLimit-Remaining to avoid 429 errors
   3️⃣  Use pagination (limit & page) for large results
   4️⃣  Combine filters for advanced queries
   5️⃣  Use /api/health to monitor API status
   6️⃣  Use /api/stats to see system metrics
   7️⃣  Check NEW_FEATURES.md for full documentation
   8️⃣  See API_EXAMPLES.js for usage examples
`);

console.log("=".repeat(60) + "\n");

module.exports = {
  features,
  sortOptions,
  categories,
  examples
};
