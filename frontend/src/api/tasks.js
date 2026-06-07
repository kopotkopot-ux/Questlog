/**
 * Task management API calls - FR-005 through FR-014
 */
import api from './axios';

export const taskApi = {
  getTasks: (params) => api.get('/tasks', { params }),
  getTask: (taskId) => api.get(`/tasks/${taskId}`),
  createTask: (data) => api.post('/tasks', data),
  updateTask: (taskId, data) => api.put(`/tasks/${taskId}`, data),
  deleteTask: (taskId) => api.delete(`/tasks/${taskId}`),
  completeTask: (taskId) => api.patch(`/tasks/${taskId}/complete`),
  revertTask: (taskId) => api.patch(`/tasks/${taskId}/revert`),
  getOverdueTasks: () => api.get('/tasks/overdue'),
};
