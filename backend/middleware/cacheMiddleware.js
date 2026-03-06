/**
 * Simple In-Memory Cache Middleware
 * Caches GET request responses for improved performance
 */

const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCacheKey = (req) => {
  return `${req.method}:${req.originalUrl}`;
};

const cacheMiddleware = (req, res, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next();
  }

  const cacheKey = getCacheKey(req);
  const cachedData = cache.get(cacheKey);

  // Return cached data if available
  if (cachedData) {
    const age = Date.now() - cachedData.timestamp;
    if (age < CACHE_DURATION) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('X-Cache-Age', Math.floor(age / 1000));
      return res.json(cachedData.data);
    } else {
      cache.delete(cacheKey);
    }
  }

  // Intercept res.json() to cache the response
  const originalJson = res.json.bind(res);
  res.json = function(data) {
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });

    res.setHeader('X-Cache', 'MISS');
    return originalJson(data);
  };

  next();
};

// Function to clear cache by pattern
const clearCache = (pattern) => {
  if (!pattern) {
    cache.clear();
    console.log('✅ Cache cleared');
    return;
  }

  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
  console.log(`✅ Cache cleared for pattern: ${pattern}`);
};

// Cleanup old cache entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
}, 10 * 60 * 1000);

module.exports = { cacheMiddleware, clearCache, cache };
