#!/usr/bin/env bash
# Poll GitHub for new commits on main and deploy only when something changed.
# For public repos — no GitHub Actions, no deploy keys, no account secrets.
#
# Install once on the VPS:
#   chmod +x deploy/auto-deploy.sh deploy/install-auto-deploy.sh
#   sudo bash deploy/install-auto-deploy.sh

set -euo pipefail

APP_DIR="/var/www/vitaglow"
LOG_FILE="/var/log/vitaglow-deploy.log"

cd "$APP_DIR"

if [[ ! -f .env ]]; then
  echo "$(date -Is) ERROR: .env not found in $APP_DIR" >> "$LOG_FILE"
  exit 1
fi

git fetch origin main --quiet

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [[ "$LOCAL" == "$REMOTE" ]]; then
  exit 0
fi

echo "$(date -Is) New commit detected ($LOCAL -> $REMOTE). Deploying..." >> "$LOG_FILE"

if bash deploy/deploy.sh >> "$LOG_FILE" 2>&1; then
  echo "$(date -Is) Deploy succeeded." >> "$LOG_FILE"
else
  echo "$(date -Is) Deploy FAILED." >> "$LOG_FILE"
  exit 1
fi
