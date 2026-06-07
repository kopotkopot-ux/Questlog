/**
 * Task management controller
 */
const taskService = require('../services/taskService');
const asyncHandler = require('../utils/asyncHandler');

exports.createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.user.user_id, req.body);
  res.status(201).json({ success: true, data: task });
});

exports.getTasks = asyncHandler(async (req, res) => {
  const result = await taskService.getTasks(req.user.user_id, req.query);
  res.json({ success: true, data: result });
});

exports.getTask = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.user.user_id, req.params.taskId);
  res.json({ success: true, data: task });
});

exports.updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.user.user_id, req.params.taskId, req.body);
  res.json({ success: true, data: task });
});

exports.deleteTask = asyncHandler(async (req, res) => {
  const result = await taskService.deleteTask(req.user.user_id, req.params.taskId);
  res.json({ success: true, data: result });
});

exports.completeTask = asyncHandler(async (req, res) => {
  const task = await taskService.completeTask(req.user.user_id, req.params.taskId);
  res.json({ success: true, data: task });
});

exports.revertTask = asyncHandler(async (req, res) => {
  const task = await taskService.revertTask(req.user.user_id, req.params.taskId);
  res.json({ success: true, data: task });
});

exports.getOverdueTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.getOverdueTasks(req.user.user_id);
  res.json({ success: true, data: tasks });
});
