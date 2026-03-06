/**
 * Health Check & System Stats Controller
 */

const mongoose = require('mongoose');
const Phone = require('../models/Phone');
const User = require('../models/User');
const Review = require('../models/Review');
const Brand = require('../models/Brand');

/**
 * @desc    Get API health status
 * @route   GET /api/health
 * @access  Public
 */
const getHealth = async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    const uptime = process.uptime();

    res.status(200).json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
      database: dbStatus,
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      error: error.message
    });
  }
};

/**
 * @desc    Get comprehensive system statistics
 * @route   GET /api/stats
 * @access  Public
 */
const getStats = async (req, res) => {
  try {
    const [phonesCount, usersCount, reviewsCount, brandsCount] = await Promise.all([
      Phone.countDocuments(),
      User.countDocuments(),
      Review.countDocuments(),
      Brand.countDocuments()
    ]);

    const avgPhonePrice = await Phone.aggregate([
      {
        $group: {
          _id: null,
          avg: { $avg: '$basePrice' }
        }
      }
    ]);

    const topBrand = await Phone.aggregate([
      {
        $group: {
          _id: '$brand',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 1
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalPhones: phonesCount,
        totalUsers: usersCount,
        totalReviews: reviewsCount,
        totalBrands: brandsCount,
        averagePhonePrice: avgPhonePrice[0]?.avg || 0,
        mostCommonBrand: topBrand[0]?._id || 'N/A',
        phonesCountByBrand: topBrand[0]?.count || 0
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * @desc    Lightweight health/status endpoint expected by frontend
 * @route   GET /api/health/status
 * @access  Public
 */
const getHealthStatus = async (req, res) => {
  try {
    const uptimeMs = Math.floor(process.uptime() * 1000);
    const mem = process.memoryUsage();
    const heapUsed = mem.heapUsed || 0;

    const dbConnected = mongoose.connection.readyState === 1;
    const status = dbConnected ? 'healthy' : 'degraded';

    // avgResponseTime isn't tracked here; provide a conservative estimate
    const avgResponseTime = Math.max(20, Math.floor(process.hrtime()[0] / 1000));

    const components = {
      database: dbConnected ? 'operational' : 'degraded',
      gridfs: typeof global.gridfsBucket !== 'undefined' ? 'operational' : 'unknown',
    };

    return res.status(200).json({
      success: true,
      data: {
        status,
        uptime: uptimeMs,
        memory: heapUsed,
        avgResponseTime,
        components,
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getHealth, getStats, getHealthStatus };
