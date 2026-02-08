const Banner = require('../models/Banner')
const asyncHandler = require('../middleware/asyncHandler')
const fs = require('fs')
const path = require('path')

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/banners')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Get all banners
const getBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find().sort({ createdAt: -1 })
  res.json({
    success: true,
    data: banners
  })
})

// Get single banner
const getBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id)
  if (!banner) {
    return res.status(404).json({
      success: false,
      message: 'Banner not found'
    })
  }
  res.json({
    success: true,
    data: banner
  })
})

// Create banner
const createBanner = asyncHandler(async (req, res) => {
  const { title, description, imageUrl, linkUrl, position, isActive } = req.body
  let finalImageUrl = imageUrl

  if (!title) {
    return res.status(400).json({
      success: false,
      message: 'Title is required'
    })
  }

  // Handle file upload
  if (req.file) {
    finalImageUrl = `/uploads/banners/${req.file.filename}`
  } else if (!imageUrl) {
    return res.status(400).json({
      success: false,
      message: 'Image URL or file is required'
    })
  }

  const banner = await Banner.create({
    title,
    description,
    imageUrl: finalImageUrl,
    linkUrl,
    position: position || 'horizontal',
    isActive: isActive !== 'false'
  })

  res.status(201).json({
    success: true,
    message: 'Banner created successfully',
    data: banner
  })
})

// Update banner
const updateBanner = asyncHandler(async (req, res) => {
  const { title, description, imageUrl, linkUrl, position, isActive } = req.body

  let banner = await Banner.findById(req.params.id)
  if (!banner) {
    return res.status(404).json({
      success: false,
      message: 'Banner not found'
    })
  }

  // Handle file upload
  if (req.file) {
    // Delete old file if it exists and is local
    if (banner.imageUrl && banner.imageUrl.includes('/uploads/banners/')) {
      const oldPath = path.join(__dirname, '..', banner.imageUrl)
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath)
      }
    }
    banner.imageUrl = `/uploads/banners/${req.file.filename}`
  } else if (imageUrl) {
    banner.imageUrl = imageUrl
  }

  if (title) banner.title = title
  if (description !== undefined) banner.description = description
  if (linkUrl !== undefined) banner.linkUrl = linkUrl
  if (position) banner.position = position
  if (isActive !== undefined) banner.isActive = isActive !== 'false'

  banner = await banner.save()

  res.json({
    success: true,
    message: 'Banner updated successfully',
    data: banner
  })
})

// Delete banner
const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id)

  if (!banner) {
    return res.status(404).json({
      success: false,
      message: 'Banner not found'
    })
  }

  // Delete file if it exists and is local
  if (banner.imageUrl && banner.imageUrl.includes('/uploads/banners/')) {
    const filePath = path.join(__dirname, '..', banner.imageUrl)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  }

  res.json({
    success: true,
    message: 'Banner deleted successfully'
  })
})

module.exports = {
  getBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner
}
