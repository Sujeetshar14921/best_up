const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    imageId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    imageName: {
      type: String,
      default: null
    },
    imageUrl: {
      type: String,
      default: null
    },
    linkUrl: {
      type: String,
      trim: true
    },
    position: {
      type: String,
      enum: ['horizontal', 'vertical'],
      default: 'horizontal'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Banner', bannerSchema)
