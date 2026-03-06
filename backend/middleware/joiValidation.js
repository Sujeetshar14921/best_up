/**
 * Request Validation Middleware using Joi
 * Validates incoming request data against predefined schemas
 */

const Joi = require('joi');

// Define validation schemas for different routes
const schemas = {
  // Phone creation/update schema
  phone: Joi.object({
    name: Joi.string().required().min(2).max(100),
    brand: Joi.string().required(),
    basePrice: Joi.number().required().min(0),
    overview: Joi.string().max(500),
    releaseDate: Joi.string().isoDate(),
    isUpcoming: Joi.boolean(),
    launchDate: Joi.string().isoDate(),
    pros: Joi.array().items(Joi.string()),
    cons: Joi.array().items(Joi.string()),
    specs: Joi.object().unknown(true),
    scores: Joi.object({
      gaming: Joi.number().min(0).max(10),
      camera: Joi.number().min(0).max(10),
      battery: Joi.number().min(0).max(10),
      display: Joi.number().min(0).max(10),
      valueForMoney: Joi.number().min(0).max(10)
    }),
    variants: Joi.array().items(
      Joi.object({
        ram: Joi.number().required(),
        storage: Joi.number().required(),
        color: Joi.string(),
        price: Joi.number().required().min(0),
        sku: Joi.string(),
        stock: Joi.number().min(0)
      })
    )
  }),

  // User registration schema
  userRegister: Joi.object({
    name: Joi.string().required().min(2).max(50),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(50)
  }),

  // User login schema
  userLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // Search/Filter query schema
  searchQuery: Joi.object({
    brand: Joi.string().max(50),
    search: Joi.string().max(100),
    isUpcoming: Joi.string().valid('true', 'false'),
    limit: Joi.number().min(1).max(100),
    skip: Joi.number().min(0),
    sort: Joi.string().max(100),
    'price[lte]': Joi.number().min(0),
    'price[gte]': Joi.number().min(0),
    'ram[gte]': Joi.number().min(0)
  }).unknown(true),

  // Review schema
  review: Joi.object({
    phoneId: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5),
    title: Joi.string().required().min(3).max(100),
    comment: Joi.string().max(500)
  }),

  // Brand schema
  brand: Joi.object({
    name: Joi.string().required().min(2).max(50),
    logo: Joi.string().uri()
  })
};

/**
 * Validate middleware factory
 * Usage: router.post('/phones', validate('phone'), controller)
 */
const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName] || Joi.object({});
    
    // Validate based on request type
    let dataToValidate = req.body;
    
    if (schemaName === 'searchQuery') {
      dataToValidate = req.query;
    }

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: false
    });

    if (error) {
      const details = error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details
      });
    }

    // Attach validated data to request
    req.validatedData = value;
    next();
  };
};

module.exports = { validate, schemas };
