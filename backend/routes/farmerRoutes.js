const express = require('express');
const router = express.Router();
const {
  getFarmerProfile,
  updateFarmerProfile,
  getAllFarmers,
  searchFarmers,
  deleteFarmer,
} = require('../controllers/farmerController');
const { protect, protectAdmin } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { updateProfileRules } = require('../middlewares/validators/farmerValidator');

// Farmer self-service routes
router.route('/profile')
  .get(protect, getFarmerProfile)
  .put(protect, updateProfileRules, updateFarmerProfile);

// Admin routes
router.get('/', protectAdmin, authorize('admin', 'inspector'), getAllFarmers);
router.get('/search', protectAdmin, authorize('admin', 'inspector'), searchFarmers);
router.delete('/:id', protectAdmin, authorize('admin'), deleteFarmer);

module.exports = router;
