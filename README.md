# LORAX HUB

Professional Next.js 15 dashboard for IT tooling, AI chat, short links, QR generation, file metadata, analytics, API status, FiveM status, Telegram account management and admin operations.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Shadcn-style local UI primitives
- Framer Motion
- Lucide Icons
- PostgreSQL
- Prisma ORM
- JWT authentication with HTTP-only cookies
- REST API + OpenAPI JSON at `/api/docs`
- PWA manifest + service worker
- Docker and docker-compose

## Setup

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npm run dev
```

Manual SQL setup:

```bash
psql "$DATABASE_URL" -f database/lorax-hub.sql
```

Or paste [database/lorax-hub.sql](database/lorax-hub.sql) into Supabase SQL Editor.

Local PostgreSQL with Docker:

```bash
docker compose up -d postgres
```

Default admin credentials are configured with env vars:

```text
ADMIN_USERNAME=admin
ADMIN_PASSWORD=123456Dinh
```

## Production Notes

- Set `DATABASE_URL` to a PostgreSQL database before deploying.
- Set a strong `JWT_SECRET`.
- Wire `CUSTOM_AI_API_URL` and `CUSTOM_AI_API_KEY` for real AI streaming.
- File upload API currently stores metadata; connect S3, Cloudflare R2, Vercel Blob or Supabase Storage for binary files.
- Telegram session management is scaffolded as metadata; never expose raw sessions from public frontend routes.
- Replace frontend/mock dashboard data with database queries as each module goes live.

## API Routes

- `POST /api/auth/login`
- `POST /api/ai/chat`
- `GET/POST /api/links`
- `POST /api/qr`
- `GET/POST /api/files`
- `GET/POST /api/visitors`
- `GET /api/status`
- `GET /api/fivem/status`
- `GET /api/telegram/accounts`
- `GET /api/docs`

## Branding

- Primary: `#00E5FF`
- Secondary: `#7B61FF`
- Background: `#0A0A0A`
- Footer: `© 2026 LORAX HUB` / `Powered by LORAX`
