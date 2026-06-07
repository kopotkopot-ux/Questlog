/**
 * Activity logging service - records all significant user actions
 */
const activityLogRepository = require('../repositories/activityLogRepository');

const activityLogService = {
  /**
   * Log an activity event
   */
  async log(userId, action, details = null) {
    try {
      return await activityLogRepository.create({ userId, action, details });
    } catch (error) {
      console.error('[ActivityLog] Failed to record:', action, error.message);
      return null;
    }
  },
};

module.exports = activityLogService;
