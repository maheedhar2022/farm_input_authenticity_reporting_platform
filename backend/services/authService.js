const bcrypt = require('bcryptjs');
const Farmer = require('../models/Farmer');
const User = require('../models/User');
const { generateToken, generateRefreshToken } = require('../utils/generateToken');
const { AppError } = require('../middlewares/errorMiddleware');

/**
 * Register a new farmer
 */
const registerFarmer = async ({ name, phoneNumber, aadhaarNumber, password }) => {
  const farmerExists = await Farmer.findOne({
    $or: [{ phoneNumber }, { aadhaarNumber }],
  });

  if (farmerExists) {
    throw new AppError('Farmer with this phone number or Aadhaar already exists', 400);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const farmer = await Farmer.create({
    name,
    phoneNumber,
    aadhaarNumber,
    password: hashedPassword,
  });

  return {
    _id: farmer._id,
    name: farmer.name,
    phoneNumber: farmer.phoneNumber,
    role: farmer.role,
    token: generateToken(farmer._id, 'farmer'),
    refreshToken: generateRefreshToken(farmer._id),
  };
};

/**
 * Login a farmer by phone + password
 */
const loginFarmer = async ({ phoneNumber, password }) => {
  const farmer = await Farmer.findOne({ phoneNumber });

  if (!farmer) {
    throw new AppError('Invalid phone number or password', 401);
  }

  if (!farmer.isActive) {
    throw new AppError('Account has been deactivated. Contact support.', 403);
  }

  const isMatch = await bcrypt.compare(password, farmer.password);
  if (!isMatch) {
    throw new AppError('Invalid phone number or password', 401);
  }

  return {
    _id: farmer._id,
    name: farmer.name,
    phoneNumber: farmer.phoneNumber,
    role: farmer.role,
    token: generateToken(farmer._id, 'farmer'),
    refreshToken: generateRefreshToken(farmer._id),
  };
};

/**
 * Login an admin user by email + password
 */
const loginAdmin = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw new AppError('Account has been deactivated', 403);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  };
};

/**
 * Mock OTP sending
 */
const sendOtp = ({ aadhaarNumber, phoneNumber }) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`[OTP Service] Mock SMS to ${phoneNumber}: Your OTP is ${otp}`);
  return { otp, message: 'OTP sent successfully' };
};

module.exports = { registerFarmer, loginFarmer, loginAdmin, sendOtp };
