# Chrome Extension License Server

A complete Node.js Express backend for selling Chrome extension licenses with PayPal integration.

## Features

- ✅ PayPal Checkout integration (supports card payments)
- 🔑 Automatic license key generation (format: WTEP-XXXX-XXXX-XXXX)
- 💾 Local JSON file storage for licenses
- 📧 Automatic email delivery of license keys
- 🔍 License validation API endpoint
- 🎨 Clean, responsive checkout UI
- 🔒 Production-ready and secure

## Project Structure

```
license-server/
├── server.js                 # Main Express server
├── routes/
│   ├── createOrder.js       # PayPal order creation
│   ├── captureOrder.js      # Payment capture & license generation
│   └── validateLicense.js   # License validation endpoint
├── utils/
│   ├── license.js           # License key generation
│   ├── mailer.js            # Email sending (Nodemailer)
│   └── storage.js           # JSON file storage operations
├── storage/
│   └── licenses.json        # License database
├── public/
│   └── index.html           # Checkout page UI
├── .env                     # Environment configuration
└── package.json             # Dependencies
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

**Important Settings:**

- **TEST_MODE**: Set to `true` for local testing without PayPal (recommended for development)
- Set to `false` when you have working PayPal credentials and network access

### 3. Configure PayPal (Required when TEST_MODE=false)

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Create a new app (or use existing)
3. Copy your **Client ID** and **Secret**
4. Update `.env` file with your credentials

### 3. Configure Environment Variables

Edit the `.env` file:

```env
# PayPal Credentials
PAYPAL_CLIENT_ID=your_client_id_here
PAYPAL_CLIENT_SECRET=your_secret_here
PAYPAL_MODE=sandbox  # Use 'live' for production

# Product Settings
LICENSE_PRICE=29.99
CURRENCY_CODE=USD
BRAND_NAME=Your Extension Name

# Email Settings (optional for development)
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 4. Configure Email (Optional for TEST_MODE)

For Gmail (recommended):
1. Enable 2FA on your Google account
2. Generate an App Password at https://myaccount.google.com/apppasswords
3. Update `.env`:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-password
```

### 5. Start the Server

```bash
npm start
```

The server will run on http://localhost:3000

**Server Output:**
- `⚠️ TEST MODE ENABLED` - Using mock payments (no PayPal network required)
- `✓ PayPal integration active` - Using real PayPal API

## Test Mode vs Production Mode

### TEST MODE (TEST_MODE=true)
- **Use for**: Local development, testing, network-restricted environments
- **What it does**: 
  - Generates mock PayPal order IDs
  - Skips actual PayPal API calls
  - Still generates real license keys
  - Still sends emails (if configured)
  - Tests full application flow without PayPal network access
- **Perfect for**: Developing on machines behind firewalls or with restricted internet

### PRODUCTION MODE (TEST_MODE=false)
- **Use for**: Production deployment with real payments
- **Requires**: 
  - Valid PayPal credentials
  - Network access to PayPal API
  - PAYPAL_MODE set to 'sandbox' (testing) or 'live' (production)

### 4. Update PayPal Client ID in Frontend

Edit `public/index.html` and replace the client ID in the PayPal SDK script:

```html
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=USD"></script>
```

## API Endpoints

### Create Order
```
POST /api/orders
Body: { "email": "customer@example.com" }
Response: { "orderID": "..." }
```

### Capture Payment
```
POST /api/orders/:orderId/capture
Body: { "email": "customer@example.com" }
Response: { 
  "success": true, 
  "licenseKey": "WTEP-XXXX-XXXX-XXXX",
  "message": "License generated and emailed successfully"
}
```

### Validate License
```
GET /api/licenses/:licenseKey
Response: { 
  "valid": true,
  "status": "active",
  "createdAt": "2026-02-01T..."
}
```

## Email Configuration

### Development Mode
The server automatically uses [Ethereal Email](https://ethereal.email) for testing. Check the console for preview URLs.

### Production Mode
Configure your SMTP service in `.env`:

**Gmail:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
```

**SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

## Testing

### Test with PayPal Sandbox

1. Use sandbox mode in `.env`: `PAYPAL_MODE=sandbox`
2. Use [PayPal test accounts](https://developer.paypal.com/dashboard/accounts)
3. Test credit card: Use PayPal's test cards

### Test License Validation

```bash
curl http://localhost:3000/api/licenses/WTEP-1234-5678-ABCD
```

## Production Deployment

### Before Going Live:

1. ✅ Change `PAYPAL_MODE=live` in `.env`
2. ✅ Use production PayPal credentials
3. ✅ Configure production SMTP service
4. ✅ Set `NODE_ENV=production`
5. ✅ Update frontend PayPal SDK script with production client ID
6. ✅ Secure your `.env` file (add to `.gitignore`)
7. ✅ Use HTTPS in production
8. ✅ Consider database instead of JSON for scaling

### Deployment Options:

- **Heroku:** `git push heroku main`
- **DigitalOcean:** Use App Platform or Droplet
- **AWS:** Elastic Beanstalk or EC2
- **Vercel/Netlify:** For serverless deployment

## Security Notes

- Never commit `.env` file to version control
- Use environment variables for all sensitive data
- Enable HTTPS in production
- Implement rate limiting for API endpoints
- Consider adding authentication for admin operations
- Regularly backup `storage/licenses.json`

## License

MIT License - Free to use for commercial projects

## Support

For issues or questions, please open an issue on GitHub.
