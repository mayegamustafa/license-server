/**
 * Validate License Key
 * GET /api/licenses/:licenseKey
 */

const express = require('express');
const router = express.Router();
const { isValidLicenseFormat } = require('../utils/license');
const { findLicense } = require('../utils/storage');

/**
 * Validate a license key
 * Returns license status and details if valid
 */
router.get('/:licenseKey', async (req, res) => {
  try {
    const { licenseKey } = req.params;

    // Check format first
    if (!isValidLicenseFormat(licenseKey)) {
      return res.status(400).json({ 
        valid: false,
        error: 'Invalid license key format' 
      });
    }

    // Look up license in storage
    const license = findLicense(licenseKey);

    if (!license) {
      return res.status(404).json({ 
        valid: false,
        error: 'License key not found' 
      });
    }

    // Check if license is active
    if (license.status !== 'active') {
      return res.json({ 
        valid: false,
        status: license.status,
        error: 'License is not active' 
      });
    }

    // Return success
    res.json({
      valid: true,
      licenseKey: license.key,
      status: license.status,
      createdAt: license.createdAt,
      message: 'License is valid and active',
    });

  } catch (error) {
    console.error('Validate license error:', error);
    res.status(500).json({ 
      valid: false,
      error: 'Failed to validate license' 
    });
  }
});

module.exports = router;
