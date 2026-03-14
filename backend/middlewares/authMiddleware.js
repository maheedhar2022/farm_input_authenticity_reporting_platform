const jwt = require('jsonwebtoken');
const Farmer = require('../models/Farmer');
const User = require('../models/User');
const { AppError } = require('./errorMiddleware');
const asyncHandler = require('express-async-handler');

/**
 * Protect routes — verifies JWT and attaches farmer to req.farmer
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Not authorized — no token provided', 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Check if the token belongs to a farmer or an admin/user
  if (decoded.role && decoded.role !== 'farmer') {
    // Admin/Inspector token — attach to req.user
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new AppError('Not authorized — user not found', 401);
    }
    req.user = user;
  } else {
    // Farmer token
    const farmer = await Farmer.findById(decoded.id).select('-password');
    if (!farmer) {
      throw new AppError('Not authorized — farmer not found', 401);
    }
    req.farmer = farmer;
  }

  next();
});

/**
 * Protect admin-only routes — verifies JWT and attaches admin user to req.user
 */
const protectAdmin = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Not authorized — no token provided', 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    throw new AppError('Not authorized — admin user not found', 401);
  }

  if (user.role !== 'admin' && user.role !== 'inspector') {
    throw new AppError('Not authorized — admin/inspector access required', 403);
  }

  req.user = user;
  next();
});

module.exports = { protect, protectAdmin };
