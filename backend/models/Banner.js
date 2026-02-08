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
    imageUrl: {
      type: String,
      required: true
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
