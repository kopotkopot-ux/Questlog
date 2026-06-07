/**
 * Database seed script - creates admin and demo user with sample data
 * Run: npm run seed (from backend directory)
 */
require('dotenv').config();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { pool, testConnection } = require('../config/database');

const SALT_ROUNDS = 12;
const DEFAULT_PASSWORD = 'QuestLog@2026';

async function seed() {
  await testConnection();
  console.log('[Seed] Connected to database');

  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

  const adminId = 'a0000000-0000-4000-8000-000000000001';
  const userId = 'u0000000-0000-4000-8000-000000000001';

  await pool.execute(
    `INSERT INTO users (user_id, username, email, password_hash, role, is_active)
     VALUES (?, 'admin', 'admin@questlog.app', ?, 'admin', 1)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
    [adminId, passwordHash]
  );
  console.log('[Seed] Admin user: admin / QuestLog@2026');

  await pool.execute(
    `INSERT INTO users (user_id, username, email, password_hash, role, is_active)
     VALUES (?, 'questhero', 'hero@questlog.app', ?, 'user', 1)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
    [userId, passwordHash]
  );
  console.log('[Seed] Demo user: questhero / QuestLog@2026');

  const tasks = [
    [uuidv4(), userId, 'Complete QuestLog onboarding', 'Review dashboard and create first quest', 'easy', 3],
    [uuidv4(), userId, 'Build epic side project', 'Work on personal coding project for 2 hours', 'hard', 7],
    [uuidv4(), userId, 'Daily exercise quest', '30 minutes of physical activity', 'medium', 1],
  ];

  for (const [taskId, uid, title, desc, priority, days] of tasks) {
    await pool.execute(
      `INSERT IGNORE INTO tasks (task_id, user_id, title, description, priority_level, deadline, status)
       VALUES (?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL ? DAY), ?)`,
      [taskId, uid, title, desc, priority, days, title.includes('exercise') ? 'completed' : 'pending']
    );
  }
  console.log('[Seed] Sample tasks created');

  await pool.execute(
    `INSERT IGNORE INTO notifications (notification_id, user_id, message, notification_status)
     VALUES (?, ?, 'Welcome to QuestLog! Start your first quest today.', 'unread')`,
    [uuidv4(), userId]
  );

  await pool.execute(
    `INSERT IGNORE INTO activity_logs (log_id, user_id, action, details)
     VALUES (?, ?, 'USER_REGISTERED', 'Demo user account seeded')`,
    [uuidv4(), userId]
  );

  console.log('[Seed] Complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('[Seed] Failed:', err.message);
  process.exit(1);
});
