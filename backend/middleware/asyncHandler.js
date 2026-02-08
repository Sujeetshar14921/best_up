const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res)).catch((error) => {
    console.error('❌ AsyncHandler caught error:', error.message);
    console.error('Stack:', error.stack);
    next(error);
  });
};

module.exports = asyncHandler;