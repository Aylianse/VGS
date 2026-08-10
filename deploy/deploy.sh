#!/usr/bin/env bash
# Run on the VPS from /var/www/vitaglow after initial setup.
# Preserves .env and public/uploads — only updates app code and rebuilds.

set -euo pipefail

APP_DIR="/var/www/vitaglow"
APP_NAME="vitaglow"

cd "$APP_DIR"

if [[ ! -f .env ]]; then
  echo "Error: .env not found in $APP_DIR. Create it from .env.example first."
  exit 1
fi

echo "==> Pulling latest code..."
git fetch origin main
git reset --hard origin/main

echo "==> Installing dependencies..."
npm ci

echo "==> Syncing database schema..."
npx prisma db push

echo "==> Building app..."
npm run build

echo "==> Reloading PM2 process..."
pm2 reload "$APP_NAME"

echo "==> Deploy complete."
pm2 status "$APP_NAME"
