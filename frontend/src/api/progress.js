/**
 * Progress tracking API - FR-018 through FR-020
 */
import api from './axios';

export const progressApi = {
  getProgress: () => api.get('/progress'),
};
