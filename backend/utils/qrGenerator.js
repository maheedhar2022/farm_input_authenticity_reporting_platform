const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const QR_DIR = path.join(__dirname, '..', 'uploads', 'qrcodes');

// Ensure qrcodes directory exists
if (!fs.existsSync(QR_DIR)) {
  fs.mkdirSync(QR_DIR, { recursive: true });
}

/**
 * Generate a QR code image file for a product
 * @param {string} batchCode - The product batch code to encode
 * @returns {Promise<string>} - Relative path to the saved QR image
 */
const generateQRImage = async (batchCode) => {
  const filename = `qr-${batchCode.replace(/[^a-zA-Z0-9-]/g, '_')}.png`;
  const filepath = path.join(QR_DIR, filename);

  // The QR will encode a JSON payload with batchCode
  const payload = JSON.stringify({ batchCode, type: 'farm-product-verify' });

  await QRCode.toFile(filepath, payload, {
    type: 'png',
    width: 400,
    margin: 2,
    color: {
      dark: '#1a5928',  // Dark green
      light: '#ffffff',
    },
    errorCorrectionLevel: 'H',
  });

  return `/uploads/qrcodes/${filename}`;
};

/**
 * Generate a QR code as a data URL (base64)
 * @param {string} batchCode
 * @returns {Promise<string>} - Base64 data URL
 */
const generateQRDataURL = async (batchCode) => {
  const payload = JSON.stringify({ batchCode, type: 'farm-product-verify' });

  const dataUrl = await QRCode.toDataURL(payload, {
    width: 400,
    margin: 2,
    color: {
      dark: '#1a5928',
      light: '#ffffff',
    },
    errorCorrectionLevel: 'H',
  });

  return dataUrl;
};

module.exports = { generateQRImage, generateQRDataURL };
