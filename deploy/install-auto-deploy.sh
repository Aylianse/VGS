#!/usr/bin/env bash
# Install a cron job on the VPS to auto-deploy from the public GitHub repo.
# Run on the VPS: sudo bash deploy/install-auto-deploy.sh

set -euo pipefail

APP_DIR="/var/www/vitaglow"
CRON_FILE="/etc/cron.d/vitaglow-deploy"
INTERVAL="${DEPLOY_POLL_MINUTES:-3}"

if [[ ! -d "$APP_DIR" ]]; then
  echo "Error: $APP_DIR not found. Clone the repo first."
  exit 1
fi

chmod +x "$APP_DIR/deploy/auto-deploy.sh"
chmod +x "$APP_DIR/deploy/deploy.sh"

touch /var/log/vitaglow-deploy.log
chmod 644 /var/log/vitaglow-deploy.log

cat > "$CRON_FILE" <<EOF
# Auto-deploy Vita Glow when main branch updates (public repo pull)
*/${INTERVAL} * * * * root ${APP_DIR}/deploy/auto-deploy.sh
EOF

chmod 644 "$CRON_FILE"

echo "Installed cron job (every ${INTERVAL} minutes)."
echo "Logs: /var/log/vitaglow-deploy.log"
echo ""
echo "Test now:"
echo "  bash ${APP_DIR}/deploy/auto-deploy.sh"
echo "  tail -f /var/log/vitaglow-deploy.log"
