# QuestLog Deployment Guide

Deploy QuestLog for free using **Vercel** (frontend), **Render** (backend), and **MySQL** (database).

---

## Prerequisites

- GitHub account
- [Vercel](https://vercel.com) account
- [Render](https://render.com) account
- MySQL 8.0 database (local MySQL Workbench, [PlanetScale free tier](https://planetscale.com), [Railway](https://railway.app), or [Aiven free MySQL](https://aiven.io))

---

## Step 1: Database Setup

### Option A: Local MySQL Workbench 8.0

1. Open MySQL Workbench and connect to your local server.
2. Run the schema script:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
3. Seed demo data:
   ```bash
   cd backend && npm run seed
   ```

### Option B: Cloud MySQL (for production)

1. Create a MySQL 8.0 instance on your cloud provider.
2. Note the connection details: host, port, user, password, database name.
3. Run `database/schema.sql` against the remote database using MySQL Workbench or CLI.
4. Run the seed script with production env vars set.

---

## Step 2: Backend Deployment (Render)

1. Push QuestLog to GitHub.
2. In Render, create a **New Web Service**.
3. Connect your GitHub repository.
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node

5. Set environment variables:

   | Variable | Value |
   |----------|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |
   | `DB_HOST` | Your MySQL host |
   | `DB_PORT` | `3306` |
   | `DB_USER` | Your MySQL user |
   | `DB_PASSWORD` | Your MySQL password |
   | `DB_NAME` | `questlog` |
   | `JWT_SECRET` | Long random string (32+ chars) |
   | `JWT_REFRESH_SECRET` | Different long random string |
   | `JWT_EXPIRES_IN` | `24h` |
   | `JWT_REFRESH_EXPIRES_IN` | `7d` |
   | `FRONTEND_URL` | Your Vercel URL (set after Step 3) |
   | `CORS_ORIGIN` | Your Vercel URL |
   | `RESET_TOKEN_EXPIRES_HOURS` | `1` |

6. Deploy and note your Render URL (e.g. `https://questlog-api.onrender.com`).

---

## Step 3: Frontend Deployment (Vercel)

1. In Vercel, import your GitHub repository.
2. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

3. Set environment variable:

   | Variable | Value |
   |----------|-------|
   | `VITE_API_URL` | `https://questlog-api.onrender.com/api/v1` |

4. Deploy and note your Vercel URL (e.g. `https://questlog.vercel.app`).

5. **Update Render env vars** with your Vercel URL:
   - `FRONTEND_URL=https://questlog.vercel.app`
   - `CORS_ORIGIN=https://questlog.vercel.app`

---

## Step 4: Post-Deployment

1. Run seed on production database (one time):
   ```bash
   cd backend
   # Set production DB_* env vars, then:
   npm run seed
   ```

2. Test login:
   - **Admin:** `admin` / `QuestLog@2026`
   - **User:** `questhero` / `QuestLog@2026`

3. Change default passwords immediately in production.

---

## Environment Files Summary

### backend/.env
Copy from `backend/.env.example` and fill in values.

### frontend/.env
Copy from `frontend/.env.example`:
```
VITE_API_URL=http://localhost:5000/api/v1
```

---

## Local Development

```bash
# Terminal 1 - Database (ensure MySQL is running)
mysql -u root -p < database/schema.sql
cd backend && cp .env.example .env  # edit credentials
npm install && npm run seed && npm run dev

# Terminal 2 - Frontend
cd frontend && cp .env.example .env
npm install && npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Health: http://localhost:5000/api/v1/health

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Verify `CORS_ORIGIN` matches exact frontend URL |
| DB connection failed | Check firewall allows Render IP; verify SSL if required |
| 401 on all routes | Check JWT secrets are set; clear localStorage and re-login |
| Render cold start | Free tier sleeps after inactivity; first request may take 30s |
| Password reset email | Configure SMTP vars or check server logs for dev-mode link |

---

## Security Checklist for Production

- [ ] Change default admin/demo passwords
- [ ] Use strong unique JWT secrets
- [ ] Enable HTTPS (automatic on Vercel/Render)
- [ ] Restrict MySQL to known IP ranges
- [ ] Configure SMTP for password reset emails
- [ ] Review rate limit settings
