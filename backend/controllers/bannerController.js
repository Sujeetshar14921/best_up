const Banner = require('../models/Banner')
const asyncHandler = require('../middleware/asyncHandler')
const { getGridFS } = require('../config/gridfs')
const mongoose = require('mongoose')
const { Readable } = require('stream')

// Get all banners
const getBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find().sort({ createdAt: -1 })
  
  // Add image URL for each banner
  const bannersWithImages = banners.map(banner => ({
    ...banner.toObject(),
    imageUrl: banner.imageId ? `/api/banners/${banner._id}/image` : banner.imageUrl
  }))
  
  res.json({
    success: true,
    data: bannersWithImages
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
  
  const bannerObj = banner.toObject()
  if (banner.imageId) {
    bannerObj.imageUrl = `/api/banners/${banner._id}/image`
  }
  
  res.json({
    success: true,
    data: bannerObj
  })
})

// Get banner image from GridFS
const getBannerImage = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id)

  if (!banner || !banner.imageId) {
    return res.status(404).json({
      success: false,
      message: 'Banner or image not found'
    })
  }

  try {
    const gfs = getGridFS('banners')
    const downloadStream = gfs.openDownloadStream(
      new mongoose.Types.ObjectId(banner.imageId)
    )

    res.set('Content-Type', 'image/jpeg')
    res.set('Cache-Control', 'public, max-age=3600')
    downloadStream.pipe(res)

    downloadStream.on('error', (error) => {
      res.status(500).json({
        success: false,
        message: 'Error downloading image'
      })
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving image: ' + error.message
    })
  }
})

// Create banner
const createBanner = asyncHandler(async (req, res) => {
  const { title, description, imageUrl, linkUrl, position, isActive } = req.body

  if (!title) {
    return res.status(400).json({
      success: false,
      message: 'Title is required'
    })
  }

  let imageId = null
  let imageName = null

  // Handle file upload to GridFS
  if (req.file) {
    try {
      const gfs = getGridFS('banners')
      const readableStream = Readable.from(req.file.buffer)

      const uploadStream = gfs.openUploadStream(req.file.originalname, {
        metadata: {
          bannerTitle: title,
          uploadedAt: new Date(),
          mimetype: req.file.mimetype
        }
      })

      readableStream.pipe(uploadStream)

      await new Promise((resolve, reject) => {
        uploadStream.on('finish', () => {
          imageId = uploadStream.id
          imageName = req.file.originalname
          resolve()
        })
        uploadStream.on('error', reject)
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Image upload failed: ' + error.message
      })
    }
  } else if (!imageUrl) {
    return res.status(400).json({
      success: false,
      message: 'Image or file is required'
    })
  }

  const banner = await Banner.create({
    title,
    description,
    imageId: imageId || null,
    imageName: imageName || null,
    imageUrl: imageUrl || null,
    linkUrl,
    position: position || 'horizontal',
    isActive: isActive !== 'false'
  })

  const bannerObj = banner.toObject()
  if (banner.imageId) {
    bannerObj.imageUrl = `/api/banners/${banner._id}/image`
  }

  res.status(201).json({
    success: true,
    message: 'Banner created successfully',
    data: bannerObj
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
    try {
      // Delete old image from GridFS if it exists
      if (banner.imageId) {
        try {
          const gfs = getGridFS('banners')
          await gfs.delete(new mongoose.Types.ObjectId(banner.imageId))
        } catch (deleteError) {
          console.error('Error deleting old image from GridFS:', deleteError)
        }
      }

      // Upload new image
      const gfs = getGridFS('banners')
      const readableStream = Readable.from(req.file.buffer)

      const uploadStream = gfs.openUploadStream(req.file.originalname, {
        metadata: {
          bannerTitle: title,
          uploadedAt: new Date(),
          mimetype: req.file.mimetype
        }
      })

      readableStream.pipe(uploadStream)

      await new Promise((resolve, reject) => {
        uploadStream.on('finish', () => {
          banner.imageId = uploadStream.id
          banner.imageName = req.file.originalname
          resolve()
        })
        uploadStream.on('error', reject)
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Image upload failed: ' + error.message
      })
    }
  } else if (imageUrl) {
    banner.imageUrl = imageUrl
  }

  if (title) banner.title = title
  if (description !== undefined) banner.description = description
  if (linkUrl !== undefined) banner.linkUrl = linkUrl
  if (position) banner.position = position
  if (isActive !== undefined) banner.isActive = isActive !== 'false'

  banner = await banner.save()

  const bannerObj = banner.toObject()
  if (banner.imageId) {
    bannerObj.imageUrl = `/api/banners/${banner._id}/image`
  }

  res.json({
    success: true,
    message: 'Banner updated successfully',
    data: bannerObj
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

  // Delete image from GridFS if it exists
  if (banner.imageId) {
    try {
      const gfs = getGridFS('banners')
      await gfs.delete(new mongoose.Types.ObjectId(banner.imageId))
    } catch (deleteError) {
      console.error('Error deleting image from GridFS:', deleteError)
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
  getBannerImage,
  createBanner,
  updateBanner,
  deleteBanner
}
