const User = require('../models/User');
const { generateToken } = require('../middleware/authMiddleware');
const asyncHandler = require('../middleware/asyncHandler');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.validatedData;

  
  
  // Check if user already exists
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email',
    });
  }

  // Create user
  user = await User.create({
    name,
    email,
    password,
  });

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  user.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
  user.emailVerificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  await user.save();

  // TODO: Send verification email
  console.log('📧 Verification token:', verificationToken);

  const token = generateToken(user._id, user.role);

  res.status(201).json({
    success: true,
    message: 'User registered successfully. Check your email for verification link.',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    },
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.validatedData;

  // Get user with password field
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  // Compare password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    },
  });
});

/**
 * @desc    Verify email token
 * @route   POST /api/auth/verify-email
 * @access  Public
 */
exports.verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Verification token is required',
    });
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired verification token',
    });
  }

  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Email verified successfully',
  });
});

/**
 * @desc    Request password reset
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.validatedData;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found with this email',
    });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
  await user.save();

  // TODO: Send reset password email
  console.log('📧 Password reset token:', resetToken);

  res.status(200).json({
    success: true,
    message: 'Password reset link sent to your email',
    // For testing only - remove in production
    resetToken: resetToken,
  });
});

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.validatedData;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired reset token',
    });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successfully',
  });
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId)
    .populate('submittedPhones')
    .populate('wishlist')
    .populate('comparisonList');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    user,
  });
});
