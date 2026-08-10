#!/usr/bin/env bash
# Docker deploy — run on the VPS from /var/www/vitaglow

set -euo pipefail

APP_DIR="/var/www/vitaglow"

cd "$APP_DIR"

if [[ ! -f .env ]]; then
  echo "Error: .env not found in $APP_DIR. Create it from .env.example first."
  exit 1
fi

echo "==> Pulling latest code..."
git pull --ff-only

echo "==> Building and restarting containers..."
docker compose up -d --build

echo "==> Pruning old images..."
docker image prune -f

echo "==> Deploy complete."
docker compose ps
