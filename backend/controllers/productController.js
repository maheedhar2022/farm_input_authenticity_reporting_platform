const asyncHandler = require('express-async-handler');
const productService = require('../services/productService');
const { success, created, paginated } = require('../utils/apiResponse');
const { generateQRDataURL } = require('../utils/qrGenerator');

// @desc    Verify product via batchCode or qrCode
// @route   POST /api/products/verify
// @access  Public
const verifyProduct = asyncHandler(async (req, res) => {
  const result = await productService.verifyProduct(req.body);

  if (!result.product) {
    return res.status(404).json({
      success: false,
      message: result.message,
      data: null,
    });
  }

  success(res, result, `Product is ${result.status}`);
});

// @desc    Get product by batchCode
// @route   GET /api/products/batch/:batchCode
// @access  Public
const getProductByBatchCode = asyncHandler(async (req, res) => {
  const product = await productService.getByBatchCode(req.params.batchCode);
  success(res, product, 'Product retrieved successfully');
});

// @desc    Get product by ID
// @route   GET /api/products/detail/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getById(req.params.id);
  success(res, product, 'Product retrieved successfully');
});

// @desc    Get all products (with pagination & search)
// @route   GET /api/products
// @access  Private/Admin
const getAllProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, category } = req.query;
  const result = await productService.getAllProducts({ page, limit, search, category });
  paginated(res, result.products, result.page, result.limit, result.total, 'Products retrieved');
});

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  created(res, product, 'Product created successfully');
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  success(res, product, 'Product updated successfully');
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  success(res, null, 'Product deleted successfully');
});

// @desc    Generate QR code for a product
// @route   GET /api/products/qr/:batchCode
// @access  Public
const getProductQR = asyncHandler(async (req, res) => {
  const result = await productService.generateProductQR(req.params.batchCode);
  success(res, {
    batchCode: req.params.batchCode,
    qrImagePath: result.qrImagePath,
    product: result.product,
  }, 'QR code generated');
});

// @desc    Generate QR codes for all products
// @route   POST /api/products/generate-all-qr
// @access  Private/Admin
const generateAllQR = asyncHandler(async (req, res) => {
  const results = await productService.generateAllQRCodes();
  success(res, results, `Generated QR codes for ${results.length} products`);
});

module.exports = {
  verifyProduct,
  getProductByBatchCode,
  getProductById,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductQR,
  generateAllQR,
};
