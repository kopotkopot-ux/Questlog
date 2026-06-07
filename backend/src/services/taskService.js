/**
 * Task management service
 * Implements FR-005 through FR-014, FR-015, FR-017
 */
const taskRepository = require('../repositories/taskRepository');
const notificationRepository = require('../repositories/notificationRepository');
const activityLogService = require('./activityLogService');
const ApiError = require('../utils/ApiError');

const taskService = {
  /**
   * Create a new task (FR-005, FR-011, FR-015)
   */
  async createTask(userId, { title, description, priorityLevel, deadline }) {
    const task = await taskRepository.create({
      userId,
      title,
      description,
      priorityLevel,
      deadline: deadline ? new Date(deadline) : null,
    });

    await activityLogService.log(userId, 'TASK_CREATED', `Created task: ${title}`);
    if (deadline) {
      await notificationRepository.create({
        userId,
        message: `New quest "${title}" has deadline set for ${new Date(deadline).toLocaleString()}.`,
      });
    }

    return formatTask(task);
  },

  /**
   * Get paginated tasks for user (FR-006)
   */
  async getTasks(userId, query) {
    const result = await taskRepository.findByUserId(userId, {
      page: parseInt(query.page, 10) || 1,
      limit: parseInt(query.limit, 10) || 10,
      status: query.status,
      priority: query.priority,
      search: query.search || '',
    });
    result.tasks = result.tasks.map(formatTask);
    return result;
  },

  /**
   * Get single task with ownership check (AU-001)
   */
  async getTaskById(userId, taskId) {
    const task = await taskRepository.findById(taskId);
    if (!task) throw new ApiError(404, 'Task not found');
    if (task.user_id !== userId) throw new ApiError(403, 'Access denied');
    return formatTask(task);
  },

  /**
   * Update task (FR-007, FR-011)
   */
  async updateTask(userId, taskId, data) {
    const existing = await taskRepository.findById(taskId);
    if (!existing) throw new ApiError(404, 'Task not found');
    if (existing.user_id !== userId) throw new ApiError(403, 'Access denied');

    const task = await taskRepository.update(taskId, {
      title: data.title,
      description: data.description,
      priorityLevel: data.priorityLevel,
      deadline: data.deadline ? new Date(data.deadline) : null,
      status: existing.status,
    });

    await activityLogService.log(userId, 'TASK_UPDATED', `Updated task: ${data.title}`);
    return formatTask(task);
  },

  /**
   * Delete task (FR-008)
   */
  async deleteTask(userId, taskId) {
    const existing = await taskRepository.findById(taskId);
    if (!existing) throw new ApiError(404, 'Task not found');
    if (existing.user_id !== userId) throw new ApiError(403, 'Access denied');

    await taskRepository.delete(taskId);
    await activityLogService.log(userId, 'TASK_DELETED', `Deleted task: ${existing.title}`);
    return { message: 'Task deleted successfully' };
  },

  /**
   * Mark task completed (FR-009, FR-018)
   */
  async completeTask(userId, taskId) {
    const existing = await taskRepository.findById(taskId);
    if (!existing) throw new ApiError(404, 'Task not found');
    if (existing.user_id !== userId) throw new ApiError(403, 'Access denied');
    if (existing.status === 'completed') throw new ApiError(400, 'Task is already completed');

    const task = await taskRepository.markCompleted(taskId);
    await activityLogService.log(userId, 'TASK_COMPLETED', `Completed task: ${existing.title}`);
    await notificationRepository.create({
      userId,
      message: `Quest complete! You finished "${existing.title}". +XP earned!`,
    });

    return formatTask(task);
  },

  /**
   * Revert task to pending (FR-010)
   */
  async revertTask(userId, taskId) {
    const existing = await taskRepository.findById(taskId);
    if (!existing) throw new ApiError(404, 'Task not found');
    if (existing.user_id !== userId) throw new ApiError(403, 'Access denied');
    if (existing.status === 'pending') throw new ApiError(400, 'Task is already pending');

    const task = await taskRepository.markPending(taskId);
    await activityLogService.log(userId, 'TASK_REVERTED', `Reverted task to pending: ${existing.title}`);
    return formatTask(task);
  },

  /**
   * Get overdue tasks for user (FR-017)
   */
  async getOverdueTasks(userId) {
    const tasks = await taskRepository.findOverdueByUserId(userId);
    return tasks.map(formatTask);
  },
};

/** Format task with computed overdue flag */
function formatTask(task) {
  const isOverdue =
    task.status === 'pending' &&
    task.deadline &&
    new Date(task.deadline) < new Date();

  return {
    taskId: task.task_id,
    userId: task.user_id,
    title: task.title,
    description: task.description,
    priorityLevel: task.priority_level,
    deadline: task.deadline,
    status: task.status,
    isOverdue,
    createdAt: task.created_at,
    updatedAt: task.updated_at,
  };
}

module.exports = taskService;
