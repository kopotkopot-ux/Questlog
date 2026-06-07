/**
 * Deadline notification cron job (FR-016)
 * Runs every hour to notify users of upcoming and overdue deadlines
 */
const cron = require('node-cron');
const taskRepository = require('../repositories/taskRepository');
const notificationRepository = require('../repositories/notificationRepository');

function startDeadlineNotifier() {
  // Run at the start of every hour
  cron.schedule('0 * * * *', async () => {
    try {
      const upcomingTasks = await taskRepository.findUpcomingDeadlines(24);

      for (const task of upcomingTasks) {
        const alreadySent = await notificationRepository.existsForTaskDeadline(
          task.user_id,
          task.title
        );
        if (!alreadySent) {
          const hoursLeft = Math.round(
            (new Date(task.deadline) - new Date()) / (1000 * 60 * 60)
          );
          await notificationRepository.create({
            userId: task.user_id,
            message: `Reminder: Quest "${task.title}" is due in ${hoursLeft} hour(s)!`,
          });
        }
      }

      // Notify overdue tasks
      const { pool } = require('../config/database');
      const [overdueTasks] = await pool.execute(
        `SELECT t.task_id, t.user_id, t.title FROM tasks t
         WHERE t.status = 'pending' AND t.deadline IS NOT NULL AND t.deadline < NOW()`
      );

      for (const task of overdueTasks) {
        const alreadySent = await notificationRepository.existsForTaskDeadline(
          task.user_id,
          `OVERDUE: ${task.title}`
        );
        if (!alreadySent) {
          await notificationRepository.create({
            userId: task.user_id,
            message: `OVERDUE: Quest "${task.title}" has passed its deadline! Complete it now.`,
          });
        }
      }

      console.log(`[DeadlineNotifier] Processed ${upcomingTasks.length} upcoming, ${overdueTasks.length} overdue tasks`);
    } catch (error) {
      console.error('[DeadlineNotifier] Error:', error.message);
    }
  });

  console.log('[DeadlineNotifier] Scheduled to run every hour');
}

module.exports = { startDeadlineNotifier };
