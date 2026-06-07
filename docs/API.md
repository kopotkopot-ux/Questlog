# QuestLog API Documentation

Base URL: `http://localhost:5000/api/v1` (development)

All protected routes require header: `Authorization: Bearer <accessToken>`

---

## Authentication

### POST /auth/register
Register a new user account (FR-001).

**Body:**
```json
{
  "username": "questhero",
  "email": "hero@example.com",
  "password": "QuestLog@2026",
  "confirmPassword": "QuestLog@2026"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "user": { "user_id": "...", "username": "...", "email": "...", "role": "user" },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### POST /auth/login
User or admin login (FR-002, FR-021).

**Body:**
```json
{ "identifier": "questhero", "password": "QuestLog@2026" }
```

### POST /auth/refresh
Refresh access token (FR-004).

**Body:** `{ "refreshToken": "..." }`

### POST /auth/forgot-password
Request password reset email (FR-003).

**Body:** `{ "email": "hero@example.com" }`

### POST /auth/reset-password
Complete password reset (FR-003).

**Body:**
```json
{ "token": "...", "password": "NewPass@2026", "confirmPassword": "NewPass@2026" }
```

### GET /auth/me
Get current user profile. Requires auth.

### POST /auth/logout
End session. Requires auth.

---

## Tasks (User only)

All task routes require `role: user`. Admins are blocked.

### GET /tasks
List tasks with pagination and filters (FR-006).

**Query:** `page`, `limit`, `status`, `priority`, `search`

### POST /tasks
Create task (FR-005, FR-011, FR-015).

**Body:**
```json
{
  "title": "My Quest",
  "description": "Optional description",
  "priorityLevel": "medium",
  "deadline": "2026-06-15T12:00:00.000Z"
}
```

### GET /tasks/:taskId
Get single task.

### PUT /tasks/:taskId
Update task (FR-007).

### DELETE /tasks/:taskId
Delete task (FR-008).

### PATCH /tasks/:taskId/complete
Mark completed (FR-009).

### PATCH /tasks/:taskId/revert
Revert to pending (FR-010).

### GET /tasks/overdue
Get overdue tasks (FR-017).

---

## Notifications (User only)

### GET /notifications
List notifications with pagination.

### GET /notifications/unread-count
Get unread count for badge.

### PATCH /notifications/:notificationId/read
Mark as read.

### PATCH /notifications/read-all
Mark all as read.

---

## Progress (User only)

### GET /progress
Get progress stats (FR-018, FR-019, FR-020).

**Response:**
```json
{
  "success": true,
  "data": {
    "totalTasks": 10,
    "completedTasks": 6,
    "pendingTasks": 4,
    "overdueTasks": 1,
    "progressPercentage": 60
  }
}
```

---

## User Profile

### PUT /users/profile
Update username and email.

### GET /users/activity
Get own activity history.

---

## Admin (Admin only)

All admin routes require `role: admin`.

### GET /admin/dashboard
System statistics.

### GET /admin/users
List users with search (FR-022).

**Query:** `page`, `limit`, `search`

### PATCH /admin/users/:userId/deactivate
Deactivate user (FR-023).

### PATCH /admin/users/:userId/reactivate
Reactivate user.

### GET /admin/activity-logs
View activity logs (FR-024).

### GET /admin/notifications
View all notifications (FR-025).

### DELETE /admin/notifications/:notificationId
Delete notification (FR-025).

---

## Health Check

### GET /health
Returns API status.

---

## Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": [{ "msg": "...", "param": "..." }]
}
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Validation error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not found |
| 409 | Conflict |
| 429 | Rate limited |
| 500 | Server error |
