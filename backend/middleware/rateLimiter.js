/**
 * Simple In-Memory Rate Limiter Middleware
 * Tracks requests per IP and limits them per time window
 */

const requestCounts = new Map();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 500; // Max requests per window (increased for dev)

// Routes to skip rate limiting (admin endpoints)
const SKIP_PATHS = [
  '/api/health',
  '/api/stats',
  '/api/phones/admin',
  '/api/brands',
  '/api/users'
];

const cleanupOldRequests = () => {
  const now = Date.now();
  for (const [ip, data] of requestCounts.entries()) {
    const recentRequests = data.timestamps.filter(t => now - t < WINDOW_MS);
    if (recentRequests.length === 0) {
      requestCounts.delete(ip);
    } else {
      data.timestamps = recentRequests;
    }
  }
};

const rateLimiter = (req, res, next) => {
  // Skip rate limiting for whitelisted paths
  const shouldSkip = SKIP_PATHS.some(path => req.path.startsWith(path))
  if (shouldSkip) {
    return next()
  }

  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { timestamps: [], count: 0 });
  }

  const data = requestCounts.get(ip);
  
  // Remove old timestamps outside the window
  data.timestamps = data.timestamps.filter(t => now - t < WINDOW_MS);

  if (data.timestamps.length >= MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests, please try again later',
      retryAfter: Math.ceil((data.timestamps[0] + WINDOW_MS - now) / 1000)
    });
  }

  data.timestamps.push(now);

  // Cleanup every 100 requests to prevent memory leaks
  if (requestCounts.size % 100 === 0) {
    cleanupOldRequests();
  }

  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
  res.setHeader('X-RateLimit-Remaining', MAX_REQUESTS - data.timestamps.length);
  res.setHeader('X-RateLimit-Reset', new Date(now + WINDOW_MS).toISOString());

  next();
};

module.exports = rateLimiter;
