/**
 * Authentication controller
 */
const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

exports.register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({ success: true, data: result });
});

exports.login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.json({ success: true, data: result });
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const result = await authService.refreshSession(req.body.refreshToken);
  res.json({ success: true, data: result });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body.email);
  res.json({ success: true, data: result });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(req.body);
  res.json({ success: true, data: result });
});

exports.getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.user_id);
  res.json({ success: true, data: user });
});

exports.logout = asyncHandler(async (req, res) => {
  const activityLogService = require('../services/activityLogService');
  await activityLogService.log(req.user.user_id, 'USER_LOGOUT', `${req.user.username} logged out`);
  res.json({ success: true, message: 'Logged out successfully' });
});
