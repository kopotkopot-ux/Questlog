/**
 * Task data access layer
 */
const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const taskRepository = {
  /**
   * Create a new task (FR-005)
   */
  async create({ userId, title, description, priorityLevel, deadline }) {
    const taskId = uuidv4();
    await pool.execute(
      `INSERT INTO tasks (task_id, user_id, title, description, priority_level, deadline, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [taskId, userId, title, description || null, priorityLevel, deadline || null]
    );
    return this.findById(taskId);
  },

  /**
   * Find task by ID
   */
  async findById(taskId) {
    const [rows] = await pool.execute(
      `SELECT task_id, user_id, title, description, priority_level, deadline, status, created_at, updated_at
       FROM tasks WHERE task_id = ?`,
      [taskId]
    );
    return rows[0] || null;
  },

  /**
   * Get paginated tasks for a user with optional filters (FR-006)
   */
  async findByUserId(userId, { page = 1, limit = 10, status, priority, search = '' }) {
    
    console.log('findByUserId params:', {
    userId,
    page,
    limit,
    status,
    priority,
    search,
    pageType: typeof page,
    limitType: typeof limit
    });

    const offset = (page - 1) * limit;
    let whereClause = 'WHERE user_id = ?';
    const params = [userId];

    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }
    if (priority) {
      whereClause += ' AND priority_level = ?';
      params.push(priority);
    }
    if (search) {
      whereClause += ' AND (title LIKE ? OR description LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term);
    }

    const countParams = [...params];
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM tasks ${whereClause}`,
      countParams
    );

    const safeLimit = Math.max(1, Number(limit) || 10);
    const safeOffset = Math.max(0, Number(offset) || 0);

const [rows] = await pool.query(
  `SELECT task_id, user_id, title, description, priority_level, deadline, status, created_at, updated_at
   FROM tasks ${whereClause}
   ORDER BY
     CASE WHEN deadline IS NULL THEN 1 ELSE 0 END,
     deadline ASC,
     created_at DESC
   LIMIT ${safeLimit} OFFSET ${safeOffset}`,
  params
);

    const total = countResult[0].total;
    return { tasks: rows, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  /**
   * Update task fields (FR-007)
   */
  async update(taskId, { title, description, priorityLevel, deadline, status }) {
    await pool.execute(
      `UPDATE tasks SET title = ?, description = ?, priority_level = ?, deadline = ?, status = ?, updated_at = NOW()
       WHERE task_id = ?`,
      [title, description || null, priorityLevel, deadline || null, status, taskId]
    );
    return this.findById(taskId);
  },

  /**
   * Delete task (FR-008)
   */
  async delete(taskId) {
    const [result] = await pool.execute('DELETE FROM tasks WHERE task_id = ?', [taskId]);
    return result.affectedRows > 0;
  },

  /**
   * Mark task as completed (FR-009)
   */
  async markCompleted(taskId) {
    await pool.execute(
      `UPDATE tasks SET status = 'completed', updated_at = NOW() WHERE task_id = ?`,
      [taskId]
    );
    return this.findById(taskId);
  },

  /**
   * Revert task to pending (FR-010)
   */
  async markPending(taskId) {
    await pool.execute(
      `UPDATE tasks SET status = 'pending', updated_at = NOW() WHERE task_id = ?`,
      [taskId]
    );
    return this.findById(taskId);
  },

  /**
   * Get progress statistics for a user (FR-018, FR-019)
   */
  async getProgressStats(userId) {
    const [rows] = await pool.execute(
      `SELECT
         COUNT(*) as total,
         SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
         SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
         SUM(CASE WHEN status = 'pending' AND deadline IS NOT NULL AND deadline < NOW() THEN 1 ELSE 0 END) as overdue
       FROM tasks WHERE user_id = ?`,
      [userId]
    );
    const stats = rows[0];
    const total = Number(stats.total);
    const completed = Number(stats.completed);
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending: Number(stats.pending), overdue: Number(stats.overdue), percentage };
  },

  /**
   * Find tasks with upcoming deadlines for notification job (FR-016)
   */
  async findUpcomingDeadlines(hoursAhead = 24) {
    const [rows] = await pool.execute(
      `SELECT t.task_id, t.user_id, t.title, t.deadline, t.status
       FROM tasks t
       WHERE t.status = 'pending'
         AND t.deadline IS NOT NULL
         AND t.deadline BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL ? HOUR)`,
      [hoursAhead]
    );
    return rows;
  },

  /**
   * Find overdue pending tasks (FR-017)
   */
  async findOverdueByUserId(userId) {
    const [rows] = await pool.execute(
      `SELECT task_id, user_id, title, description, priority_level, deadline, status, created_at, updated_at
       FROM tasks
       WHERE user_id = ? AND status = 'pending' AND deadline IS NOT NULL AND deadline < NOW()
       ORDER BY deadline ASC`,
      [userId]
    );
    return rows;
  },

  /**
   * Count all tasks system-wide (admin stats)
   */
  async countAll() {
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM tasks');
    return rows[0].count;
  },
};

module.exports = taskRepository;
