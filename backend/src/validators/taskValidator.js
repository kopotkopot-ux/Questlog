/**
 * Task request validators (FR-005 through FR-014)
 */
const { body, param, query } = require('express-validator');

const createTaskValidator = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must be under 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Description must be under 5000 characters'),
  body('priorityLevel')
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Priority must be easy, medium, or hard'),
  body('deadline')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Deadline must be a valid ISO 8601 date'),
];

const updateTaskValidator = [
  param('taskId').isUUID().withMessage('Invalid task ID'),
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must be under 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Description must be under 5000 characters'),
  body('priorityLevel')
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Priority must be easy, medium, or hard'),
  body('deadline')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Deadline must be a valid ISO 8601 date'),
];

const taskIdValidator = [
  param('taskId').isUUID().withMessage('Invalid task ID'),
];

const taskQueryValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  query('status')
  .optional({ checkFalsy: true })
  .isIn(['pending', 'completed'])
  .withMessage('Invalid status filter'),

  query('priority')
  .optional({ checkFalsy: true })
  .isIn(['easy', 'medium', 'hard'])
  .withMessage('Invalid priority filter'),
  query('search').optional().trim().isLength({ max: 100 }),
];

module.exports = {
  createTaskValidator,
  updateTaskValidator,
  taskIdValidator,
  taskQueryValidator,
};
