/**
 * Administrator service - FR-021 through FR-025
 * Admin functionality isolated from user task management
 */
const userRepository = require('../repositories/userRepository');
const notificationRepository = require('../repositories/notificationRepository');
const activityLogRepository = require('../repositories/activityLogRepository');
const taskRepository = require('../repositories/taskRepository');
const activityLogService = require('./activityLogService');
const ApiError = require('../utils/ApiError');

const adminService = {
  /**
   * Get system dashboard statistics
   */
  async getDashboardStats() {
    const [userCount, taskCount] = await Promise.all([
      userRepository.countAll(),
      taskRepository.countAll(),
    ]);
    return { totalUsers: userCount, totalTasks: taskCount };
  },

  /**
   * Get paginated registered users with search (FR-022)
   */
  async getUsers(query) {
    const result = await userRepository.findAll({
      page: parseInt(query.page, 10) || 1,
      limit: parseInt(query.limit, 10) || 10,
      search: query.search || '',
    });
    result.users = result.users.map(formatUser);
    return result;
  },

  /**
   * Deactivate user account (FR-023)
   */
  async deactivateUser(adminId, userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');
    if (user.role === 'admin') throw new ApiError(403, 'Cannot deactivate administrator accounts');
    if (user.user_id === adminId) throw new ApiError(403, 'Cannot deactivate your own account');

    const updated = await userRepository.setActiveStatus(userId, false);
    await activityLogService.log(adminId, 'USER_DEACTIVATED', `Deactivated user: ${user.username}`);
    return formatUser(updated);
  },

  /**
   * Reactivate user account
   */
  async reactivateUser(adminId, userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');

    const updated = await userRepository.setActiveStatus(userId, true);
    await activityLogService.log(adminId, 'USER_REACTIVATED', `Reactivated user: ${user.username}`);
    return formatUser(updated);
  },

  /**
   * Get system activity logs (FR-024)
   */
  async getActivityLogs(query) {
    const result = await activityLogRepository.findAll({
      page: parseInt(query.page, 10) || 1,
      limit: parseInt(query.limit, 10) || 20,
      search: query.search || '',
      action: query.action,
    });
    result.logs = result.logs.map(formatLog);
    return result;
  },

  /**
   * Get all system notifications (FR-025)
   */
  async getNotifications(query) {
    const result = await notificationRepository.findAll({
      page: parseInt(query.page, 10) || 1,
      limit: parseInt(query.limit, 10) || 10,
      search: query.search || '',
    });
    result.notifications = result.notifications.map((n) => ({
      notificationId: n.notification_id,
      userId: n.user_id,
      username: n.username,
      message: n.message,
      status: n.notification_status,
      date: n.notification_date,
    }));
    return result;
  },

  /**
   * Delete a notification (FR-025)
   */
  async deleteNotification(adminId, notificationId) {
    const notification = await notificationRepository.findById(notificationId);
    if (!notification) throw new ApiError(404, 'Notification not found');

    await notificationRepository.delete(notificationId);
    await activityLogService.log(adminId, 'NOTIFICATION_DELETED', `Deleted notification: ${notificationId}`);
    return { message: 'Notification deleted successfully' };
  },
};

function formatUser(user) {
  return {
    userId: user.user_id,
    username: user.username,
    email: user.email,
    role: user.role,
    isActive: Boolean(user.is_active),
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}

function formatLog(log) {
  return {
    logId: log.log_id,
    userId: log.user_id,
    username: log.username,
    action: log.action,
    details: log.details,
    date: log.log_date,
  };
}

module.exports = adminService;
