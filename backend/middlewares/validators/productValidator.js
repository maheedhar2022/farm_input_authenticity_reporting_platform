const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const createProductRules = [
  body('productName').trim().notEmpty().withMessage('Product name is required'),
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  body('batchCode').trim().notEmpty().withMessage('Batch code is required'),
  body('manufacturer').trim().notEmpty().withMessage('Manufacturer is required'),
  body('qrCode').trim().notEmpty().withMessage('QR code is required'),
  body('category')
    .optional()
    .isIn(['Fertilizer', 'Pesticide', 'Seed', 'Equipment', 'Other'])
    .withMessage('Invalid category'),
  body('price').optional().isNumeric().withMessage('Price must be a number'),
  body('mfgDate').optional().isISO8601().withMessage('Invalid manufacturing date'),
  body('expiryDate').optional().isISO8601().withMessage('Invalid expiry date'),
  validate,
];

const verifyProductRules = [
  body('batchCode')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Batch code cannot be empty'),
  body('qrCode')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('QR code cannot be empty'),
  validate,
];

module.exports = { createProductRules, verifyProductRules };
