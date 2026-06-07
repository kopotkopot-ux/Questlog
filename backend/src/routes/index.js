/**
 * Main API router - aggregates all route modules
 */
const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/tasks', require('./taskRoutes'));
router.use('/notifications', require('./notificationRoutes'));
router.use('/progress', require('./progressRoutes'));
router.use('/users', require('./userRoutes'));
router.use('/admin', require('./adminRoutes'));

/** Health check endpoint for deployment monitoring */
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'QuestLog API is running', timestamp: new Date().toISOString() });
});

module.exports = router;
