/**
 * User-only authorization middleware
 * Prevents administrators from accessing personal task management routes
 */
const ApiError = require('../utils/ApiError');

function userOnly(req, res, next) {
  if (!req.user || req.user.role !== 'user') {
    return next(new ApiError(403, 'This feature is available to registered users only'));
  }
  next();
}

module.exports = userOnly;
