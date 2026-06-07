/**
 * User profile service
 */
const userRepository = require('../repositories/userRepository');
const activityLogRepository = require('../repositories/activityLogRepository');
const activityLogService = require('./activityLogService');
const ApiError = require('../utils/ApiError');

const userService = {
  /**
   * Update user profile
   */
  async updateProfile(userId, { username, email }) {
    const existing = await userRepository.findByEmail(email);
    if (existing && existing.user_id !== userId) {
      throw new ApiError(409, 'Email is already in use');
    }
    const existingUsername = await userRepository.findByUsername(username);
    if (existingUsername && existingUsername.user_id !== userId) {
      throw new ApiError(409, 'Username is already taken');
    }

    const user = await userRepository.updateProfile(userId, { username, email });
    await activityLogService.log(userId, 'PROFILE_UPDATED', `Profile updated for ${username}`);
    return {
      userId: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: Boolean(user.is_active),
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  },

  /**
   * Get user's own activity history
   */
  async getActivityHistory(userId, query) {
    const result = await activityLogRepository.findByUserId(userId, {
      page: parseInt(query.page, 10) || 1,
      limit: parseInt(query.limit, 10) || 10,
    });
    return result;
  },
};

module.exports = userService;
