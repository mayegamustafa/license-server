/**
 * License key generation and validation
 */

const crypto = require('crypto');
const { findLicense } = require('./storage');

// Characters allowed in license keys (uppercase letters and numbers)
const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Generate a random segment of 4 characters
 * @returns {string} 4-character segment
 */
function generateSegment() {
  let segment = '';
  for (let i = 0; i < 4; i++) {
    const randomIndex = crypto.randomInt(0, CHARACTERS.length);
    segment += CHARACTERS[randomIndex];
  }
  return segment;
}

/**
 * Generate a license key in format WTEP-XXXX-XXXX-XXXX
 * Uses uppercase letters (A-Z) and numbers (0-9)
 * Ensures uniqueness by checking existing licenses
 * @returns {string} Generated unique license key
 */
function generateLicenseKey() {
  let licenseKey;
  let attempts = 0;
  const maxAttempts = 100;
  
  // Generate unique license key
  do {
    const segment1 = generateSegment();
    const segment2 = generateSegment();
    const segment3 = generateSegment();
    licenseKey = `WTEP-${segment1}-${segment2}-${segment3}`;
    attempts++;
    
    // Prevent infinite loop
    if (attempts >= maxAttempts) {
      throw new Error('Failed to generate unique license key after multiple attempts');
    }
  } while (findLicense(licenseKey));
  
  return licenseKey;
}

/**
 * Validate license key format
 * @param {string} licenseKey - License key to validate
 * @returns {boolean} True if valid format
 */
function isValidLicenseFormat(licenseKey) {
  const pattern = /^WTEP-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  return pattern.test(licenseKey);
}

module.exports = {
  generateLicenseKey,
  isValidLicenseFormat,
};
