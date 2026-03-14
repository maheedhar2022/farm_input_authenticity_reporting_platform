const express = require('express');
const router = express.Router();
const {
  addCropHistory,
  getCropHistory,
  updateCropHistory,
  deleteCropHistory,
  getCropStats,
  analyzeCrop,
} = require('../controllers/cropController');
const { protect } = require('../middlewares/authMiddleware');
const { addCropRules, updateCropRules } = require('../middlewares/validators/cropValidator');

router.route('/')
  .post(protect, addCropRules, addCropHistory)
  .get(protect, getCropHistory);

router.get('/stats', protect, getCropStats);
router.post('/analyze', protect, analyzeCrop);

router.route('/:id')
  .put(protect, updateCropRules, updateCropHistory)
  .delete(protect, deleteCropHistory);

module.exports = router;
