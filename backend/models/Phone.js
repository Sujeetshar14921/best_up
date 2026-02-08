const mongoose = require('mongoose');

const phoneSchema = new mongoose.Schema(
  {
    // ==================== BASIC INFO ====================
    name: {
      type: String,
      required: [true, 'Phone name is required'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      enum: ['Apple', 'Samsung', 'OnePlus', 'Google', 'Xiaomi', 'Realme', 'POCO', 'Vivo', 'Oppo', 'Motorola', 'Nothing', 'Other'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    // ==================== IMAGE STORAGE ====================
    imageId: {
      type: mongoose.Schema.Types.ObjectId,
      description: 'GridFS file ID for phone image',
    },
    imageName: {
      type: String,
      description: 'Original image filename',
    },

    // ==================== PRICING ====================
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
    },

    // ==================== DETAILED SPECIFICATIONS ====================
    specs: {
      // ---- Performance ----
      performance: {
        processor: String,
        antutuScore: {
          type: Number,
          description: 'AnTuTu benchmark score (e.g., 2000000)',
        },
        ramOptions: [Number], // [8, 12, 16] in GB
        coolingSystem: String, // "VC Cooling", "Vapor Chamber", etc.
        gpu: String,
        apu: String, // Neural engine, etc.
      },

      // ---- Display ----
      display: {
        size: String, // inches or description (e.g., "6.7" or "6.7 inches" or "hd")
        resolution: String, // "2560x1600"
        refreshRate: {
          type: Number,
          description: '60, 90, 120, 144, 165 Hz',
        },
        touchSamplingRate: {
          type: Number,
          description: 'Touch responsiveness in Hz (240, 360, 540, 720)',
        },
        brightness: Number, // nits (e.g., 2000)
        colorAccuracy: String, // "DCI-P3", "sRGB"
      },

      // ---- Camera ----
      camera: {
        rear: {
          main: {
            megapixels: Number,
            aperture: String, // f/1.8, f/2.0, etc.
            ois: { type: Boolean, default: false }, // Optical Image Stabilization
            videoCapable4K: { type: Boolean, default: false },
          },
          ultraWide: {
            megapixels: Number,
            fov: Number, // Field of view
          },
          telephoto: {
            megapixels: Number,
            zoom: String, // "3x", "5x", "8x"
            ois: { type: Boolean, default: false },
          },
          macro: {
            megapixels: Number,
          },
        },
        front: {
          megapixels: Number,
          videoCapable4K: { type: Boolean, default: false },
          autofocus: { type: Boolean, default: false },
        },
        videoRecording: {
          maxResolution: String, // "4K", "8K"
          maxFPS: Number, // 30, 60, 120, 240
          stabilization: String, // "EIS", "OIS", "Hybrid"
        },
      },

      // ---- Battery ----
      battery: {
        capacity: {
          type: Number,
          description: 'Battery capacity in mAh',
        },
        chargingSpeed: {
          type: Number,
          description: 'Charging power in Watts (65W, 120W, etc.)',
        },
        wirelessCharging: { type: Boolean, default: false },
        batteryLife: {
          type: Number,
          description: 'Typical battery life in hours (calculated)',
        },
      },

      // ---- Other ----
      os: String, // "iOS 18", "Android 15"
      storage: [Number], // [128, 256, 512] in GB
      biometrics: [String], // ["Fingerprint", "Face ID"]
      weight: Number, // grams
      color: [String],
    },

    // ==================== VARIANTS ====================
    // Different RAM/Storage/Color combinations with prices
    variants: [
      {
        ram: Number, // 8, 12, 16 GB
        storage: Number, // 128, 256, 512 GB
        color: String,
        price: Number, // Specific variant price
        sku: String, // Stock Keeping Unit
        availability: { type: Boolean, default: true },
        stock: Number, // Quantity available
      },
    ],

    // ==================== PRE-CALCULATED SCORES ====================
    scores: {
      gaming: {
        type: Number,
        min: 0,
        max: 10,
        description: 'Gaming capability score (0-10)',
      },
      camera: {
        type: Number,
        min: 0,
        max: 10,
        description: 'Camera quality score (0-10)',
      },
      battery: {
        type: Number,
        min: 0,
        max: 10,
        description: 'Battery performance score (0-10)',
      },
      display: {
        type: Number,
        min: 0,
        max: 10,
        description: 'Display quality score (0-10)',
      },
      valueForMoney: {
        type: Number,
        min: 0,
        max: 10,
        description: 'Value for money ratio (0-10)',
      },
    },

    // ==================== METADATA ====================
    overview: String, // Short description
    pros: [String], // Strengths
    cons: [String], // Weaknesses
    releaseDate: Date,
    isUpcoming: { type: Boolean, default: false }, // Mark phones as upcoming launches
    launchDate: Date, // Expected launch date for upcoming phones
    recommended: { type: Boolean, default: false }, // Editor's pick
  },
  {
    timestamps: true,
  }
);

// ==================== INDEXES ====================
phoneSchema.index({ brand: 1 });
phoneSchema.index({ basePrice: 1 });
phoneSchema.index({ 'scores.gaming': -1 });
phoneSchema.index({ 'scores.camera': -1 });
phoneSchema.index({ 'scores.valueForMoney': -1 });
phoneSchema.index({ name: 'text', brand: 'text', slug: 'text' }); // Full-text search
phoneSchema.index({ createdAt: -1 });

// ==================== PRE-SAVE HOOKS ====================

// Auto-generate slug from name and brand
phoneSchema.pre('save', function () {
  // Auto-generate slug
  if (!this.slug) {
    this.slug = `${this.name}-${this.brand}`.toLowerCase().replace(/\s+/g, '-');
  }

  // Initialize scores with defaults if not provided
  if (!this.scores) {
    this.scores = {};
  }
  if (!this.scores.gaming) this.scores.gaming = 5;
  if (!this.scores.camera) this.scores.camera = 5;
  if (!this.scores.battery) this.scores.battery = 5;
  if (!this.scores.display) this.scores.display = 5;
  if (!this.scores.valueForMoney) this.scores.valueForMoney = 5;
});

// ==================== INSTANCE METHODS ====================

/**
 * Calculate gaming score based on performance metrics
 * Formula: (AnTuTu/2.5M * 0.4) + (RefreshRate/144 * 0.3) + (TouchSampling/720 * 0.2) + (Cooling bonus * 0.1)
 */
phoneSchema.methods.calculateGamingScore = function () {
  const antutuNorm = Math.min(this.specs.performance.antutuScore / 2500000, 1);
  const refreshNorm = Math.min((this.specs.display.refreshRate || 60) / 144, 1);
  const touchNorm = Math.min((this.specs.display.touchSamplingRate || 0) / 720, 1);
  const coolingBonus = this.specs.performance.coolingSystem ? 0.1 : 0;

  const score =
    (antutuNorm * 0.4 + refreshNorm * 0.3 + touchNorm * 0.2 + coolingBonus) * 10;

  return Math.round(score * 10) / 10; // Round to 1 decimal
};

/**
 * Calculate camera score
 * Formula: (MainMP/108 * 0.4) + (OIS bonus * 0.15) + (Telephoto * 0.15) + (Front 4K * 0.15) + (Pre-calc score * 0.15)
 */
phoneSchema.methods.calculateCameraScore = function () {
  const mainMPNorm = Math.min((this.specs.camera.rear.main.megapixels || 0) / 108, 1);
  const oisBonus = this.specs.camera.rear.main.ois ? 0.15 : 0;
  const telephotoBonus = this.specs.camera.rear.telephoto ? 0.15 : 0;
  const front4KBonus = this.specs.camera.front.videoCapable4K ? 0.15 : 0;
  const videoStabilization = this.specs.camera.videoRecording.stabilization ? 0.1 : 0;

  const score =
    (mainMPNorm * 0.4 + oisBonus + telephotoBonus + front4KBonus + videoStabilization) *
    10;

  return Math.round(score * 10) / 10;
};

/**
 * Calculate battery score
 * Formula: (Capacity/6000 * 0.5) + (ChargingSpeed/120 * 0.3) + (Wireless charging bonus * 0.2)
 */
phoneSchema.methods.calculateBatteryScore = function () {
  const capacityNorm = Math.min(this.specs.battery.capacity / 6000, 1);
  const chargingNorm = Math.min(this.specs.battery.chargingSpeed / 120, 1);
  const wirelessBonus = this.specs.battery.wirelessCharging ? 0.2 : 0;

  const score = (capacityNorm * 0.5 + chargingNorm * 0.3 + wirelessBonus) * 10;

  return Math.round(score * 10) / 10;
};

/**
 * Calculate value for money score
 * Formula: (OverallPerformance / PriceInThousands * 5)
 */
phoneSchema.methods.calculateValueScore = function () {
  const avgPerformance =
    (this.scores.gaming +
      this.scores.camera +
      this.scores.battery +
      (this.scores.display || 5)) /
    4;

  const priceInThousands = this.basePrice / 1000;
  const valueRatio = avgPerformance / priceInThousands;

  // Normalize to 0-10 scale
  const score = Math.min(valueRatio, 10);

  return Math.round(score * 10) / 10;
};

/**
 * Convert to API response format (exclude sensitive fields)
 */
phoneSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// ==================== STATIC METHODS ====================

/**
 * Get phone recommendations based on budget and priority
 * @param {Object} query - { budget, priority, limit }
 * @returns {Array} Top phones sorted by priority
 */
phoneSchema.statics.getRecommendations = async function (query) {
  const { budget, priority = 'Value', limit = 5 } = query;

  // Determine sort field based on priority
  const sortField = {
    Gaming: 'scores.gaming',
    Camera: 'scores.camera',
    Battery: 'scores.battery',
    Vlogging: 'scores.camera', // Camera is primary for vlogging
    Value: 'scores.valueForMoney',
  }[priority] || 'scores.valueForMoney';

  return this.aggregate([
    {
      $match: {
        'variants.price': { $lte: budget },
      },
    },
    {
      $addFields: {
        minPrice: { $min: '$variants.price' },
      },
    },
    {
      $sort: { [sortField]: -1, minPrice: 1 },
    },
    {
      $limit: limit,
    },
    {
      $project: {
        name: 1,
        brand: 1,
        basePrice: 1,
        minPrice: 1,
        specs: 1,
        scores: 1,
        variants: 1,
        overview: 1,
        pros: 1,
      },
    },
  ]);
};

/**
 * Compare multiple phones by IDs
 * @param {Array} ids - Phone document IDs
 * @returns {Object} Comparison data
 */
phoneSchema.statics.comparePhones = async function (ids) {
  const phones = await this.find({ _id: { $in: ids } }).select(
    'name brand specs scores variants basePrice'
  );

  if (phones.length === 0) {
    throw new Error('No phones found for comparison');
  }

  // Normalize specs for comparison
  const comparison = {
    phones: phones.map((phone) => ({
      id: phone._id,
      name: phone.name,
      brand: phone.brand,
      basePrice: phone.basePrice,
      specs: phone.specs,
      scores: phone.scores,
      minVariantPrice: Math.min(...phone.variants.map((v) => v.price)),
    })),
    winner: this.determineWinners(phones),
  };

  return comparison;
};

/**
 * Determine winner in each category
 */
phoneSchema.statics.determineWinners = function (phones) {
  const categories = ['gaming', 'camera', 'battery', 'valueForMoney'];
  const winners = {};

  categories.forEach((category) => {
    const best = phones.reduce((prev, current) =>
      prev.scores[category] > current.scores[category] ? prev : current
    );
    winners[category] = {
      name: best.name,
      score: best.scores[category],
    };
  });

  return winners;
};

/**
 * Advanced filtering with query string
 * Supports: price[lte], price[gte], brand, search, ram[gte], etc.
 */
phoneSchema.statics.advancedFilter = async function (queryObj) {
  const query = { ...queryObj };

  // Create MongoDB query
  const mongoQuery = {};

  // Price filtering
  if (query.price) {
    mongoQuery['variants.price'] = {};
    if (query.price.$lte) mongoQuery['variants.price'].$lte = query.price.$lte;
    if (query.price.$gte) mongoQuery['variants.price'].$gte = query.price.$gte;
  }

  // Brand filtering
  if (query.brand) {
    mongoQuery.brand = query.brand;
  }

  // Text search
  if (query.search) {
    mongoQuery.$text = { $search: query.search };
  }

  // RAM filtering
  if (query.ram) {
    if (query.ram.$gte) {
      mongoQuery['specs.performance.ramOptions'] = { $elemMatch: { $gte: query.ram.$gte } };
    }
  }

  // AnTuTu score filtering
  if (query.antutu) {
    if (query.antutu.$gte) {
      mongoQuery['specs.performance.antutuScore'] = { $gte: query.antutu.$gte };
    }
  }

  return this.find(mongoQuery);
};

module.exports = mongoose.model('Phone', phoneSchema);