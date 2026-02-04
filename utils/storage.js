/**
 * JSON file storage for licenses
 */

const fs = require('fs');
const path = require('path');

const LICENSES_FILE = path.join(__dirname, '../storage/licenses.json');

/**
 * Initialize storage file if it doesn't exist
 */
function initStorage() {
  if (!fs.existsSync(LICENSES_FILE)) {
    fs.writeFileSync(LICENSES_FILE, JSON.stringify({ licenses: [] }, null, 2));
  }
}

/**
 * Read all licenses from storage
 * @returns {Array} Array of license objects
 */
function readLicenses() {
  try {
    initStorage();
    const data = fs.readFileSync(LICENSES_FILE, 'utf-8');
    return JSON.parse(data).licenses || [];
  } catch (error) {
    console.error('Error reading licenses:', error);
    return [];
  }
}

/**
 * Save a new license to storage
 * @param {Object} license - License object to save
 * @returns {boolean} True if successful
 */
function saveLicense(license) {
  try {
    initStorage();
    const data = JSON.parse(fs.readFileSync(LICENSES_FILE, 'utf-8'));
    data.licenses.push(license);
    fs.writeFileSync(LICENSES_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving license:', error);
    return false;
  }
}

/**
 * Find a license by key
 * @param {string} licenseKey - License key to search for
 * @returns {Object|null} License object or null if not found
 */
function findLicense(licenseKey) {
  const licenses = readLicenses();
  return licenses.find(lic => lic.key === licenseKey) || null;
}

module.exports = {
  initStorage,
  readLicenses,
  saveLicense,
  findLicense,
};
