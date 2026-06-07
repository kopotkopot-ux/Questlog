/**
 * User data access layer - parameterized queries prevent SQL injection
 */
const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const userRepository = {
  /**
   * Create a new user account
   */
  async create({ username, email, passwordHash, role = 'user' }) {
    const userId = uuidv4();
    await pool.execute(
      `INSERT INTO users (user_id, username, email, password_hash, role, is_active)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [userId, username, email, passwordHash, role]
    );
    return this.findById(userId);
  },

  /**
   * Find user by primary key
   */
  async findById(userId) {
    const [rows] = await pool.execute(
      `SELECT user_id, username, email, role, is_active, created_at, updated_at
       FROM users WHERE user_id = ?`,
      [userId]
    );
    return rows[0] || null;
  },

  /**
   * Find user by email (includes password hash for auth)
   */
  async findByEmail(email) {
    const [rows] = await pool.execute(
      `SELECT user_id, username, email, password_hash, role, is_active, created_at, updated_at
       FROM users WHERE email = ?`,
      [email]
    );
    return rows[0] || null;
  },

  /**
   * Find user by username
   */
  async findByUsername(username) {
    const [rows] = await pool.execute(
      `SELECT user_id, username, email, password_hash, role, is_active, created_at, updated_at
       FROM users WHERE username = ?`,
      [username]
    );
    return rows[0] || null;
  },

  /**
   * Find user by email or username for login
   */
  async findByEmailOrUsername(identifier) {
    const [rows] = await pool.execute(
      `SELECT user_id, username, email, password_hash, role, is_active, created_at, updated_at
       FROM users WHERE email = ? OR username = ?`,
      [identifier, identifier]
    );
    return rows[0] || null;
  },

  /**
   * Update user password hash
   */
  async updatePassword(userId, passwordHash) {
    await pool.execute(
      'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE user_id = ?',
      [passwordHash, userId]
    );
  },

  /**
   * Update user profile fields
   */
  async updateProfile(userId, { username, email }) {
    await pool.execute(
      'UPDATE users SET username = ?, email = ?, updated_at = NOW() WHERE user_id = ?',
      [username, email, userId]
    );
    return this.findById(userId);
  },

  /**
   * Get paginated list of all users (admin)
   */
  async findAll({ page = 1, limit = 10, search = '' }) {
    const offset = (page - 1) * limit;
    const searchTerm = `%${search}%`;
    const params = search ? [searchTerm, searchTerm, limit, offset] : [limit, offset];

    const countQuery = search
      ? `SELECT COUNT(*) as total FROM users WHERE username LIKE ? OR email LIKE ?`
      : `SELECT COUNT(*) as total FROM users`;

    const dataQuery = search
      ? `SELECT user_id, username, email, role, is_active, created_at, updated_at
         FROM users WHERE username LIKE ? OR email LIKE ?
         ORDER BY created_at DESC LIMIT ? OFFSET ?`
      : `SELECT user_id, username, email, role, is_active, created_at, updated_at
         FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?`;

    const [[countResult], [rows]] = await Promise.all([
      pool.execute(countQuery, search ? [searchTerm, searchTerm] : []),
      pool.execute(dataQuery, params),
    ]);

    return {
      users: rows,
      total: countResult[0].total,
      page,
      limit,
      totalPages: Math.ceil(countResult[0].total / limit),
    };
  },

  /**
   * Set user active status (admin deactivate/reactivate)
   */
  async setActiveStatus(userId, isActive) {
    await pool.execute(
      'UPDATE users SET is_active = ?, updated_at = NOW() WHERE user_id = ?',
      [isActive ? 1 : 0, userId]
    );
    return this.findById(userId);
  },

  /**
   * Count total registered users
   */
  async countAll() {
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM users');
    return rows[0].count;
  },
};

module.exports = userRepository;
