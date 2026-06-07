-- QuestLog Database Schema
-- MySQL Workbench 8.0 compatible
-- Run this script to create the complete database structure

CREATE DATABASE IF NOT EXISTS questlog
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE questlog;

-- ============================================================
-- USERS TABLE
-- Stores registered users and administrators
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  user_id       CHAR(36)     NOT NULL,
  username      VARCHAR(50)  NOT NULL,
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  UNIQUE KEY uq_users_username (username),
  UNIQUE KEY uq_users_email (email),
  INDEX idx_users_role (role),
  INDEX idx_users_is_active (is_active),
  INDEX idx_users_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TASKS TABLE
-- Stores user tasks with priority and deadline tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS tasks (
  task_id        CHAR(36)     NOT NULL,
  user_id        CHAR(36)     NOT NULL,
  title          VARCHAR(200) NOT NULL,
  description    TEXT         NULL,
  priority_level ENUM('easy', 'medium', 'hard') NOT NULL DEFAULT 'medium',
  deadline       DATETIME     NULL,
  status         ENUM('pending', 'completed') NOT NULL DEFAULT 'pending',
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (task_id),
  INDEX idx_tasks_user_id (user_id),
  INDEX idx_tasks_status (status),
  INDEX idx_tasks_priority (priority_level),
  INDEX idx_tasks_deadline (deadline),
  INDEX idx_tasks_user_status (user_id, status),
  CONSTRAINT fk_tasks_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- NOTIFICATIONS TABLE
-- Stores user notifications for deadlines and system events
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  notification_id     CHAR(36)     NOT NULL,
  user_id             CHAR(36)     NOT NULL,
  message             TEXT         NOT NULL,
  notification_status ENUM('read', 'unread') NOT NULL DEFAULT 'unread',
  notification_date   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (notification_id),
  INDEX idx_notifications_user_id (user_id),
  INDEX idx_notifications_status (notification_status),
  INDEX idx_notifications_date (notification_date),
  INDEX idx_notifications_user_status (user_id, notification_status),
  CONSTRAINT fk_notifications_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- ACTIVITY LOGS TABLE
-- Stores audit trail of user and system actions
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_logs (
  log_id    CHAR(36)     NOT NULL,
  user_id   CHAR(36)     NOT NULL,
  action    VARCHAR(100) NOT NULL,
  details   TEXT         NULL,
  log_date  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (log_id),
  INDEX idx_activity_logs_user_id (user_id),
  INDEX idx_activity_logs_action (action),
  INDEX idx_activity_logs_date (log_date),
  CONSTRAINT fk_activity_logs_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PASSWORD RESET TOKENS TABLE
-- Secure password reset flow (FR-003)
-- ============================================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  token_id    CHAR(36)     NOT NULL,
  user_id     CHAR(36)     NOT NULL,
  token_hash  VARCHAR(255) NOT NULL,
  expires_at  DATETIME     NOT NULL,
  used        TINYINT(1)   NOT NULL DEFAULT 0,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (token_id),
  INDEX idx_reset_tokens_user_id (user_id),
  INDEX idx_reset_tokens_expires (expires_at),
  CONSTRAINT fk_reset_tokens_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
