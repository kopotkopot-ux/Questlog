/**
 * Password hashing utilities using bcrypt with 12 salt rounds (SRS security requirement)
 */
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

/**
 * Hash a plain-text password
 * @param {string} password
 * @returns {Promise<string>}
 */
async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare plain-text password with stored hash
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

module.exports = { hashPassword, comparePassword, SALT_ROUNDS };
