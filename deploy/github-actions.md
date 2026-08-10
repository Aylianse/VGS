# Auto-deploy with GitHub Actions (optional)

> **Prefer not to use your GitHub account for deploy?** Use [vps-auto-deploy.md](vps-auto-deploy.md) instead — the VPS pulls your **public** repo on a schedule. No GitHub Secrets required.

Push to `main` can trigger [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) (if enabled), which SSHs into your Hostinger VPS and runs `deploy/deploy.sh`.

**Note:** The workflow file is not included by default. Copy from git history or recreate it if you want this approach.

## One-time VPS setup

The VPS must already have the app cloned and running. See [setup-vps.md](setup-vps.md) for the full first-time install.

Minimum checklist:

```bash
# On the VPS
mkdir -p /var/www
cd /var/www
git clone git@github.com:YOUR_USER/VGS.git vitaglow
cd vitaglow
cp .env.example .env   # fill in production values — never commit .env
npm ci
npx prisma db push
npm run db:seed        # once
npm run build
npm run pm2:start
pm2 save && pm2 startup
```

Create `.env` on the server with real secrets. GitHub Actions never receives your `.env` — it stays on the VPS only.

## GitHub repository secrets

In GitHub: **Settings → Secrets and variables → Actions → New repository secret**

| Secret | Example | Required |
|--------|---------|----------|
| `VPS_HOST` | `123.45.67.89` or `vitaglowproducts.com` | Yes |
| `VPS_USER` | `root` | Yes |
| `VPS_SSH_KEY` | Private SSH key (full PEM contents) | Yes |
| `VPS_PORT` | `22` | No (defaults to 22) |

### Create a deploy SSH key

On your **local machine**:

```bash
ssh-keygen -t ed25519 -C "github-deploy-vitaglow" -f ~/.ssh/vitaglow_deploy -N ""
```

**On the VPS** — add the public key:

```bash
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys   # paste contents of vitaglow_deploy.pub
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

**In GitHub** — add the **private** key (`vitaglow_deploy`) as `VPS_SSH_KEY`.

Test from your laptop:

```bash
ssh -i ~/.ssh/vitaglow_deploy root@YOUR_VPS_IP "echo ok"
```

## Private repo: git pull on the VPS

The VPS needs read access to GitHub to pull code.

**Option A — Deploy key (recommended)**

```bash
# On the VPS
ssh-keygen -t ed25519 -C "vps-vitaglow" -f ~/.ssh/github_vps -N ""
cat ~/.ssh/github_vps.pub
```

Add that public key in GitHub: **Repo → Settings → Deploy keys → Add deploy key** (read-only).

```bash
# On the VPS — use SSH remote
cd /var/www/vitaglow
git remote set-url origin git@github.com:YOUR_USER/VGS.git

# ~/.ssh/config
Host github.com
  IdentityFile ~/.ssh/github_vps
  IdentitiesOnly yes
```

Test: `ssh -T git@github.com` then `git fetch origin main`.

**Option B — Public repo**

No extra git auth needed on the VPS.

## How a deploy works

1. You push to `main`
2. GitHub Actions connects to the VPS over SSH
3. Runs `deploy/deploy.sh`:
   - `git fetch` + `git reset --hard origin/main`
   - `npm ci`
   - `npx prisma db push`
   - `npm run build`
   - `pm2 reload vitaglow`

Manual deploy from GitHub: **Actions → Deploy to Hostinger VPS → Run workflow**.

## Docker instead of PM2

If you use Docker on the VPS, change the workflow script to:

```yaml
script: |
  cd /var/www/vitaglow
  bash deploy/deploy-docker.sh
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| SSH connection failed | Check `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, firewall port 22 |
| `git fetch` failed on VPS | Set up deploy key (private repos) |
| `npm run build` failed | SSH in manually, run `bash deploy/deploy.sh`, read the error |
| App not updating | `pm2 logs vitaglow` — confirm reload succeeded |
| `.env` missing | Create `/var/www/vitaglow/.env` on the VPS (not in git) |
