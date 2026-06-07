-- QuestLog Seed Data
-- Default admin and demo user accounts
-- Password for both: QuestLog@2026 (bcrypt hash generated with 12 rounds)

USE questlog;

-- Admin account: admin / QuestLog@2026
INSERT INTO users (user_id, username, email, password_hash, role, is_active)
VALUES (
  'a0000000-0000-4000-8000-000000000001',
  'admin',
  'admin@questlog.app',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G2oX3qKJ5xK5Xe',
  'admin',
  1
) ON DUPLICATE KEY UPDATE username = username;

-- Demo user: questhero / QuestLog@2026
INSERT INTO users (user_id, username, email, password_hash, role, is_active)
VALUES (
  'u0000000-0000-4000-8000-000000000001',
  'questhero',
  'hero@questlog.app',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G2oX3qKJ5xK5Xe',
  'user',
  1
) ON DUPLICATE KEY UPDATE username = username;

-- Sample tasks for demo user
INSERT INTO tasks (task_id, user_id, title, description, priority_level, deadline, status)
VALUES
  ('t0000000-0000-4000-8000-000000000001', 'u0000000-0000-4000-8000-000000000001',
   'Complete QuestLog onboarding', 'Review dashboard and create first quest', 'easy',
   DATE_ADD(NOW(), INTERVAL 3 DAY), 'pending'),
  ('t0000000-0000-4000-8000-000000000002', 'u0000000-0000-4000-8000-000000000001',
   'Build epic side project', 'Work on personal coding project for 2 hours', 'hard',
   DATE_ADD(NOW(), INTERVAL 7 DAY), 'pending'),
  ('t0000000-0000-4000-8000-000000000003', 'u0000000-0000-4000-8000-000000000001',
   'Daily exercise quest', '30 minutes of physical activity', 'medium',
   DATE_ADD(NOW(), INTERVAL 1 DAY), 'completed')
ON DUPLICATE KEY UPDATE title = title;

-- Sample notifications
INSERT INTO notifications (notification_id, user_id, message, notification_status)
VALUES
  ('n0000000-0000-4000-8000-000000000001', 'u0000000-0000-4000-8000-000000000001',
   'Welcome to QuestLog! Start your first quest today.', 'unread'),
  ('n0000000-0000-4000-8000-000000000002', 'u0000000-0000-4000-8000-000000000001',
   'Great job completing Daily exercise quest!', 'read')
ON DUPLICATE KEY UPDATE message = message;

-- Sample activity logs
INSERT INTO activity_logs (log_id, user_id, action, details)
VALUES
  ('l0000000-0000-4000-8000-000000000001', 'u0000000-0000-4000-8000-000000000001',
   'USER_LOGIN', 'Demo user logged in'),
  ('l0000000-0000-4000-8000-000000000002', 'u0000000-0000-4000-8000-000000000001',
   'TASK_COMPLETED', 'Completed task: Daily exercise quest')
ON DUPLICATE KEY UPDATE action = action;
