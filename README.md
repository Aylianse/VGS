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

## Notes

- No cart/checkout in v1 — conversion is WhatsApp / Call / Contact.
- Upload images via admin API to `public/uploads` (or paste image URLs).
- Set `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` for the contact form.
