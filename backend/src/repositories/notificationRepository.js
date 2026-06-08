/**
 * Notification data access layer
 */
const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const notificationRepository = {
  /**
   * Create a notification (FR-016)
   */
  async create({ userId, message }) {
    const notificationId = uuidv4();
    await pool.execute(
      `INSERT INTO notifications (notification_id, user_id, message, notification_status)
       VALUES (?, ?, ?, 'unread')`,
      [notificationId, userId, message]
    );
    return this.findById(notificationId);
  },

  /**
   * Find notification by ID
   */
  async findById(notificationId) {
    const [rows] = await pool.execute(
      `SELECT notification_id, user_id, message, notification_status, notification_date
       FROM notifications WHERE notification_id = ?`,
      [notificationId]
    );
    return rows[0] || null;
  },

  /**
   * Get paginated notifications for a user
   */
  async findByUserId(userId, { page = 1, limit = 10, status }) {
    const offset = (page - 1) * limit;
    let whereClause = 'WHERE user_id = ?';
    const params = [userId];

    if (status) {
      whereClause += ' AND notification_status = ?';
      params.push(status);
    }

    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM notifications ${whereClause}`,
      params
    );

    const safeLimit = Number(limit);
    const safeOffset = Number(offset);

    const [rows] = await pool.query(
    `SELECT notification_id, user_id, message, notification_status, notification_date
    FROM notifications ${whereClause}
    ORDER BY notification_date DESC
    LIMIT ${safeLimit} OFFSET ${safeOffset}`,
    params
  );

    const total = countResult[0].total;
    return { notifications: rows, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId) {
    await pool.execute(
      `UPDATE notifications SET notification_status = 'read' WHERE notification_id = ?`,
      [notificationId]
    );
    return this.findById(notificationId);
  },

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId) {
    await pool.execute(
      `UPDATE notifications SET notification_status = 'read' WHERE user_id = ? AND notification_status = 'unread'`,
      [userId]
    );
  },

  /**
   * Count unread notifications for a user
   */
  async countUnread(userId) {
    const [rows] = await pool.execute(
      `SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND notification_status = 'unread'`,
      [userId]
    );
    return rows[0].count;
  },

  /**
   * Delete notification (admin management FR-025)
   */
  async delete(notificationId) {
    const [result] = await pool.execute(
      'DELETE FROM notifications WHERE notification_id = ?',
      [notificationId]
    );
    return result.affectedRows > 0;
  },

  /**
   * Get all notifications paginated (admin FR-025)
   */
  async findAll({ page = 1, limit = 10, search = '' }) {
    const offset = (page - 1) * limit;
    const searchTerm = `%${search}%`;

    const countQuery = search
      ? `SELECT COUNT(*) as total FROM notifications n
         JOIN users u ON n.user_id = u.user_id
         WHERE n.message LIKE ? OR u.username LIKE ?`
      : `SELECT COUNT(*) as total FROM notifications`;

    const safeLimit = Number(limit);
    const safeOffset = Number(offset);

    const dataQuery = search
    ? `SELECT n.notification_id, n.user_id, u.username, n.message, n.notification_status, n.notification_date
     FROM notifications n
     JOIN users u ON n.user_id = u.user_id
     WHERE n.message LIKE ? OR u.username LIKE ?
     ORDER BY n.notification_date DESC
     LIMIT ${safeLimit} OFFSET ${safeOffset}`
    : `SELECT n.notification_id, n.user_id, u.username, n.message, n.notification_status, n.notification_date
     FROM notifications n
     JOIN users u ON n.user_id = u.user_id
     ORDER BY n.notification_date DESC
     LIMIT ${safeLimit} OFFSET ${safeOffset}`;

    const [[countResult], [rows]] = await Promise.all([
    pool.execute(countQuery, search ? [searchTerm, searchTerm] : []),
    pool.execute(dataQuery, search ? [searchTerm, searchTerm] : []),
    ]);

    return {
      notifications: rows,
      total: countResult[0].total,
      page,
      limit,
      totalPages: Math.ceil(countResult[0].total / limit),
    };
  },

  /**
   * Check if deadline notification already sent for a task
   */
  async existsForTaskDeadline(userId, taskTitle) {
    const [rows] = await pool.execute(
      `SELECT notification_id FROM notifications
       WHERE user_id = ? AND message LIKE ?
       AND notification_date > DATE_SUB(NOW(), INTERVAL 23 HOUR)`,
      [userId, `%${taskTitle}%`]
    );
    return rows.length > 0;
  },
};

module.exports = notificationRepository;
