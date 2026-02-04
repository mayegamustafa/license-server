# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies (Already Done ✅)
```bash
npm install
```

### Step 2: Get PayPal Credentials

1. Go to https://developer.paypal.com/dashboard/
2. Log in or create account
3. Create a new app
4. Copy your **Client ID** and **Secret**

### Step 3: Configure .env File

Open `.env` and update these lines:

```env
PAYPAL_CLIENT_ID=your_actual_client_id
PAYPAL_CLIENT_SECRET=your_actual_secret
```

### Step 4: Update Frontend

Open `public/index.html` and find line with PayPal SDK (around line 184):

Change:
```html
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=USD"></script>
```

To:
```html
<script src="https://www.paypal.com/sdk/js?client-id=your_actual_client_id&currency=USD"></script>
```

### Step 5: Start Server

```bash
npm start
```

### Step 6: Test It!

1. Open browser: http://localhost:3000
2. Enter test email
3. Click PayPal button
4. Use PayPal sandbox test account to complete payment
5. Get your license key!

## 📧 Email Testing (Development)

In development mode, emails are sent to Ethereal (test service).
Check the console for preview URLs like:
```
Preview URL: https://ethereal.email/message/xxxxx
```

## 🧪 Test License Validation

After generating a license, test validation:

```bash
curl http://localhost:3000/api/licenses/WTEP-XXXX-XXXX-XXXX
```

## ⚙️ Configuration Options

Edit `.env` to customize:

- `LICENSE_PRICE` - Price in dollars (default: 29.99)
- `CURRENCY_CODE` - Currency (USD, EUR, GBP, etc.)
- `BRAND_NAME` - Your extension name
- `PORT` - Server port (default: 3000)

## 🔧 Common Issues

**Issue:** PayPal button doesn't show
- Check that you updated the Client ID in index.html
- Open browser console for errors

**Issue:** Email not sending
- In development, this is normal (uses test service)
- Check console for Ethereal preview URL

**Issue:** Can't create order
- Verify PayPal credentials in .env
- Check that PAYPAL_MODE is set to "sandbox"

## 📚 Next Steps

1. Test with PayPal sandbox
2. Configure production SMTP for emails
3. Deploy to production server
4. Switch to live PayPal mode
5. Integrate with your Chrome extension

## 🎯 Integration with Chrome Extension

In your Chrome extension, validate licenses like this:

```javascript
async function validateLicense(licenseKey) {
  const response = await fetch(
    `https://your-server.com/api/licenses/${licenseKey}`
  );
  const data = await response.json();
  return data.valid;
}
```

---

Need help? Check README.md for detailed documentation.
