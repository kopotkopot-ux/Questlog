/**
 * Password reset token data access layer (FR-003)
 */
const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const passwordResetRepository = {
  /**
   * Store hashed reset token with expiry
   */
  async create({ userId, tokenHash, expiresAt }) {
    const tokenId = uuidv4();
    // Invalidate previous unused tokens for this user
    await pool.execute(
      'UPDATE password_reset_tokens SET used = 1 WHERE user_id = ? AND used = 0',
      [userId]
    );
    await pool.execute(
      `INSERT INTO password_reset_tokens (token_id, user_id, token_hash, expires_at)
       VALUES (?, ?, ?, ?)`,
      [tokenId, userId, tokenHash, expiresAt]
    );
    return tokenId;
  },

  /**
   * Find valid unused token by hash
   */
  async findValidToken(tokenHash) {
    const [rows] = await pool.execute(
      `SELECT prt.token_id, prt.user_id, prt.token_hash, prt.expires_at, prt.used
       FROM password_reset_tokens prt
       WHERE prt.token_hash = ? AND prt.used = 0 AND prt.expires_at > NOW()`,
      [tokenHash]
    );
    return rows[0] || null;
  },

  /**
   * Mark token as used after successful reset
   */
  async markUsed(tokenId) {
    await pool.execute(
      'UPDATE password_reset_tokens SET used = 1 WHERE token_id = ?',
      [tokenId]
    );
  },
};

module.exports = passwordResetRepository;
