# Hostinger VPS setup — Vita Glow

Deploy the Next.js app on a Hostinger VPS with Node, PM2, nginx, and Let's Encrypt. The database stays on **Neon Postgres** (no Postgres install on the VPS).

## Prerequisites

- Hostinger VPS with SSH access (root or sudo user)
- Domain pointed at the VPS (A record for `@` and optionally `www`)
- Neon Postgres connection string
- GitHub repo access (public repo or deploy key)

## 1. SSH into the VPS

From hPanel → VPS → SSH details, connect:

```bash
ssh root@YOUR_VPS_IP
```

## 2. Install system packages

Ubuntu/Debian:

```bash
apt update && apt upgrade -y
apt install -y curl git nginx certbot python3-certbot-nginx ufw
```

## 3. Install Node.js 22 LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
node -v   # should be v22.x
npm -v
```

Install PM2 globally:

```bash
npm install -g pm2
```

## 4. Firewall

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
ufw status
```

## 5. Clone the app

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/YOUR_USER/VGS.git vitaglow
cd vitaglow
sudo bash deploy/setup-uploads.sh
```

Replace the GitHub URL with your actual repo.

## 6. Environment variables

```bash
cp .env.example .env
nano .env
```

Set at minimum:

| Variable | Example |
|----------|---------|
| `DATABASE_URL` | Neon connection string |
| `JWT_SECRET` | Long random string (`openssl rand -base64 32`) |
| `ADMIN_EMAIL` | Your admin login email |
| `ADMIN_PASSWORD` | Strong password (before seeding) |
| `NEXT_PUBLIC_SITE_URL` | `https://vitaglowproducts.com` |

Optional: `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`, phone/email/WhatsApp overrides.

## 7. Build and seed (first time only)

```bash
npm ci
npx prisma db push
npm run db:seed    # once — creates admin, products, blog, testimonials
npm run build
```

## 8. Start with PM2

```bash
npm run pm2:start
pm2 save
pm2 startup        # run the command it prints to survive reboots
```

Verify the app responds locally:

```bash
curl -I http://127.0.0.1:3000
```

## 9. nginx (HTTP first, for Certbot)

Replace `YOUR_DOMAIN` in the config (e.g. `vitaglowproducts.com`):

```bash
cp deploy/nginx-vitaglow.conf /etc/nginx/sites-available/vitaglow
nano /etc/nginx/sites-available/vitaglow   # set YOUR_DOMAIN
ln -sf /etc/nginx/sites-available/vitaglow /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

Ensure DNS A records for `@` and `www` point to the VPS IP before continuing.

## 10. SSL with Let's Encrypt

```bash
certbot --nginx -d YOUR_DOMAIN -d www.YOUR_DOMAIN
```

Certbot will modify the nginx config and add HTTPS. Follow the prompts (email, agree to terms, redirect HTTP → HTTPS when asked).

Alternatively, after obtaining certs, you can switch to the full production config:

```bash
cp deploy/nginx-vitaglow-ssl.conf /etc/nginx/sites-available/vitaglow
nano /etc/nginx/sites-available/vitaglow   # set YOUR_DOMAIN in all places
nginx -t && systemctl reload nginx
```

Certbot auto-renewal is installed by default. Test with:

```bash
certbot renew --dry-run
```

## 11. Verify production

- Homepage loads over HTTPS
- `/verify` — code verification works
- `/admin/login` — admin login works
- `/contact` — form submits (if Web3Forms key is set)
- Admin image upload saves to `public/uploads`

Change the default admin password after first login if you used seed defaults.

## 12. Future deploys

On the server:

```bash
cd /var/www/vitaglow
bash deploy/deploy.sh
```

This pulls latest code, installs deps, syncs schema, rebuilds, and reloads PM2. It does **not** overwrite `.env` or delete `public/uploads`.

Make the script executable once:

```bash
chmod +x deploy/deploy.sh
```

## 13. Auto-deploy on push to main

**Public repo (no GitHub account secrets):** [vps-auto-deploy.md](vps-auto-deploy.md) — VPS cron pulls from GitHub every few minutes.

**Optional — GitHub Actions (instant deploy):** [github-actions.md](github-actions.md)

## Troubleshooting

| Issue | Check |
|-------|-------|
| 502 Bad Gateway | `pm2 logs vitaglow` — is the app running on port 3000? |
| Admin login fails | `JWT_SECRET` set in `.env`? Restart PM2 after env changes: `pm2 reload vitaglow` |
| DB errors | Neon connection string correct? VPS IP allowed in Neon if using IP restrictions |
| Uploads missing after deploy | Never run `git clean -fdx` on the server — uploads live in `public/uploads` |
| SSL not renewing | `certbot renew --dry-run` |

## Architecture

```
Browser → nginx (443) → PM2 → Next.js (:3000) → Neon Postgres
                              → public/uploads (disk)
```
