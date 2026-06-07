/**
 * Task management routes - FR-005 through FR-014
 * Restricted to regular users only (admin cannot manage personal tasks)
 */
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authenticate = require('../middleware/authenticate');
const userOnly = require('../middleware/userOnly');
const validate = require('../middleware/validate');
const {
  createTaskValidator,
  updateTaskValidator,
  taskIdValidator,
  taskQueryValidator,
} = require('../validators/taskValidator');

router.use(authenticate, userOnly);

router.get('/overdue', taskController.getOverdueTasks);
router.get('/', taskQueryValidator, validate, taskController.getTasks);
router.post('/', createTaskValidator, validate, taskController.createTask);
router.get('/:taskId', taskIdValidator, validate, taskController.getTask);
router.put('/:taskId', updateTaskValidator, validate, taskController.updateTask);
router.delete('/:taskId', taskIdValidator, validate, taskController.deleteTask);
router.patch('/:taskId/complete', taskIdValidator, validate, taskController.completeTask);
router.patch('/:taskId/revert', taskIdValidator, validate, taskController.revertTask);

module.exports = router;
