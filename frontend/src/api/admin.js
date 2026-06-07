/**
 * Administrator API - FR-021 through FR-025
 */
import api from './axios';

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  deactivateUser: (userId) => api.patch(`/admin/users/${userId}/deactivate`),
  reactivateUser: (userId) => api.patch(`/admin/users/${userId}/reactivate`),
  getActivityLogs: (params) => api.get('/admin/activity-logs', { params }),
  getNotifications: (params) => api.get('/admin/notifications', { params }),
  deleteNotification: (id) => api.delete(`/admin/notifications/${id}`),
};
