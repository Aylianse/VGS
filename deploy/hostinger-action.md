# Deploy with Hostinger GitHub Action

Uses [hostinger/deploy-on-vps@v2](https://github.com/hostinger/deploy-on-vps) — deploys `docker-compose.yml` to your VPS on every push to `main`.

**Requirements on VPS:** Docker template installed (Hostinger Docker Manager).

## GitHub setup

**Settings → Secrets and variables → Actions**

### Secrets

| Name | Value |
|------|--------|
| `HOSTINGER_API_KEY` | From hPanel → API |
| `DATABASE_URL` | Neon Postgres connection string |
| `JWT_SECRET` | Random string for admin auth |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin password (for seed if needed) |

### Variables

| Name | Example |
|------|---------|
| `HOSTINGER_VM_ID` | VPS ID from hPanel URL (e.g. `123456`) |
| `NEXT_PUBLIC_SITE_URL` | `https://vitaglowproducts.com` |

## Get your VM ID

In Hostinger hPanel, open your VPS — the ID is in the overview URL or hostname.

## Private repo

Add an SSH deploy key in Hostinger Docker Manager. See [Hostinger docs](https://www.hostinger.com/support/how-to-deploy-from-private-github-repository-on-hostinger-docker-manager/).

## Manual deploy

GitHub → **Actions → Deploy to Hostinger VPS → Run workflow**

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Can't reach database server` (Neon) | See [Neon connection issues](#neon-connection-issues) below |
| SSH connection failed | Check `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, firewall port 22 |
| Build fails | SSH in manually, run `bash deploy/deploy.sh`, read the error |
| App not updating | Check Hostinger Docker logs for the `vitaglow` container |

### Neon connection issues

If logs show `Can't reach database server at ep-....neon.tech:5432`:

**1. Set `DATABASE_URL` in GitHub Secrets**

Hostinger Docker gets env vars from GitHub — not from `.env` on your laptop.

GitHub → **Settings → Secrets → `DATABASE_URL`**

Copy the **Pooled connection** string from [Neon Console](https://console.neon.tech) → your project → **Connect**.

Use this format:

```
postgresql://USER:PASSWORD@ep-xxxx-pooler.region.aws.neon.tech/neondb?sslmode=require&connect_timeout=15
```

**Do not include** `channel_binding=require` — it breaks Node/Docker on many VPS hosts.

If the pooler still fails, try Neon's **Direct connection** string (hostname without `-pooler`) instead.

**2. Wake up Neon (free tier)**

Open the Neon console — suspended databases wake on first connection. Click your project, then retry the site.

**3. IP allowlist**

Neon → **Settings → IP Allow** — either disable restrictions or add your Hostinger VPS public IP.

**4. Redeploy after changing secrets**

GitHub → **Actions → Deploy to Hostinger VPS → Run workflow**

**5. Test from the VPS (SSH)**

```bash
docker exec -it vitaglow printenv DATABASE_URL
# Should print your connection string (not empty)

docker exec -it vitaglow node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.\$queryRaw\`SELECT 1\`.then(() => console.log('OK')).catch(e => console.error(e.message)).finally(() => p.\$disconnect());
"
```

If `DATABASE_URL` is empty, the GitHub secret is missing or the deploy did not inject it.

## Dynamic images folder

On the VPS, create the persistent uploads folder **once** (SSH in):

```bash
sudo bash deploy/setup-uploads.sh
```

This creates:

```
/var/www/vitaglow/uploads/
├── products/   → product images
├── blog/       → blog cover images
└── general/    → other uploads
```

Images uploaded in Admin are saved here and served at `/uploads/products/...`, etc. They survive redeploys because `docker-compose.yml` mounts this folder into the container.

You can also upload files directly via SFTP/File Manager into those folders.
