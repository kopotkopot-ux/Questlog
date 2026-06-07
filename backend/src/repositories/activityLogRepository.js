/**
 * Activity log data access layer (FR-024)
 */
const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const activityLogRepository = {
  /**
   * Record a system activity
   */
  async create({ userId, action, details }) {
    const logId = uuidv4();
    await pool.execute(
      `INSERT INTO activity_logs (log_id, user_id, action, details) VALUES (?, ?, ?, ?)`,
      [logId, userId, action, details || null]
    );
    return this.findById(logId);
  },

  /**
   * Find log by ID
   */
  async findById(logId) {
    const [rows] = await pool.execute(
      `SELECT log_id, user_id, action, details, log_date FROM activity_logs WHERE log_id = ?`,
      [logId]
    );
    return rows[0] || null;
  },

  /**
   * Get paginated activity logs (admin FR-024)
   */
  async findAll({ page = 1, limit = 20, search = '', action }) {
    const offset = (page - 1) * limit;
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (al.action LIKE ? OR al.details LIKE ? OR u.username LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }
    if (action) {
      whereClause += ' AND al.action = ?';
      params.push(action);
    }

    const countParams = [...params];
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM activity_logs al
       JOIN users u ON al.user_id = u.user_id ${whereClause}`,
      countParams
    );

    params.push(limit, offset);
    const [rows] = await pool.execute(
      `SELECT al.log_id, al.user_id, u.username, al.action, al.details, al.log_date
       FROM activity_logs al JOIN users u ON al.user_id = u.user_id
       ${whereClause}
       ORDER BY al.log_date DESC LIMIT ? OFFSET ?`,
      params
    );

    const total = countResult[0].total;
    return { logs: rows, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  /**
   * Get recent logs for a specific user
   */
  async findByUserId(userId, { page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM activity_logs WHERE user_id = ?',
      [userId]
    );
    const [rows] = await pool.execute(
      `SELECT log_id, user_id, action, details, log_date
       FROM activity_logs WHERE user_id = ?
       ORDER BY log_date DESC LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    const total = countResult[0].total;
    return { logs: rows, total, page, limit, totalPages: Math.ceil(total / limit) };
  },
};

module.exports = activityLogRepository;
