/**
 * JWT token generation and verification utilities
 * Protects against tampering via signature verification
 */
const jwt = require('jsonwebtoken');
const ApiError = require('./ApiError');

/**
 * Generate access token for authenticated session (FR-004)
 */
function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    issuer: 'questlog-api',
    audience: 'questlog-client',
  });
}

/**
 * Generate refresh token for session renewal
 */
function generateRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: 'questlog-api',
    audience: 'questlog-client',
  });
}

/**
 * Verify access token and return decoded payload
 */
function verifyAccessToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'questlog-api',
      audience: 'questlog-client',
    });
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired access token');
  }
}

/**
 * Verify refresh token
 */
function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
      issuer: 'questlog-api',
      audience: 'questlog-client',
    });
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
