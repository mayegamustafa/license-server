/**
 * License Server - Express Backend
 * Chrome Extension License Sales with PayPal Integration
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const createOrderRouter = require('./routes/createOrder');
const captureOrderRouter = require('./routes/captureOrder');
const validateLicenseRouter = require('./routes/validateLicense');
const { initStorage } = require('./utils/storage');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static('public'));

// Initialize storage
initStorage();

// API Routes
app.use('/api/orders', createOrderRouter);
app.use('/api/orders', captureOrderRouter);
app.use('/api/licenses', validateLicenseRouter);

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'License server is running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'License server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`License server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Show test mode status
  if (process.env.TEST_MODE === 'true') {
    console.log('⚠️  TEST MODE ENABLED - PayPal API calls are mocked');
    console.log('   Set TEST_MODE=false in .env to use real PayPal payments');
  } else {
    console.log('✓ PayPal integration active');
  }
});
