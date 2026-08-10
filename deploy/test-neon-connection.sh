#!/usr/bin/env bash
# Test Neon connectivity from the Hostinger VPS.
# Run on VPS: bash deploy/test-neon-connection.sh

set -euo pipefail

CONTAINER="${CONTAINER:-vitaglow}"
NEON_HOST="${NEON_HOST:-ep-late-mountain-ay0hxfih-pooler.c-5.us-east-2.aws.neon.tech}"

echo "=== 1. Container env ==="
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
  if docker exec "$CONTAINER" printenv DATABASE_URL >/dev/null 2>&1; then
    echo "DATABASE_URL is set (value hidden)"
  else
    echo "ERROR: DATABASE_URL is NOT set inside container"
    echo "Fix: set DATABASE_URL in GitHub Secrets and redeploy"
    exit 1
  fi
else
  echo "WARN: container '$CONTAINER' not running — checking host env"
  if [[ -z "${DATABASE_URL:-}" ]]; then
    echo "ERROR: DATABASE_URL not set on host either"
    exit 1
  fi
  echo "DATABASE_URL is set on host (value hidden)"
fi

echo ""
echo "=== 2. DNS lookup ==="
getent hosts "$NEON_HOST" || nslookup "$NEON_HOST" || echo "DNS lookup failed"

echo ""
echo "=== 3. TCP port 5432 ==="
if command -v nc >/dev/null 2>&1; then
  nc -zv -w 5 "$NEON_HOST" 5432 && echo "Port 5432 reachable" || echo "Port 5432 NOT reachable (firewall or network block)"
elif command -v bash >/dev/null 2>&1; then
  timeout 5 bash -c "echo >/dev/tcp/$NEON_HOST/5432" && echo "Port 5432 reachable" || echo "Port 5432 NOT reachable"
else
  echo "Skip: install netcat (nc) to test port"
fi

echo ""
echo "=== 4. Prisma query ==="
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
  docker exec "$CONTAINER" node -e "
    const { PrismaClient } = require('@prisma/client');
    const url = process.env.DATABASE_URL || '';
    const clean = url.replace(/[&?]channel_binding=[^&]*/g, '');
    const p = new PrismaClient({ datasources: { db: { url: clean } } });
    p.\$queryRaw\`SELECT 1 AS ok\`
      .then(r => { console.log('Prisma OK:', r); process.exit(0); })
      .catch(e => { console.error('Prisma FAILED:', e.message); process.exit(1); })
      .finally(() => p.\$disconnect());
  "
else
  echo "Skip: start container first"
fi

echo ""
echo "Done."
