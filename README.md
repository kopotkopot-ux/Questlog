# QuestLog – Gamified Task Management Web Application

> Turn everyday tasks into achievable quests.

QuestLog is a full-stack gamified task management system built per the [Software Requirements Specification (SRS)](https://github.com) by Xian Tristan Teaño. It implements all functional requirements **FR-001 through FR-025** with a modern React frontend, Express REST API, and MySQL database.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![MySQL](https://img.shields.io/badge/MySQL-8.0-orange) ![JWT](https://img.shields.io/badge/Auth-JWT-purple)

---

## Features

### Authentication (FR-001 – FR-004)
- User registration and login
- Secure password reset via email token
- JWT session management with refresh tokens

### Task Management (FR-005 – FR-010)
- Full CRUD operations on tasks
- Mark tasks completed / revert to pending
- Priority levels: Easy, Medium, Hard
- Deadline storage and overdue detection

### Notifications (FR-015 – FR-017)
- Automated deadline reminders (hourly cron job)
- Overdue task alerts
- Read/unread notification tracking

### Progress Tracking (FR-018 – FR-020)
- Completion statistics
- Progress percentage calculation
- Animated gamified progress bars

### Administrator Panel (FR-021 – FR-025)
- Separate admin dashboard (isolated from user tasks)
- User management with search, deactivate/reactivate
- System activity logs
- Notification management

### UX
- Gamified modern UI with quest theme
- Light and dark mode
- Fully responsive (desktop, tablet, mobile)
- Priority badges and notification indicators

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express.js, MVC Architecture |
| Database | MySQL Workbench 8.0 |
| Auth | JWT, bcrypt (12 salt rounds) |
| Deployment | Vercel (frontend), Render (backend) |

---

## Project Structure

```
QuestLog/
├── backend/                 # Express REST API
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Request handlers (MVC)
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── repositories/    # Database access layer
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API route definitions
│   │   ├── validators/      # Input validation rules
│   │   ├── utils/           # JWT, password, sanitization
│   │   └── jobs/            # Deadline notification cron
│   └── package.json
├── frontend/                # React SPA
│   ├── src/
│   │   ├── api/             # Axios API clients
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Auth & theme state
│   │   └── pages/           # Route pages
│   └── package.json
├── database/
│   ├── schema.sql           # Complete MySQL schema
│   ├── migrations/          # Migration scripts
│   └── seeds/               # Seed data SQL
└── docs/
    ├── API.md               # REST API documentation
    ├── DEPLOYMENT.md        # Deployment guide
    └── TESTING.md           # Testing instructions
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- MySQL 8.0 (MySQL Workbench)
- npm

### 1. Clone and setup database

```bash
cd Projects/QuestLog

# Create database and tables
mysql -u root -p < database/schema.sql
```

### 2. Start backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials and JWT secrets

npm install
npm run seed        # Creates admin + demo user
npm run dev         # Starts on http://localhost:5000
```

### 3. Start frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev         # Starts on http://localhost:5173
```

### 4. Login

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `QuestLog@2026` |
| User | `questhero` | `QuestLog@2026` |

---

## API Endpoints

Base URL: `http://localhost:5000/api/v1`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register user | Public |
| POST | `/auth/login` | Login | Public |
| POST | `/auth/forgot-password` | Request reset | Public |
| POST | `/auth/reset-password` | Reset password | Public |
| GET | `/tasks` | List tasks | User |
| POST | `/tasks` | Create task | User |
| GET | `/progress` | Progress stats | User |
| GET | `/notifications` | Notifications | User |
| GET | `/admin/users` | List users | Admin |
| GET | `/admin/activity-logs` | Activity logs | Admin |

Full documentation: [docs/API.md](docs/API.md)

---

## Security

- bcrypt password hashing (12 salt rounds)
- JWT with issuer/audience verification
- Role-Based Access Control (RBAC)
- Parameterized SQL queries (SQL injection protection)
- XSS input sanitization
- Helmet security headers
- Rate limiting
- Admin/user route isolation

---

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for step-by-step instructions to deploy on:
- **Frontend:** Vercel (free)
- **Backend:** Render (free)
- **Database:** MySQL 8.0 (local or cloud)

---

## Testing

See [docs/TESTING.md](docs/TESTING.md) for the complete manual test checklist covering FR-001 through FR-025.

---

## SRS Reference

This application implements the QuestLog Software Requirements Specification (IEEE 830-1998) including:
- All 25 functional requirements
- Performance requirements (PR-001 – PR-003)
- Security requirements (SR-001 – SR-003, AR-001 – AR-004, AU-001 – AU-004)
- Usability requirements (UR-001 – UR-004)

Original SRS: `QuestLog_SRS_Final_Project.pdf` by Xian Tristan Teaño

---

## License

Academic/Educational project — QuestLog © 2026
