const jwt = require('jsonwebtoken');

/**
 * Generate a JWT access token
 * @param {string} id - User or Farmer ID
 * @param {string} role - Role (farmer, admin, inspector)
 * @returns {string} JWT token
 */
const generateToken = (id, role = 'farmer') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * Generate a short-lived refresh token
 * @param {string} id
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '90d',
  });
};

module.exports = { generateToken, generateRefreshToken };
