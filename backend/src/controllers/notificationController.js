/**
 * Notification controller
 */
const notificationService = require('../services/notificationService');
const asyncHandler = require('../utils/asyncHandler');

exports.getNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.getNotifications(req.user.user_id, req.query);
  res.json({ success: true, data: result });
});

exports.getUnreadCount = asyncHandler(async (req, res) => {
  const result = await notificationService.getUnreadCount(req.user.user_id);
  res.json({ success: true, data: result });
});

exports.markAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(req.user.user_id, req.params.notificationId);
  res.json({ success: true, data: notification });
});

exports.markAllAsRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user.user_id);
  res.json({ success: true, data: result });
});
