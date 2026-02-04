/**
 * Email sending utility using Nodemailer
 */

const nodemailer = require('nodemailer');

// Create transporter - using ethereal for testing, configure for production
let transporter;

/**
 * Initialize email transporter
 * Supports Gmail SMTP and other providers
 */
async function initializeMailer() {
  // Check if Gmail credentials are configured
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    // Gmail SMTP configuration
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
    console.log('Using Gmail SMTP for emails');
  } else if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    // Custom SMTP configuration (SendGrid, AWS SES, etc.)
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log(`Using SMTP: ${process.env.SMTP_HOST}`);
  } else {
    // Development/testing configuration - using ethereal for testing
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('⚠️  No email credentials found - Using Ethereal test account');
    console.log('Preview emails at: https://ethereal.email');
  }
}

/**
 * Send license key to customer email
 * @param {string} email - Customer email address
 * @param {string} licenseKey - Generated license key
 * @returns {Promise<boolean>} True if email sent successfully
 */
async function sendLicenseEmail(email, licenseKey) {
  try {
    if (!transporter) {
      await initializeMailer();
    }

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"License Server" <noreply@example.com>',
      to: email,
      subject: 'Your Chrome Extension License Key',
      text: `Thank you for your purchase!\n\nYour license key is: ${licenseKey}\n\nPlease save this key in a safe place. You will need it to activate your Chrome extension.\n\nIf you have any questions, please contact our support team.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Thank you for your purchase!</h2>
          <p>Your license key is:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; font-size: 18px; font-weight: bold; text-align: center; margin: 20px 0;">
            ${licenseKey}
          </div>
          <p>Please save this key in a safe place. You will need it to activate your Chrome extension.</p>
          <p>If you have any questions, please contact our support team.</p>
          <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #666;">This is an automated message. Please do not reply to this email.</p>
        </div>
      `,
    });

    console.log('✅ License email sent to: %s', email);
    console.log('   Message ID: %s', info.messageId);
    
    // For development with Ethereal
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('   Preview URL: %s', previewUrl);
    }

    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

module.exports = {
  sendLicenseEmail,
  initializeMailer,
};
