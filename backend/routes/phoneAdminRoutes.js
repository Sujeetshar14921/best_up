const express = require('express');
const phoneAdminController = require('../controllers/phoneAdminController');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Phone Management Routes (Admin)
router.post('/admin/phones', upload.single('image'), phoneAdminController.createPhone);
router.get('/admin/phones', phoneAdminController.getAllPhones);
router.get('/admin/phones/:id', phoneAdminController.getPhoneById);
router.get('/admin/phones/:id/image', phoneAdminController.getPhoneImage);
router.put('/admin/phones/:id', upload.single('image'), phoneAdminController.updatePhone);
router.delete('/admin/phones/:id', phoneAdminController.deletePhone);

module.exports = router;
