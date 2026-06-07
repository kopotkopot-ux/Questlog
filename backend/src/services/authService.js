/**
 * Authentication service - registration, login, password reset, session management
 * Implements FR-001 through FR-004
 */
const crypto = require('crypto');
const userRepository = require('../repositories/userRepository');
const passwordResetRepository = require('../repositories/passwordResetRepository');
const activityLogService = require('./activityLogService');
const emailService = require('./emailService');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');

const authService = {
  /**
   * Register a new user account (FR-001)
   */
  async register({ username, email, password }) {
    const existingEmail = await userRepository.findByEmail(email);
    if (existingEmail) throw new ApiError(409, 'Email is already registered');

    const existingUsername = await userRepository.findByUsername(username);
    if (existingUsername) throw new ApiError(409, 'Username is already taken');

    const passwordHash = await hashPassword(password);
    const user = await userRepository.create({ username, email, passwordHash, role: 'user' });

    await activityLogService.log(user.user_id, 'USER_REGISTERED', `New user registered: ${username}`);
    await notificationRepositorySafe(user.user_id, 'Welcome to QuestLog! Your adventure begins now.');

    const tokens = authService.generateTokens(user);
    return { user: sanitizeUser(user), ...tokens };
  },

  /**
   * Authenticate user login (FR-002, FR-021 for admin)
   */
  async login({ identifier, password }) {
    const user = await userRepository.findByEmailOrUsername(identifier);
    if (!user) throw new ApiError(401, 'Invalid credentials');

    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) throw new ApiError(401, 'Invalid credentials');

    if (!user.is_active) throw new ApiError(403, 'Account has been deactivated. Contact an administrator.');

    const sanitized = sanitizeUser(user);
    await activityLogService.log(
      user.user_id,
      user.role === 'admin' ? 'ADMIN_LOGIN' : 'USER_LOGIN',
      `${user.username} logged in`
    );

    const tokens = authService.generateTokens(user);
    return { user: sanitized, ...tokens };
  },

  /**
   * Generate JWT access and refresh tokens (FR-004)
   */
  generateTokens(user) {
    const payload = { userId: user.user_id, role: user.role, username: user.username };
    return {
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload),
    };
  },

  /**
   * Refresh access token using valid refresh token
   */
  async refreshSession(refreshToken) {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await userRepository.findById(decoded.userId);
    if (!user || !user.is_active) throw new ApiError(401, 'Invalid session');

    const tokens = authService.generateTokens(user);
    return { user: sanitizeUser(user), ...tokens };
  },

  /**
   * Initiate password reset flow (FR-003)
   */
  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);
    // Always return success to prevent email enumeration
    if (!user) return { message: 'If that email exists, a reset link has been sent.' };

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiresHours = parseInt(process.env.RESET_TOKEN_EXPIRES_HOURS, 10) || 1;
    const expiresAt = new Date(Date.now() + expiresHours * 60 * 60 * 1000);

    await passwordResetRepository.create({ userId: user.user_id, tokenHash, expiresAt });
    await emailService.sendPasswordResetEmail(user.email, resetToken);
    await activityLogService.log(user.user_id, 'PASSWORD_RESET_REQUESTED', 'Password reset email sent');

    return { message: 'If that email exists, a reset link has been sent.' };
  },

  /**
   * Complete password reset with token (FR-003)
   */
  async resetPassword({ token, password }) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const resetRecord = await passwordResetRepository.findValidToken(tokenHash);
    if (!resetRecord) throw new ApiError(400, 'Invalid or expired reset token');

    const passwordHash = await hashPassword(password);
    await userRepository.updatePassword(resetRecord.user_id, passwordHash);
    await passwordResetRepository.markUsed(resetRecord.token_id);
    await activityLogService.log(resetRecord.user_id, 'PASSWORD_RESET_COMPLETED', 'Password successfully reset');

    return { message: 'Password has been reset successfully. You may now log in.' };
  },

  /**
   * Get current authenticated user profile
   */
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');
    return sanitizeUser(user);
  },
};

/** Strip sensitive fields from user object */
function sanitizeUser(user) {
  const { password_hash, ...safe } = user;
  return safe;
}

/** Lazy import to avoid circular dependency */
async function notificationRepositorySafe(userId, message) {
  const notificationRepository = require('../repositories/notificationRepository');
  await notificationRepository.create({ userId, message });
}

module.exports = authService;
