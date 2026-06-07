# QuestLog Testing Instructions

## Prerequisites

- MySQL 8.0 running with schema applied
- Backend running on port 5000
- Frontend running on port 5173

Default seed credentials:
- **Admin:** username `admin`, password `QuestLog@2026`
- **User:** username `questhero`, password `QuestLog@2026`

---

## Manual Test Checklist

### Authentication Module (FR-001 – FR-004)

| Test | Steps | Expected |
|------|-------|----------|
| FR-001 Registration | Go to /register, fill valid form | Account created, redirected to dashboard |
| FR-001 Duplicate email | Register with existing email | Error: email already registered |
| FR-002 User login | Login as questhero | Redirected to /dashboard |
| FR-021 Admin login | Login as admin | Redirected to /admin |
| FR-003 Forgot password | Submit email on /forgot-password | Success message; check server log for reset link (dev mode) |
| FR-003 Reset password | Use token link, set new password | Password updated; can login with new password |
| FR-004 Session | Refresh page while logged in | User stays authenticated |
| FR-004 Logout | Click Log Out | Redirected to login; protected routes blocked |

### Task Management (FR-005 – FR-010)

| Test | Steps | Expected |
|------|-------|----------|
| FR-005 Create task | Click New Quest, fill form | Task appears in list |
| FR-006 View tasks | Navigate to /tasks | Paginated task list displayed |
| FR-007 Update task | Edit existing task | Changes saved |
| FR-008 Delete task | Delete a task, confirm | Task removed from list |
| FR-009 Complete task | Click Complete on pending task | Status changes to completed |
| FR-010 Revert task | Click Revert on completed task | Status returns to pending |

### Task Priority (FR-011 – FR-014)

| Test | Steps | Expected |
|------|-------|----------|
| FR-011 Assign priority | Create task with each priority | Priority badge displayed correctly |
| FR-012 Easy | Filter by Easy priority | Only easy tasks shown |
| FR-013 Medium | Filter by Medium priority | Only medium tasks shown |
| FR-014 Hard | Filter by Hard priority | Only hard tasks shown |

### Notifications (FR-015 – FR-017)

| Test | Steps | Expected |
|------|-------|----------|
| FR-015 Store deadline | Create task with deadline | Deadline saved and displayed |
| FR-016 Notifications | Complete a task / wait for cron | Notification appears in /notifications |
| FR-017 Overdue display | Create task with past deadline | Red overdue indicator on task card and dashboard |

### Progress Tracking (FR-018 – FR-020)

| Test | Steps | Expected |
|------|-------|----------|
| FR-018 Track completed | Complete several tasks | Completed count updates |
| FR-019 Calculate % | Check dashboard | Percentage = completed / total × 100 |
| FR-020 Progress bar | View dashboard | Animated progress bar reflects percentage |

### Administrator (FR-021 – FR-025)

| Test | Steps | Expected |
|------|-------|----------|
| FR-022 View users | Admin → User Management | All users listed |
| FR-022 Search users | Search by username/email | Filtered results |
| FR-023 Deactivate | Deactivate a user account | User marked inactive |
| Reactivate | Reactivate deactivated user | User marked active |
| FR-024 Activity logs | Admin → Activity Logs | System actions displayed |
| FR-025 Manage notifications | Admin → Notifications | Can view and delete notifications |
| Admin isolation | Login as admin, try /tasks | Redirected away (403 or redirect) |

### Security Tests

| Test | Steps | Expected |
|------|-------|----------|
| Protected routes | Access /dashboard without login | Redirect to /login |
| RBAC | User tries /admin | Redirect to /dashboard |
| Invalid JWT | Modify token in localStorage | 401, redirect to login |
| Input validation | Submit empty task title | Validation error message |
| Deactivated login | Deactivate user, try login | 403 account deactivated |

### UX Tests

| Test | Steps | Expected |
|------|-------|----------|
| Responsive | Resize to mobile width | Layout adapts, sidebar toggles |
| Dark mode | Toggle theme in settings | UI switches themes |
| 404 page | Visit /nonexistent | Custom 404 page displayed |
| Pagination | Create 10+ tasks | Pagination controls appear |

---

## API Testing with curl

```bash
# Health check
curl http://localhost:5000/api/v1/health

# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"Test@1234","confirmPassword":"Test@1234"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"questhero","password":"QuestLog@2026"}'

# Get tasks (replace TOKEN)
curl http://localhost:5000/api/v1/tasks \
  -H "Authorization: Bearer TOKEN"

# Get progress
curl http://localhost:5000/api/v1/progress \
  -H "Authorization: Bearer TOKEN"
```

---

## Automated Verification

After starting both servers, verify:

1. `GET /api/v1/health` returns 200
2. Login flow completes without console errors
3. CRUD operations on tasks succeed
4. Admin dashboard loads with user count > 0

---

## Performance Verification (PR-001)

- Open browser DevTools → Network tab
- Navigate to dashboard
- Confirm page load completes under 3 seconds on local network
