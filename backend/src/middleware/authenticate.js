/**
 * Authentication middleware - verifies JWT access token (FR-004)
 */
const { verifyAccessToken } = require('../utils/jwt');
const userRepository = require('../repositories/userRepository');
const ApiError = require('../utils/ApiError');

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Access token required'));
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyAccessToken(token);

  const user = await userRepository.findById(decoded.userId);
  if (!user) {
    return next(new ApiError(401, 'User not found'));
  }
  if (!user.is_active) {
    return next(new ApiError(403, 'Account has been deactivated'));
  }

  req.user = user;
  next();
}

module.exports = authenticate;
