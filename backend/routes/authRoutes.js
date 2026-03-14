const express = require('express');
const router = express.Router();
const { registerUser, loginUser, sendOtp, adminLogin, getMe } = require('../controllers/authController');
const { registerRules, loginRules, sendOtpRules, adminLoginRules } = require('../middlewares/validators/authValidator');
const { protect } = require('../middlewares/authMiddleware');

router.post('/send-otp', sendOtpRules, sendOtp);
router.post('/register', registerRules, registerUser);
router.post('/login', loginRules, loginUser);
router.post('/admin-login', adminLoginRules, adminLogin);
router.get('/me', protect, getMe);

module.exports = router;
