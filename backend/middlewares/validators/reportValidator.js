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

const createReportRules = [
  body('productName').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('brand').optional().trim(),
  body('batchCode').optional().trim(),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Priority must be Low, Medium, High, or Critical'),
  body('location').optional().trim(),
  validate,
];

const updateReportStatusRules = [
  body('reportStatus')
    .isIn(['Pending', 'Reviewed', 'Resolved'])
    .withMessage('Status must be Pending, Reviewed, or Resolved'),
  body('resolutionNotes').optional().trim(),
  validate,
];

module.exports = { createReportRules, updateReportStatusRules };
