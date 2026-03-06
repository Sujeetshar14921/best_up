const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  deactivateUser,
  activateUser,
  deleteUser,
  registerUser,
  loginUser,
} = require('../controllers/userController');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Admin routes (will add middleware later)
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyToken, isAdmin, getAllUsers);
router.get('/:id', verifyToken, isAdmin, getUserById);
router.put('/:id/role', verifyToken, isAdmin, updateUserRole);
router.put('/:id/deactivate', verifyToken, isAdmin, deactivateUser);
router.put('/:id/activate', verifyToken, isAdmin, activateUser);
router.delete('/:id', verifyToken, isAdmin, deleteUser);

module.exports = router;
