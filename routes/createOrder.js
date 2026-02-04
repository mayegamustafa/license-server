/**
 * Create PayPal Order
 * POST /api/orders
 */

const express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');
const crypto = require('crypto');

// Check if running in test mode
const TEST_MODE = process.env.TEST_MODE === 'true';

// PayPal environment configuration
function getPayPalClient() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured');
  }
  
  // Use sandbox for development, live for production
  const environment = process.env.PAYPAL_MODE === 'live'
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);
  
  const client = new paypal.core.PayPalHttpClient(environment);
  
  // Increase timeout to 30 seconds
  client.timeout = 30000;
  
  return client;
}

/**
 * Create a PayPal order
 * Request body: { email: "customer@example.com" }
 */
router.post('/', async (req, res) => {
  try {
    const { email, price, plan } = req.body;
    
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }

    if (!price || !plan) {
      return res.status(400).json({ error: 'Plan and price are required' });
    }

    // TEST MODE: Generate mock order ID without calling PayPal
    if (TEST_MODE) {
      const mockOrderId = 'TEST-' + crypto.randomBytes(8).toString('hex').toUpperCase();
      console.log(`[TEST MODE] Mock order created: ${mockOrderId} for ${email} - ${plan} plan ($${price})`);
      return res.json({ orderID: mockOrderId });
    }

    // Plan descriptions
    const planDescriptions = {
      basic: 'Chrome Extension License - Basic Plan',
      pro: 'Chrome Extension License - Pro Plan'
    };

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: process.env.CURRENCY_CODE || 'USD',
            value: price,
          },
          description: planDescriptions[plan] || 'Chrome Extension License',
        },
      ],
      application_context: {
        brand_name: process.env.BRAND_NAME || 'Your Extension',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
      },
    });

    const client = getPayPalClient();
    const order = await client.execute(request);

    console.log('Order created successfully:', order.result.id);

    res.json({
      orderID: order.result.id,
    });
  } catch (error) {
    console.error('Create order error:', error);
    
    let errorMessage = 'Failed to create order';
    if (error.message && error.message.includes('timeout')) {
      errorMessage = 'PayPal request timed out. Please try again.';
    } else if (error.message && error.message.includes('credentials')) {
      errorMessage = 'PayPal configuration error. Please contact support.';
    } else if (error.statusCode) {
      errorMessage = `PayPal error: ${error.statusCode}`;
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
