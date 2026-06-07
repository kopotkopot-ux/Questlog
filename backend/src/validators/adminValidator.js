/**
 * Admin request validators (FR-022 through FR-025)
 */
const { param, query } = require('express-validator');

const userIdValidator = [
  param('userId').isUUID().withMessage('Invalid user ID'),
];

const paginationValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  query('search').optional().trim().isLength({ max: 100 }),
];

const notificationIdValidator = [
  param('notificationId').isUUID().withMessage('Invalid notification ID'),
];

module.exports = {
  userIdValidator,
  paginationValidator,
  notificationIdValidator,
};
