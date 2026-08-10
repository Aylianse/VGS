# Vita Glow (Next.js + Neon)

SEO-first official marketing site for Vita Glow Products: catalog, authenticity verification, WhatsApp lead-gen, and admin CMS for products, codes, blog, and testimonials.

## Stack

- Next.js App Router (SSR) + TypeScript
- Tailwind CSS 4
- Prisma + Neon Postgres
- JWT admin auth (httpOnly cookie)
- Web3Forms contact (optional)

## Setup

1. Copy env and fill in your Neon connection string:

```bash
cp .env.example .env
```

2. Install and sync the database:

```bash
npm install
npm run db:push
npm run db:seed
```

3. Run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login) (defaults from `.env`: `ADMIN_EMAIL` / `ADMIN_PASSWORD`).

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run db:push` | Push Prisma schema to Neon |
| `npm run db:seed` | Seed admin, 6 products, blog, testimonials |
| `npm run db:studio` | Prisma Studio |

## Deploy (Hostinger VPS)

Production deploy uses Node + PM2 + nginx + Let's Encrypt on a Hostinger VPS, with Neon Postgres.

**Full runbook:** [deploy/setup-vps.md](deploy/setup-vps.md)

Quick summary:

1. SSH into the VPS, install Node 22, nginx, PM2, Certbot
2. Clone repo to `/var/www/vitaglow`
3. Copy `.env.example` → `.env` and set `DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_SITE_URL`, admin credentials
4. `npm ci && npx prisma db push && npm run db:seed && npm run build`
5. `npm run pm2:start && pm2 save && pm2 startup`
6. Configure nginx ([deploy/nginx-vitaglow.conf](deploy/nginx-vitaglow.conf)) and run Certbot for SSL
7. Future updates: `bash deploy/deploy.sh` on the server

### Auto-deploy (Hostinger GitHub Action — recommended)

Push to `main` deploys via Docker using Hostinger's official action.

Setup: [deploy/hostinger-action.md](deploy/hostinger-action.md)

GitHub **secrets:** `HOSTINGER_API_KEY`, `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`  
GitHub **variables:** `HOSTINGER_VM_ID`, `NEXT_PUBLIC_SITE_URL`

### Auto-deploy (VPS cron — no GitHub secrets)

Alternative if you prefer the VPS to pull from your public repo: [deploy/vps-auto-deploy.md](deploy/vps-auto-deploy.md)

### Docker (alternative)

Use [docker-compose.yml](docker-compose.yml) on the VPS instead of PM2:

```bash
cp .env.example .env   # fill in values
docker compose up -d --build
```

See comments in `docker-compose.yml` for first-time DB setup. nginx is included on port 80; add SSL via Certbot on the host or Hostinger panel.

## Notes

- No cart/checkout in v1 — conversion is WhatsApp / Call / Contact.
- Upload images via admin API to `public/uploads` (or paste image URLs).
- Set `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` for the contact form.
