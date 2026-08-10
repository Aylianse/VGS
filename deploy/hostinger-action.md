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

## Notes

- Never commit API keys or `.env` to the repo
- Rotate `HOSTINGER_API_KEY` if it was ever exposed
- App env vars are injected at deploy time via `environment-variables` in the workflow
