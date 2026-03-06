const express = require('express');
const phoneAdminController = require('../controllers/phoneAdminController');
const upload = require('../middleware/uploadMiddleware');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Phone Management Routes (Admin)
// Routes are mounted at /api/phones/admin, so use / as base
router.post('/', verifyToken, isAdmin, upload.single('image'), phoneAdminController.createPhone);
router.get('/', verifyToken, isAdmin, phoneAdminController.getAllPhones);
router.get('/:id', verifyToken, isAdmin, phoneAdminController.getPhoneById);
// Image endpoint remains public for previews
router.get('/:id/image', phoneAdminController.getPhoneImage);
router.put('/:id', verifyToken, isAdmin, upload.single('image'), phoneAdminController.updatePhone);
router.delete('/:id', verifyToken, isAdmin, phoneAdminController.deletePhone);

module.exports = router;
