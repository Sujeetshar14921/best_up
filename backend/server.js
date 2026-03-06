require('dotenv').config();
require('colors');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const { initGridFS } = require('./config/gridfs');
const ensureAdminUser = require('./utils/ensureAdminUser');
const rateLimiter = require('./middleware/rateLimiter');
const { cacheMiddleware, clearCache } = require('./middleware/cacheMiddleware');

// Route imports
const phoneRoutes = require('./routes/phoneRoutes');
const phoneAdminRoutes = require('./routes/phoneAdminRoutes');
const brandRoutes = require('./routes/brandRoutes');
const userRoutes = require('./routes/userRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const authRoutes = require('./routes/authRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const { getHealth, getStats, getHealthStatus } = require('./controllers/healthController');

// 1. Database Connect
connectDB();

const app = express();

// 2. Core Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(cors());

// 3. Rate Limiting Middleware (Apply before caching)
app.use(rateLimiter);

// 4. Cache Middleware (for GET requests)
app.use(cacheMiddleware);

// Serve static files
app.use('/uploads', express.static('uploads'));

// Request logging middleware
app.use((req, res, next) => {
  if (req.method !== 'GET') {
    console.log(`\n📨 ${req.method} ${req.path}`);
    console.log(`   Headers:`, req.headers['content-type']);
  }
  next();
});

// 5. Health Check & Stats Routes (No auth required)
// Legacy/frontend-compatible status endpoint
app.get('/api/health/status', getHealthStatus);
app.get('/api/health', getHealth);
app.get('/api/stats', getStats);

// 6. Mount Main Routes
app.use('/api/phones/admin', phoneAdminRoutes);
// Backwards-compatible mount for admin dashboard which expects the extra `/phones` segment
app.use('/api/phones/admin/phones', phoneAdminRoutes);
app.use('/api/phones', phoneRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/users', userRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);

// 7. Analytics & Trending Routes
app.use('/api/analytics', analyticsRoutes);

// 8. API Documentation
app.get('/api', (req, res) => {
  res.json({
    message: 'BestUp API v1.0.0',
    endpoints: {
      health: '/api/health',
      stats: '/api/stats',
      phones: '/api/phones',
      analytics: '/api/analytics',
      brands: '/api/brands',
      users: '/api/users',
      reviews: '/api/reviews',
      wishlist: '/api/wishlist'
    },
    documentation: 'See API_DOCUMENTATION.md'
  });
});

// 9. Default Root Route
app.get('/', (req, res) => {
  res.json({
    message: 'BestUp Backend API',
    status: 'Running',
    version: '1.0.0'
  });
});

// 10. Error Handling Middleware (Must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
  
  // Initialize GridFS when DB connection is open
  const setupOnDatabaseReady = async () => {
    try {
      initGridFS();
      console.log('✅ GridFS initialized for image storage'.green.bold);

      await ensureAdminUser();
      console.log('✅ Admin bootstrap check completed'.green.bold);
    } catch (error) {
      console.error('Startup initialization error:', error.message);
    }
  };

  if (mongoose.connection.readyState === 1) {
    setupOnDatabaseReady();
  } else {
    mongoose.connection.once('open', () => {
      setupOnDatabaseReady();
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error while initializing GridFS:', err.message || err);
    });
  }
});
