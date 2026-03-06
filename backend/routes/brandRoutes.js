const express = require('express');
const router = express.Router();
const {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} = require('../controllers/brandController');

// Public routes
router.get('/', getAllBrands);
router.get('/:id', getBrandById);

const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Admin routes
router.post('/', verifyToken, isAdmin, createBrand);
router.put('/:id', verifyToken, isAdmin, updateBrand);
router.delete('/:id', verifyToken, isAdmin, deleteBrand);

module.exports = router;
