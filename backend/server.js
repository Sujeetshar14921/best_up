require('dotenv').config(); // .env load karega
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const { initGridFS } = require('./config/gridfs');
const phoneRoutes = require('./routes/phoneRoutes');
const phoneAdminRoutes = require('./routes/phoneAdminRoutes');
const brandRoutes = require('./routes/brandRoutes');
const userRoutes = require('./routes/userRoutes');
const bannerRoutes = require('./routes/bannerRoutes');

// 1. Database Connect
connectDB();

const app = express();

// 2. Middlewares
app.use(express.json({ limit: '50mb' })); // Body parser with larger limit
app.use(express.urlencoded({ limit: '50mb' })); // URL encoded with larger limit
app.use(cors()); // Allow frontend requests

// Serve static files for banner uploads
app.use('/uploads', express.static('uploads'))

// Add request logging middleware
app.use((req, res, next) => {
  if (req.method !== 'GET') {
    console.log(`\n📨 ${req.method} ${req.path}`);
    console.log(`   Headers:`, req.headers['content-type']);
  }
  next();
});

// 3. Mount Routes
app.use('/api/phones', phoneRoutes);
app.use('/api/phones', phoneAdminRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/users', userRoutes);
app.use('/api/banners', bannerRoutes);

// 4. Default Route
app.get('/', (req, res) => {
  res.send('BestUp API is running...');
});

// 5. Error Handling Middleware (Last me aana chahiye)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
  
  // Initialize GridFS when DB connection is open
  const setupGridFS = () => {
    try {
      initGridFS();
      console.log('✅ GridFS initialized for image storage'.green.bold);
    } catch (error) {
      console.error('GridFS initialization error:', error.message);
    }
  };

  if (mongoose.connection.readyState === 1) {
    setupGridFS();
  } else {
    mongoose.connection.once('open', () => {
      setupGridFS();
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error while initializing GridFS:', err.message || err);
    });
  }
});
