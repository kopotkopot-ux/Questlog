/**
 * Notification routes - FR-016, FR-017
 */
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authenticate = require('../middleware/authenticate');
const userOnly = require('../middleware/userOnly');
const validate = require('../middleware/validate');
const { paginationValidator } = require('../validators/adminValidator');
const { param } = require('express-validator');

router.use(authenticate, userOnly);

router.get('/unread-count', notificationController.getUnreadCount);
router.patch('/read-all', notificationController.markAllAsRead);
router.get('/', paginationValidator, validate, notificationController.getNotifications);
router.patch(
  '/:notificationId/read',
  param('notificationId').isUUID(),
  validate,
  notificationController.markAsRead
);

module.exports = router;
