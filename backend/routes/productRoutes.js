const express = require('express');
const router = express.Router();
const {
  verifyProduct,
  getProductByBatchCode,
  getProductById,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductQR,
  generateAllQR,
} = require('../controllers/productController');
const { protect, protectAdmin } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { createProductRules, verifyProductRules } = require('../middlewares/validators/productValidator');

// Public routes
router.post('/verify', verifyProductRules, verifyProduct);
router.get('/batch/:batchCode', getProductByBatchCode);
router.get('/detail/:id', getProductById);
router.get('/qr/:batchCode', getProductQR);

// Admin routes
router.post('/generate-all-qr', protectAdmin, authorize('admin'), generateAllQR);

router.route('/')
  .get(protectAdmin, authorize('admin', 'inspector'), getAllProducts)
  .post(protectAdmin, authorize('admin'), createProductRules, createProduct);

router.route('/:id')
  .put(protectAdmin, authorize('admin'), updateProduct)
  .delete(protectAdmin, authorize('admin'), deleteProduct);

module.exports = router;
