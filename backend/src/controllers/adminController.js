/**
 * Administrator controller
 */
const adminService = require('../services/adminService');
const asyncHandler = require('../utils/asyncHandler');

exports.getDashboard = asyncHandler(async (req, res) => {
  const stats = await adminService.getDashboardStats();
  res.json({ success: true, data: stats });
});

exports.getUsers = asyncHandler(async (req, res) => {
  const result = await adminService.getUsers(req.query);
  res.json({ success: true, data: result });
});

exports.deactivateUser = asyncHandler(async (req, res) => {
  const user = await adminService.deactivateUser(req.user.user_id, req.params.userId);
  res.json({ success: true, data: user });
});

exports.reactivateUser = asyncHandler(async (req, res) => {
  const user = await adminService.reactivateUser(req.user.user_id, req.params.userId);
  res.json({ success: true, data: user });
});

exports.getActivityLogs = asyncHandler(async (req, res) => {
  const result = await adminService.getActivityLogs(req.query);
  res.json({ success: true, data: result });
});

exports.getNotifications = asyncHandler(async (req, res) => {
  const result = await adminService.getNotifications(req.query);
  res.json({ success: true, data: result });
});

exports.deleteNotification = asyncHandler(async (req, res) => {
  const result = await adminService.deleteNotification(req.user.user_id, req.params.notificationId);
  res.json({ success: true, data: result });
});
