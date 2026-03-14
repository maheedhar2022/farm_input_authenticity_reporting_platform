const express = require('express');
const router = express.Router();
const multer = require('multer');

// Memory storage for Vision API (we don't need to save this to disk, just pass buffer to API)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const { protect } = require('../middlewares/authMiddleware');
const { chatWithBot, analyzeProductImage } = require('../controllers/aiController');
const { chatWithKrishi } = require('../controllers/krishiController');

router.post('/chat', protect, chatWithBot);
router.post('/krishibot', protect, chatWithKrishi);
router.post('/analyze-image', protect, upload.single('productImage'), analyzeProductImage);

module.exports = router;
