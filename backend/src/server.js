/**
 * QuestLog API Server entry point
 */
require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/database');
const { startDeadlineNotifier } = require('./jobs/deadlineNotifier');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await testConnection();
    console.log('[Database] Connected to MySQL successfully');

    startDeadlineNotifier();

    app.listen(PORT, () => {
      console.log(`[Server] QuestLog API running on port ${PORT}`);
      console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('[Server] Failed to start:', error.message);
    process.exit(1);
  }
}

startServer();
