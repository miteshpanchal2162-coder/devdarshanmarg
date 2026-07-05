# DevDarshanMarg

India's most comprehensive **Temple, Pilgrimage, and Spiritual Knowledge** platform.

**Languages:** Gujarati (gu) · Hindi (hi) · English (en)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS, ShadCN UI |
| Backend | NestJS 11, TypeScript, Prisma |
| Database | PostgreSQL |
| Auth | JWT (access + refresh tokens), OTP |
| Storage | Local filesystem (S3-ready abstraction) |

---

## Project Structure

```
DevDarshanMarg/
├── backend/                 # NestJS API
│   ├── prisma/              # Schema, migrations, seed
│   ├── src/
│   │   ├── common/          # Shared guards, interceptors, storage, utils
│   │   ├── config/          # Env validation, Helmet, Swagger
│   │   ├── database/        # Prisma module
│   │   └── modules/         # Feature modules (temples, auth, public, …)
│   ├── test/                # Centralized unit + e2e tests
│   └── uploads/             # Default local upload directory
├── frontend/                # Single Next.js app (public + admin + auth)
│   └── src/
│       ├── app/
│       │   ├── (public)/    # User website
│       │   ├── admin/       # Admin panel
│       │   └── (auth)/      # Login / OTP / reset
│       ├── components/      # admin/, common/, ui/
│       ├── hooks/           # queries/, mutations/
│       ├── services/        # API layer (axios + React Query)
│       ├── providers/
│       └── stores/
├── docs/                    # Database ER and docs
└── docker-compose.yml       # PostgreSQL for local development
```

---

## Backend Setup

### Prerequisites

- Node.js 20+
- npm
- PostgreSQL 16+ (or Docker)

### 1. Start PostgreSQL

```bash
docker compose up -d
```

Default credentials (see `docker-compose.yml`):

| Setting | Value |
|---------|-------|
| User | `devdarshan` |
| Password | `devdarshan123` |
| Database | `devdarshanmarg` |
| Port | `5432` |

### 2. Install

```bash
cd backend
cp .env.example .env
npm install
```

Set `DATABASE_URL` in `.env`:

```
DATABASE_URL=postgresql://devdarshan:devdarshan123@localhost:5432/devdarshanmarg?schema=public
```

### 3. Prisma

```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to database (dev)
# npm run db:migrate  # Use migrations in production workflows
npm run db:studio     # Optional: Prisma Studio GUI
```

### 4. Seed

```bash
npm run db:seed
```

Creates sample data and a default admin user (see `backend/prisma/seed.ts`).

### 5. Run (development)

```bash
npm run dev
```

API: **http://localhost:4000**  
Health: **http://localhost:4000/health**  
Swagger (when enabled): **http://localhost:4000/docs**

---

## Run (production)

```bash
cd backend
npm run build
NODE_ENV=production npm run start:prod
```

Production requirements (validated at startup):

- `DATABASE_URL`
- `JWT_ACCESS_SECRET` (≥ 32 chars)
- `JWT_REFRESH_SECRET` (≥ 32 chars)
- `CORS_ORIGIN`
- `UPLOAD_DIR` or `UPLOAD_PATH`

The server handles graceful shutdown on `SIGINT` / `SIGTERM`.

---

## Upload directory

Uploaded files are stored on the local filesystem.

| Variable | Description |
|----------|-------------|
| `UPLOAD_DIR` | Primary upload root (default: `./uploads`) |
| `UPLOAD_PATH` | Alias for `UPLOAD_DIR` |

- The directory is created automatically if missing.
- Static files are served at `/uploads/`.
- Organized subfolders: `temples`, `festivals`, `deities`, `contents`, `panchang`, `users`, `temp`.
- Max upload size: 20 MB (enforced in code).

In production, set an absolute path, e.g. `/var/www/devdarshanmarg/uploads`.

---

## Environment variables

See [`backend/.env.example`](backend/.env.example) for the full list.

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | No | `development`, `production`, or `test` |
| `PORT` | No | HTTP port (default `4000`) |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | Yes | Access token secret (≥ 32 chars) |
| `JWT_REFRESH_SECRET` | Yes | Refresh token secret (≥ 32 chars) |
| `JWT_ACCESS_EXPIRES_IN` | No | Default `15m` |
| `JWT_REFRESH_EXPIRES_IN` | No | Default `7d` |
| `CORS_ORIGIN` | Prod | Comma-separated allowed origins |
| `UPLOAD_DIR` / `UPLOAD_PATH` | Prod | Upload storage root |
| `OTP_EXPIRES_IN` | No | OTP validity (default `5m`) |
| `OTP_MAX_RETRIES` | No | Max OTP attempts (default `5`) |
| `SWAGGER_ENABLED` | No | Set `true` to expose `/docs` |
| `LOG_LEVEL` | No | Pino log level (default `info`) |

---

## Testing

All active tests live under `backend/test/`. Obsolete generated specs under `src/modules/` have been removed.

### Unit tests

```bash
cd backend
npm test
```

### Coverage

```bash
npm run test:cov
```

Coverage thresholds target 80%+ branches; reports are written to `backend/coverage/`.

### E2E tests

E2E tests require a running PostgreSQL instance and `.env` (or `.env.test`).

```bash
cd backend
npm run test:e2e
```

E2E specs: `backend/test/e2e/*.e2e-spec.ts` (auth, CRUD, OTP, media, security, public API, user API, activity logs).

---

## Deployment notes

1. Set `NODE_ENV=production` and all required env vars.
2. Run `npm run db:generate && npm run build`.
3. Apply database migrations (`npm run db:migrate`) or use your CI/CD migration step.
4. Ensure the upload directory exists and is writable.
5. Put the API behind a reverse proxy (nginx, etc.) with TLS.
6. Set `CORS_ORIGIN` to your frontend/admin origins.
7. Disable Swagger in production unless needed (`SWAGGER_ENABLED=false`).
8. Verify health after deploy: `GET /health`.

---

## Frontend Setup

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

App: **http://localhost:3000**

- Public site: `/`
- Admin panel: `/admin/dashboard`
- Auth: `/login`, `/forgot-password`, `/otp-verification`, `/reset-password`

Set `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000` in `.env.local`.

### Admin login (after seed)

- Admin URL: http://localhost:3000/admin/dashboard
- Auth URL: http://localhost:3000/login
- Email: `admin@devdarshanmarg.com`
- Password: `admin123`

---

## Database

See [docs/DATABASE_ER.md](docs/DATABASE_ER.md) for the ER diagram and relationships.

---

## License

Private — DevDarshanMarg Platform
