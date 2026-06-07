/**
 * User profile API
 */
import api from './axios';

export const userApi = {
  updateProfile: (data) => api.put('/users/profile', data),
  getActivityHistory: (params) => api.get('/users/activity', { params }),
};
