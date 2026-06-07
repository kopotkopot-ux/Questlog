/**
 * Progress tracking service - FR-018, FR-019, FR-020
 */
const taskRepository = require('../repositories/taskRepository');

const progressService = {
  /**
   * Get progress statistics and percentage for user dashboard
   */
  async getProgress(userId) {
    const stats = await taskRepository.getProgressStats(userId);
    return {
      totalTasks: stats.total,
      completedTasks: stats.completed,
      pendingTasks: stats.pending,
      overdueTasks: stats.overdue,
      progressPercentage: stats.percentage,
    };
  },
};

module.exports = progressService;
