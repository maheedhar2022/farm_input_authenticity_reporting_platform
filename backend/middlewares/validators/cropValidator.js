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

const addCropRules = [
  body('cropType').trim().notEmpty().withMessage('Crop type is required'),
  body('yieldAmount').isNumeric().withMessage('Yield amount must be a number'),
  body('cultivationDuration').trim().notEmpty().withMessage('Cultivation duration is required'),
  body('year').trim().notEmpty().withMessage('Year is required'),
  body('season')
    .optional()
    .isIn(['Kharif', 'Rabi', 'Zaid'])
    .withMessage('Season must be Kharif, Rabi, or Zaid'),
  body('status')
    .optional()
    .isIn(['Planted', 'Growing', 'Harvested', 'Failed'])
    .withMessage('Invalid status'),
  body('notes').optional().trim(),
  validate,
];

const updateCropRules = [
  body('cropType').optional().trim().notEmpty().withMessage('Crop type cannot be empty'),
  body('yieldAmount').optional().isNumeric().withMessage('Yield amount must be a number'),
  body('status')
    .optional()
    .isIn(['Planted', 'Growing', 'Harvested', 'Failed'])
    .withMessage('Invalid status'),
  body('notes').optional().trim(),
  validate,
];

module.exports = { addCropRules, updateCropRules };
