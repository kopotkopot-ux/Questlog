/**
 * Notification service - FR-016, FR-017
 */
const notificationRepository = require('../repositories/notificationRepository');
const ApiError = require('../utils/ApiError');

const notificationService = {
  /**
   * Get paginated notifications for authenticated user
   */
  async getNotifications(userId, query) {
    const result = await notificationRepository.findByUserId(userId, {
      page: parseInt(query.page, 10) || 1,
      limit: parseInt(query.limit, 10) || 10,
      status: query.status,
    });
    result.notifications = result.notifications.map(formatNotification);
    return result;
  },

  /**
   * Get unread notification count for badge indicator
   */
  async getUnreadCount(userId) {
    const count = await notificationRepository.countUnread(userId);
    return { unreadCount: count };
  },

  /**
   * Mark single notification as read
   */
  async markAsRead(userId, notificationId) {
    const notification = await notificationRepository.findById(notificationId);
    if (!notification) throw new ApiError(404, 'Notification not found');
    if (notification.user_id !== userId) throw new ApiError(403, 'Access denied');

    const updated = await notificationRepository.markAsRead(notificationId);
    return formatNotification(updated);
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId) {
    await notificationRepository.markAllAsRead(userId);
    return { message: 'All notifications marked as read' };
  },
};

function formatNotification(n) {
  return {
    notificationId: n.notification_id,
    userId: n.user_id,
    username: n.username || undefined,
    message: n.message,
    status: n.notification_status,
    date: n.notification_date,
  };
}

module.exports = notificationService;
