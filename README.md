# DevDarshanMarg

India's most comprehensive **Temple, Pilgrimage, and Spiritual Knowledge** platform.

**Languages:** Gujarati (gu) · Hindi (hi) · English (en)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS, ShadCN UI |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT |
| Storage | Local (S3-ready) |

---

## Project Structure

```
DevDarshanMarg/
├── backend/                    # Express API
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema (29 tables)
│   │   └── seed.ts             # Sample data + admin user
│   ├── src/
│   │   ├── config/             # Environment config
│   │   ├── lib/                # Prisma client
│   │   ├── middleware/         # Auth, error handling
│   │   ├── modules/            # Feature modules
│   │   │   ├── auth/
│   │   │   ├── temples/
│   │   │   ├── reference/      # Deities, categories, locations
│   │   │   ├── media/
│   │   │   ├── content/
│   │   │   ├── seo/
│   │   │   ├── users/
│   │   │   ├── activity/
│   │   │   └── dashboard/
│   │   ├── routes/             # Route aggregator
│   │   ├── services/           # Shared services
│   │   └── utils/              # Helpers
│   └── uploads/                # Local file storage
├── frontend/                   # Next.js app
│   └── src/
│       ├── app/
│       │   ├── page.tsx        # Public landing
│       │   └── admin/          # Admin panel (14 modules)
│       ├── components/
│       │   ├── admin/          # Admin-specific components
│       │   └── ui/             # ShadCN UI components
│       ├── lib/                # API client, constants
│       └── types/              # TypeScript types
├── docs/
│   └── DATABASE_ER.md          # ER diagram & relationships
└── docker-compose.yml          # PostgreSQL for local dev
```

---

## Quick Start

### 1. Start PostgreSQL

```bash
docker compose up -d
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

API runs at **http://localhost:4000**

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

App runs at **http://localhost:3000**

### 4. Admin Login

- URL: http://localhost:3000/admin/login
- Email: `admin@devdarshanmarg.com`
- Password: `admin123`

---

## Admin Panel Modules

| Module | Path | Description |
|--------|------|-------------|
| Dashboard | `/admin` | Stats & recent activity |
| Temples | `/admin/temples` | Temple CRUD with search |
| Deities | `/admin/deities` | Deity type management |
| Categories | `/admin/categories` | Temple categories |
| Countries | `/admin/countries` | Country list |
| States | `/admin/states` | State list |
| Cities | `/admin/cities` | City list |
| Festivals | `/admin/festivals` | Festival management |
| Media Library | `/admin/media` | Image upload & gallery |
| Content Center | `/admin/content` | Articles & guides |
| SEO | `/admin/seo` | Redirects & landing pages |
| Users | `/admin/users` | User management |
| Activity Logs | `/admin/activity-logs` | Audit trail |
| Settings | `/admin/settings` | Platform config |

---

## Database

See [docs/DATABASE_ER.md](docs/DATABASE_ER.md) for full ER diagram and relationship explanations.

**29 tables** including:
- Location hierarchy (Country → State → City → Temple)
- Multilingual translations (Temple, Festival, Content)
- Temple details (timings, aartis, rules, facilities, FAQs)
- Media library with S3-ready storage abstraction
- SEO (redirects, landing pages)
- Users & activity logs

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| GET | `/api/dashboard/stats` | Dashboard stats |
| GET | `/api/temples` | List temples |
| GET | `/api/deities` | List deities |
| GET | `/api/categories` | List categories |
| GET | `/api/countries` | List countries |
| GET | `/api/states` | List states |
| GET | `/api/cities` | List cities |
| GET | `/api/festivals` | List festivals |
| GET | `/api/media` | List media |
| POST | `/api/media/upload` | Upload image |
| GET | `/api/content` | List content |
| GET | `/api/seo/redirects` | List redirects |
| GET | `/api/seo/landing-pages` | List landing pages |
| GET | `/api/users` | List users |
| GET | `/api/activity-logs` | Activity logs |

All endpoints except `/auth/login` require `Authorization: Bearer <token>` header.

---

## Theme

- **Primary:** Saffron `#FF7A00`
- **Secondary:** White
- **Accent:** Gold
- **Dark mode:** Ready via next-themes

---

## License

Private — DevDarshanMarg Platform
