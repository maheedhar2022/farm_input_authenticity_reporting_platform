const asyncHandler = require('express-async-handler');
const authService = require('../services/authService');
const { success, created } = require('../utils/apiResponse');

// @desc    Mock OTP Generation
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = asyncHandler(async (req, res) => {
  const result = authService.sendOtp(req.body);
  success(res, result, 'OTP sent successfully');
});

// @desc    Register new farmer
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const result = await authService.registerFarmer(req.body);
  created(res, result, 'Farmer registered successfully');
});

// @desc    Auth farmer & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const result = await authService.loginFarmer(req.body);
  success(res, result, 'Login successful');
});

// @desc    Auth admin & get token
// @route   POST /api/auth/admin-login
// @access  Public
const adminLogin = asyncHandler(async (req, res) => {
  const result = await authService.loginAdmin(req.body);
  success(res, result, 'Admin login successful');
});

// @desc    Get current logged-in user/farmer
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const currentUser = req.user || req.farmer;
  success(res, currentUser, 'User retrieved successfully');
});

module.exports = { registerUser, loginUser, sendOtp, adminLogin, getMe };
