const express = require('express')
const router = express.Router()
const multer = require('multer')
const {
  getBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
  getBannerImage
} = require('../controllers/bannerController')

// Configure multer for memory storage
const storage = multer.memoryStorage()

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'image/svg+xml', 'image/bmp', 'image/x-icon', 'image/vnd.microsoft.icon',
      'image/tiff', 'image/avif'
    ]
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only common image types are allowed (jpeg, png, gif, webp, svg, bmp, ico, tiff, avif).'), false)
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
})

// Public routes
router.get('/', getBanners)
router.get('/:id', getBanner)
router.get('/:id/image', getBannerImage)

// Admin routes
router.post('/', upload.single('image'), createBanner)
router.put('/:id', upload.single('image'), updateBanner)
router.delete('/:id', deleteBanner)

module.exports = router
