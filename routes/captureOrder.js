/**
 * Capture PayPal Order & Generate License
 * POST /api/orders/:orderId/capture
 */

const express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');
const { generateLicenseKey } = require('../utils/license');
const { saveLicense } = require('../utils/storage');
const { sendLicenseEmail } = require('../utils/mailer');

// Check if running in test mode
const TEST_MODE = process.env.TEST_MODE === 'true';

// PayPal environment configuration
function getPayPalClient() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured');
  }
  
  const environment = process.env.PAYPAL_MODE === 'live'
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);
  
  const client = new paypal.core.PayPalHttpClient(environment);
  
  // Increase timeout to 30 seconds
  client.timeout = 30000;
  
  return client;
}

/**
 * Capture a PayPal order and generate license
 * Request body: { email: "customer@example.com" }
 */
router.post('/:orderId/capture', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { email, plan, price } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    let transactionId, amount;

    // TEST MODE: Skip PayPal capture, use mock data
    if (TEST_MODE) {
      console.log(`[TEST MODE] Mock payment captured for order: ${orderId}`);
      transactionId = 'TEST-TXN-' + Date.now();
      amount = price || '0.00';
    } else {
      // Real PayPal capture
      const request = new paypal.orders.OrdersCaptureRequest(orderId);
      request.requestBody({});
      
      const client = getPayPalClient();
      const capture = await client.execute(request);

      // Check if payment was successful
      if (capture.result.status !== 'COMPLETED') {
        return res.status(400).json({ 
          error: 'Payment not completed',
          status: capture.result.status 
        });
      }

      transactionId = capture.result.purchase_units[0].payments.captures[0].id;
      amount = capture.result.purchase_units[0].payments.captures[0].amount.value;
    }

    // Generate license key
    const licenseKey = generateLicenseKey();
    
    // Prepare license data
    const licenseData = {
      key: licenseKey,
      email: email,
      plan: plan || 'unknown',
      orderId: orderId,
      transactionId: transactionId,
      amount: amount,
      currency: capture.result.purchase_units[0].payments.captures[0].amount.currency_code,
      createdAt: new Date().toISOString(),
      status: 'active',
    };

    // Save to storage
    const saved = saveLicense(licenseData);
    if (!saved) {
      console.error('Failed to save license to storage');
    }

    // Send email
    try {
      await sendLicenseEmail(email, licenseKey);
      console.log(`License email sent to ${email}`);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Don't fail the request if email fails - license is still valid
    }

    res.json({
      success: true,
      licenseKey: licenseKey,
      orderId: orderId,
      message: 'License generated and emailed successfully',
    });

  } catch (error) {
    console.error('Capture order error:', error);
    res.status(500).json({ 
      error: 'Failed to capture order',
      details: error.message 
    });
  }
});

module.exports = router;
