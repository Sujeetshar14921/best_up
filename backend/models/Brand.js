const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand name is required'],
      unique: true,
      trim: true,
    },
    logo: {
      type: String,
      required: [true, 'Brand logo is required'],
      description: 'URL or emoji for brand logo',
    },
    logoType: {
      type: String,
      enum: ['emoji', 'url', 'image'],
      default: 'emoji',
    },
    description: String,
    website: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Brand', brandSchema);
