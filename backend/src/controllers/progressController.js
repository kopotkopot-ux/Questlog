/**
 * Progress tracking controller
 */
const progressService = require('../services/progressService');
const asyncHandler = require('../utils/asyncHandler');

exports.getProgress = asyncHandler(async (req, res) => {
  const progress = await progressService.getProgress(req.user.user_id);
  res.json({ success: true, data: progress });
});
