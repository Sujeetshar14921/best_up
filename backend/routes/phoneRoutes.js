const express = require('express');
const router = express.Router();
const {
  getPhones,
  getPhoneBySlug,
  getPhoneById,
  recommendPhones,
  comparePhones,
  createPhone,
  updatePhone,
  deletePhone,
} = require('../controllers/phoneController');
const { validate } = require('../middleware/joiValidation');

// ==================== MAIN ROUTES ====================

// GET all phones with filtering, search, pagination
router.get('/', validate('searchQuery'), getPhones);

// POST new phone (Admin)
router.post('/', validate('phone'), createPhone);

// ==================== SMART RECOMMENDATION ====================

// GET smart recommendations based on budget & priority
router.get('/recommend', recommendPhones);

// ==================== COMPARISON ====================

// GET comparison of multiple phones
router.get('/compare', comparePhones);

// ==================== SINGLE PHONE ROUTES ====================

// GET phone by slug (URL-friendly: /api/phones/iphone-16-pro)
router.get('/:slug', getPhoneBySlug);

// PUT update phone by slug
router.put('/:slug', validate('phone'), updatePhone);

// DELETE phone by slug
router.delete('/:slug', deletePhone);

// Note: Place dynamic routes AFTER /recommend and /compare to avoid conflicts
// Otherwise, "recommend" and "compare" would be treated as slugs

module.exports = router;