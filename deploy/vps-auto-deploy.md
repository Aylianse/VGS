# Auto-deploy (public repo, no GitHub account secrets)

For a **public** repo when you do **not** want GitHub Actions or SSH keys stored in your GitHub account: the **VPS pulls** from GitHub on a schedule. You push code normally; the server detects new commits and deploys itself.

No Hostinger API key. No GitHub Secrets. No deploy keys (HTTPS clone is enough for public repos).

## How it works

```
You push to main  →  GitHub (public)  →  VPS cron polls every 3 min  →  deploy if changed
```

## One-time VPS setup

### 1. Clone via HTTPS (no GitHub login)

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/YOUR_USER/VGS.git vitaglow
cd vitaglow
```

Replace `YOUR_USER/VGS` with your repo path.

### 2. First-time app setup

Follow [setup-vps.md](setup-vps.md) steps 6–8 (`.env`, build, PM2). Or at minimum:

```bash
cp .env.example .env          # edit with real production values
npm ci
npx prisma db push
npm run db:seed               # once
npm run build
npm run pm2:start
pm2 save && pm2 startup
```

### 3. Enable auto-deploy cron

On the VPS:

```bash
cd /var/www/vitaglow
chmod +x deploy/auto-deploy.sh deploy/install-auto-deploy.sh
sudo bash deploy/install-auto-deploy.sh
```

Default: checks GitHub every **3 minutes**. Custom interval:

```bash
sudo DEPLOY_POLL_MINUTES=5 bash deploy/install-auto-deploy.sh
```

### 4. Test

Push a small change to `main`, wait a few minutes, then on the VPS:

```bash
tail -f /var/log/vitaglow-deploy.log
```

Or trigger manually:

```bash
bash /var/www/vitaglow/deploy/auto-deploy.sh
```

## Day-to-day workflow

1. You (or anyone) push to `main` on GitHub
2. Within ~3 minutes the VPS pulls, rebuilds, and reloads PM2
3. Nothing runs under your GitHub account except a normal `git push`

## Remove auto-deploy

```bash
sudo rm /etc/cron.d/vitaglow-deploy
```

## Docker instead of PM2

Edit `deploy/auto-deploy.sh` to call `deploy/deploy-docker.sh` instead of `deploy/deploy.sh`.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| No deploy after push | `tail /var/log/vitaglow-deploy.log` — check errors |
| `git fetch` fails | Confirm repo URL: `git remote -v` should be HTTPS public URL |
| Build fails | SSH in and run `bash deploy/deploy.sh` to see full output |
| Wrong branch | VPS tracks `origin/main` only |

## Alternative: GitHub Actions (optional)

If you later want instant deploy on push (not poll every 3 min), see [github-actions.md](github-actions.md). That requires GitHub repository secrets — skip it if you prefer the VPS-only approach above.
