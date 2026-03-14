const { body, validationResult } = require('express-validator');

/**
 * Middleware to check validation results and return errors
 */
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

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Invalid Indian phone number'),
  body('aadhaarNumber')
    .trim()
    .notEmpty()
    .withMessage('Aadhaar number is required')
    .isLength({ min: 12, max: 12 })
    .withMessage('Aadhaar number must be 12 digits'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validate,
];

const loginRules = [
  body('phoneNumber').trim().notEmpty().withMessage('Phone number is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

const sendOtpRules = [
  body('aadhaarNumber').trim().notEmpty().withMessage('Aadhaar number is required'),
  body('phoneNumber').trim().notEmpty().withMessage('Phone number is required'),
  validate,
];

const adminLoginRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

module.exports = { registerRules, loginRules, sendOtpRules, adminLoginRules };
