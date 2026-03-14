const Product = require('../models/Product');
const { AppError } = require('../middlewares/errorMiddleware');
const { generateQRImage, generateQRDataURL } = require('../utils/qrGenerator');

/**
 * Verify a product by batchCode or qrCode, track scan count
 */
const verifyProduct = async ({ batchCode, qrCode }) => {
  if (!batchCode && !qrCode) {
    throw new AppError('Please provide a batch code or QR code', 400);
  }

  const query = batchCode ? { batchCode } : { qrCode };
  const product = await Product.findOne(query);

  if (!product) {
    return {
      status: 'Not Found',
      message: 'Product not found in our database. It might be counterfeit.',
      product: null,
    };
  }

  // Track verification
  product.verificationCount = (product.verificationCount || 0) + 1;
  product.lastVerifiedAt = new Date();
  await product.save();

  return {
    status: product.authenticityStatus,
    isExpired: product.isExpired,
    product,
  };
};

/**
 * Get a product by batchCode
 */
const getByBatchCode = async (batchCode) => {
  const product = await Product.findOne({ batchCode });
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  return product;
};

/**
 * Create a new product (admin)
 */
const createProduct = async (data) => {
  const product = await Product.create(data);
  return product;
};

/**
 * Update product (admin)
 */
const updateProduct = async (productId, data) => {
  const product = await Product.findByIdAndUpdate(productId, data, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  return product;
};

/**
 * Delete product (admin)
 */
const deleteProduct = async (productId) => {
  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  return product;
};

/**
 * Get all products with pagination and search
 */
const getAllProducts = async ({ page = 1, limit = 10, search, category }) => {
  const query = {};

  if (search) {
    query.$or = [
      { productName: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
      { batchCode: { $regex: search, $options: 'i' } },
    ];
  }

  if (category) {
    query.category = category;
  }

  const skip = (page - 1) * limit;
  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return { products, total, page: parseInt(page), limit: parseInt(limit) };
};

/**
 * Get product by ID
 */
const getById = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  return product;
};

/**
 * Generate QR code for a product
 */
const generateProductQR = async (batchCode) => {
  const product = await Product.findOne({ batchCode });
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const qrImagePath = await generateQRImage(batchCode);
  product.qrCodeImage = qrImagePath;
  await product.save();

  return { qrImagePath, product };
};

/**
 * Generate QR codes for all products
 */
const generateAllQRCodes = async () => {
  const products = await Product.find();
  const results = [];

  for (const product of products) {
    const qrImagePath = await generateQRImage(product.batchCode);
    product.qrCodeImage = qrImagePath;
    await product.save();
    results.push({ batchCode: product.batchCode, qrImagePath });
  }

  return results;
};

module.exports = {
  verifyProduct,
  getByBatchCode,
  getById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  generateProductQR,
  generateAllQRCodes,
};
