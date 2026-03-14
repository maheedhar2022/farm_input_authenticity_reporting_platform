const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// ---------- Global Middleware ----------

// Logging (dev only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// CORS
app.use(cors());

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------- API Routes ----------

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/farmers', require('./routes/farmerRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/crops', require('./routes/cropRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// ---------- Health Check ----------

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Farm Authenticity Platform API is running',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      farmers: '/api/farmers',
      products: '/api/products',
      crops: '/api/crops',
      reports: '/api/reports',
      admin: '/api/admin',
      notifications: '/api/notifications',
    },
  });
});

// ---------- Error Handling ----------

app.use(notFound);
app.use(errorHandler);

// ---------- Start Server ----------

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`   API: http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/`);
});

// Graceful shutdown
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
