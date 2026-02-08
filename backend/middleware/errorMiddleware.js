const colors = require('colors');

/**
 * Global Error Handling Middleware
 * Catches all errors thrown by controllers and formats them as JSON responses
 */
const errorHandler = (err, req, res, next) => {
  // Determine status code
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Determine error message
  let message = err.message || 'Server Error';

  // ==================== MONGOOSE ERRORS ====================

  // Mongoose Validation Error (e.g., required field missing)
  if (err.name === 'ValidationError') {
    statusCode = 422;
    const messages = Object.values(err.errors).map((e) => e.message);
    message = `Validation Error: ${messages.join(', ')}`;
  }

  // Mongoose Cast Error (e.g., invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ID format: ${err.value}`;
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} already exists`;
  }

  // ==================== CUSTOM ERRORS ====================

  // JWT Authentication Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // ==================== RESPONSE ====================

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR] ${statusCode} - ${message}`.red.bold);
    console.error(err.stack);
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: message,
    statusCode,
    // Include stack trace only in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { errorHandler };