/**
 * Administrator routes - FR-021 through FR-025
 * Isolated from user task management
 */
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticate = require('../middleware/authenticate');
const adminOnly = require('../middleware/adminOnly');
const validate = require('../middleware/validate');
const { userIdValidator, paginationValidator, notificationIdValidator } = require('../validators/adminValidator');

router.use(authenticate, adminOnly);

router.get('/dashboard', adminController.getDashboard);
router.get('/users', paginationValidator, validate, adminController.getUsers);
router.patch('/users/:userId/deactivate', userIdValidator, validate, adminController.deactivateUser);
router.patch('/users/:userId/reactivate', userIdValidator, validate, adminController.reactivateUser);
router.get('/activity-logs', paginationValidator, validate, adminController.getActivityLogs);
router.get('/notifications', paginationValidator, validate, adminController.getNotifications);
router.delete('/notifications/:notificationId', notificationIdValidator, validate, adminController.deleteNotification);

module.exports = router;
