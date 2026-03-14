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

const updateProfileRules = [
  body('district').optional().trim().notEmpty().withMessage('District cannot be empty'),
  body('mandal').optional().trim().notEmpty().withMessage('Mandal cannot be empty'),
  body('village').optional().trim().notEmpty().withMessage('Village cannot be empty'),
  body('acres').optional().isNumeric().withMessage('Acres must be a number'),
  body('soilType').optional().trim().notEmpty().withMessage('Soil type cannot be empty'),
  validate,
];

module.exports = { updateProfileRules };
