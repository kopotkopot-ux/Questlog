/**
 * User profile controller
 */
const userService = require('../services/userService');
const asyncHandler = require('../utils/asyncHandler');

exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user.user_id, req.body);
  res.json({ success: true, data: user });
});

exports.getActivityHistory = asyncHandler(async (req, res) => {
  const result = await userService.getActivityHistory(req.user.user_id, req.query);
  res.json({ success: true, data: result });
});
