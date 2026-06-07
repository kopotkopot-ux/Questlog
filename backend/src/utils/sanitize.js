/**
 * Input sanitization utilities to prevent XSS attacks
 */
const xss = require('xss');

/**
 * Sanitize a string value by stripping HTML/script tags
 * @param {string} value
 * @returns {string}
 */
function sanitizeString(value) {
  if (value === null || value === undefined) return value;
  if (typeof value !== 'string') return value;
  return xss(value.trim());
}

/**
 * Recursively sanitize all string fields in an object
 * @param {object} obj
 * @returns {object}
 */
function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const sanitized = Array.isArray(obj) ? [] : {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

module.exports = { sanitizeString, sanitizeObject };
