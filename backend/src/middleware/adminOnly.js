/**
 * Admin-only authorization middleware (FR-021, AU-002)
 * Administrators must NOT access user task routes via this middleware on admin routes
 */
const ApiError = require('../utils/ApiError');

function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return next(new ApiError(403, 'Administrator access required'));
  }
  next();
}

module.exports = adminOnly;
