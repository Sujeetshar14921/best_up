const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  deactivateUser,
  deleteUser,
  registerUser,
  loginUser,
} = require('../controllers/userController');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Admin routes (will add middleware later)
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id/role', updateUserRole);
router.put('/:id/deactivate', deactivateUser);
router.delete('/:id', deleteUser);

module.exports = router;
