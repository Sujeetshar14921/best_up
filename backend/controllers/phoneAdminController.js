const Phone = require('../models/Phone');
const { getGridFS } = require('../config/gridfs');
const mongoose = require('mongoose');
const { Readable } = require('stream');
const asyncHandler = require('../middleware/asyncHandler');

// Create phone with image upload
exports.createPhone = asyncHandler(async (req, res) => {
  try {
    console.log('📥 createPhone called')
    console.log('📥 Request body keys:', Object.keys(req.body))
    console.log('📥 Received file:', req.file ? `${req.file.fieldname} - ${req.file.size} bytes` : 'No file')
    
    const { name, brand, basePrice, overview, releaseDate, isUpcoming, launchDate, specs, variants, scores, pros, cons } = req.body;

    console.log('📥 Extracted fields:', { name, brand, basePrice, variantsLength: typeof variants })

    // Validate required fields
    if (!name || !brand || !basePrice) {
      console.warn('❌ Missing required fields:', { name: !!name, brand: !!brand, basePrice: !!basePrice })
      return res.status(400).json({
        success: false,
        error: 'Please provide name, brand, and basePrice',
      });
    }

    // Parse variants if it's a string
    let parsedVariants = variants;
    console.log('📥 Raw variants received:', variants)
    console.log('📥 Variants type:', typeof variants)
    if (typeof variants === 'string') {
      try {
        parsedVariants = JSON.parse(variants);
        console.log('✅ Parsed variants:', parsedVariants)
      } catch (e) {
        console.error('❌ Failed to parse variants:', e.message)
        parsedVariants = [];
      }
    }
    console.log('📥 Final parsedVariants:', parsedVariants)
    console.log('📥 Variants length:', parsedVariants?.length)

    if (!parsedVariants || parsedVariants.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one variant is required',
      });
    }

    // Create slug from name
    const slug = name.toLowerCase().replace(/\s+/g, '-');

    let imageId = null;
    let imageName = null;

    // Handle image upload to GridFS
    if (req.file) {
      try {
        const gfs = getGridFS();
        const bucket = gfs;

        // Convert buffer to stream
        const readableStream = Readable.from(req.file.buffer);

        // Upload to GridFS
        const uploadStream = bucket.openUploadStream(req.file.originalname, {
          metadata: {
            phoneName: name,
            uploadedAt: new Date(),
            mimetype: req.file.mimetype,
          },
        });

        readableStream.pipe(uploadStream);

        await new Promise((resolve, reject) => {
          uploadStream.on('finish', () => {
            imageId = uploadStream.id;
            imageName = req.file.originalname;
            console.log('✅ Image uploaded to GridFS:', imageId);
            resolve();
          });
          uploadStream.on('error', reject);
        });
      } catch (error) {
        console.error('GridFS upload error:', error);
        return res.status(500).json({
          success: false,
          error: 'Image upload failed: ' + error.message,
        });
      }
    }

    // Parse JSON fields if they're strings
    let parsedSpecs = specs;
    console.log('📥 Raw specs received, type:', typeof specs)
    if (typeof specs === 'string') {
      try {
        parsedSpecs = JSON.parse(specs);
        console.log('✅ Parsed specs')
      } catch (e) {
        console.error('❌ Failed to parse specs:', e.message)
        parsedSpecs = {};
      }
    }

    // Ensure specs has default values for calculation methods
    parsedSpecs = {
      performance: { antutuScore: 0, ...((parsedSpecs?.performance) || {}) },
      display: { refreshRate: 60, touchSamplingRate: 0, ...((parsedSpecs?.display) || {}) },
      camera: { rear: { main: {} }, ...((parsedSpecs?.camera) || {}) },
      battery: { capacity: 0, ...((parsedSpecs?.battery) || {}) },
      ...(parsedSpecs || {})
    };

    let parsedScores = scores;
    if (typeof scores === 'string') {
      try {
        parsedScores = JSON.parse(scores);
      } catch (e) {
        parsedScores = {};
      }
    }

    let parsedPros = pros;
    if (typeof pros === 'string') {
      try {
        parsedPros = JSON.parse(pros);
      } catch (e) {
        parsedPros = [];
      }
    }

    let parsedCons = cons;
    if (typeof cons === 'string') {
      try {
        parsedCons = JSON.parse(cons);
      } catch (e) {
        parsedCons = [];
      }
    }

    // Create phone document
    console.log('✅ Creating phone with data:', {
      name,
      brand,
      basePrice: Number(basePrice),
      slug,
      variantsCount: parsedVariants.length,
      imageId: imageId || null
    })
    
    const phone = await Phone.create({
      name,
      brand,
      basePrice: Number(basePrice),
      slug,
      overview: overview || '',
      releaseDate: releaseDate || null,
      isUpcoming: isUpcoming === 'true' || isUpcoming === true || false,
      launchDate: launchDate || null,
      specs: parsedSpecs || {},
      variants: parsedVariants || [],
      scores: parsedScores || {},
      pros: parsedPros || [],
      cons: parsedCons || [],
      imageId: imageId || null,
      imageName: imageName || null,
    });
    
    console.log('✅ Phone created successfully:', phone._id);

    res.status(201).json({
      success: true,
      message: 'Phone created successfully',
      data: phone,
    });
  } catch (error) {
    console.error('❌ createPhone error:', error.message);
    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      console.error('❌ Validation errors:', errors);
      return res.status(422).json({
        success: false,
        error: 'Validation failed',
        errors,
      });
    }
    if (error.code === 11000) {
      console.error('❌ Duplicate key error:', error.keyValue);
      return res.status(400).json({
        success: false,
        error: 'A phone with this name and brand already exists',
      });
    }
    throw error;
  }
});

