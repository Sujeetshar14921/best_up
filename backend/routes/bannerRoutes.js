const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const {
  getBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner
} = require('../controllers/bannerController')

// Configure multer for banner uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/banners')
    const fs = require('fs')
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'banner-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'image/svg+xml', 'image/bmp', 'image/x-icon', 'image/vnd.microsoft.icon',
      'image/tiff', 'image/avif'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only common image types are allowed (jpeg, png, gif, webp, svg, bmp, ico, tiff, avif).'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
})

// Public routes
router.get('/', getBanners)
router.get('/:id', getBanner)

// Admin routes
router.post('/', upload.single('image'), createBanner)
router.put('/:id', upload.single('image'), updateBanner)
router.delete('/:id', deleteBanner)

module.exports = router