// Get all phones
exports.getAllPhones = asyncHandler(async (req, res) => {
  try {
    const phones = await Phone.find()
      .populate('brand')
      .select('-specs.performance -specs.display.colorAccuracy');

    res.status(200).json({
      success: true,
      count: phones.length,
      data: phones,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get phone by ID
exports.getPhoneById = asyncHandler(async (req, res) => {
  try {
    const phone = await Phone.findById(req.params.id).populate('brand');

    if (!phone) {
      return res.status(404).json({
        success: false,
        error: 'Phone not found',
      });
    }

    res.status(200).json({
      success: true,
      data: phone,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get phone image
exports.getPhoneImage = asyncHandler(async (req, res) => {
  const phone = await Phone.findById(req.params.id);

  if (!phone || !phone.imageId) {
    return res.status(404).json({
      success: false,
      error: 'Phone or image not found',
    });
  }

  const gfs = getGridFS();
  const bucket = gfs;

  const downloadStream = bucket.openDownloadStream(
    new mongoose.Types.ObjectId(phone.imageId)
  );

  res.set('Content-Type', 'image/jpeg');
  res.set('Cache-Control', 'public, max-age=3600');
  downloadStream.pipe(res);

  downloadStream.on('error', (error) => {
    res.status(500).json({
      success: false,
      error: 'Error downloading image',
    });
  });
});

// Update phone
exports.updatePhone = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, brand, basePrice, overview, releaseDate, isUpcoming, launchDate, specs, variants, scores, pros, cons } = req.body;

  console.log('📝 Updating phone:', id);
  console.log('📝 Update body keys:', Object.keys(req.body));

  let updateData = {
    name,
    brand,
    basePrice: basePrice ? Number(basePrice) : undefined,
    overview: overview || '',
    releaseDate: releaseDate || null,
    isUpcoming: isUpcoming === 'true' || isUpcoming === true || false,
    launchDate: launchDate || null,
  };

  // Handle specs update
  if (specs) {
    updateData.specs = typeof specs === 'string' ? JSON.parse(specs) : specs;
  }

  // Handle variants update
  if (variants) {
    let parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
    if (parsedVariants && parsedVariants.length > 0) {
      updateData.variants = parsedVariants;
    }
  }

  // Handle scores update
  if (scores) {
    updateData.scores = typeof scores === 'string' ? JSON.parse(scores) : scores;
  }

  // Handle pros update
  if (pros) {
    updateData.pros = typeof pros === 'string' ? JSON.parse(pros) : pros;
  }

  // Handle cons update
  if (cons) {
    updateData.cons = typeof cons === 'string' ? JSON.parse(cons) : cons;
  }

  // Handle new image upload
  if (req.file) {
    try {
      const gfs = getGridFS();
      const bucket = gfs;

      // Delete old image if exists
      const phoneToDelete = await Phone.findById(id);
      if (phoneToDelete && phoneToDelete.imageId) {
        try {
          await bucket.delete(new mongoose.Types.ObjectId(phoneToDelete.imageId));
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }

      // Upload new image
      const readableStream = Readable.from(req.file.buffer);
      const uploadStream = bucket.openUploadStream(req.file.originalname);

      readableStream.pipe(uploadStream);

      await new Promise((resolve, reject) => {
        uploadStream.on('finish', () => {
          updateData.imageId = uploadStream.id;
          updateData.imageName = req.file.originalname;
          resolve();
        });
        uploadStream.on('error', reject);
      });
    } catch (error) {
      console.error('Image update error:', error);
      return res.status(500).json({
        success: false,
        error: 'Image upload failed: ' + error.message,
      });
    }
  }

  try {
    const phone = await Phone.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!phone) {
      return res.status(404).json({
        success: false,
        error: 'Phone not found',
      });
    }

    console.log('✅ Phone updated successfully:', phone._id);

    res.status(200).json({
      success: true,
      message: 'Phone updated successfully',
      data: phone,
    });
  } catch (error) {
    console.error('❌ Update error:', error.message);
    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      console.error('❌ Validation errors:', errors);
      return res.status(422).json({
        success: false,
        error: 'Validation failed',
        errors,
      });
    }
    throw error;
  }
});

// Delete phone
exports.deletePhone = asyncHandler(async (req, res) => {
  const phone = await Phone.findByIdAndDelete(req.params.id);

  if (!phone) {
    return res.status(404).json({
      success: false,
      error: 'Phone not found',
    });
  }

    // Delete image from GridFS
    if (phone.imageId) {
      try {
        const gfs = getGridFS();
        const bucket = gfs;
        await bucket.delete(new mongoose.Types.ObjectId(phone.imageId));
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Phone deleted successfully',
    });
});
