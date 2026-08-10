/**
 * Neon + Prisma connection string helpers.
 * @see https://neon.com/docs/guides/prisma
 *
 * Runtime (Prisma Client): DATABASE_URL — pooled hostname (-pooler), sslmode=require
 * CLI (db push, migrate):   DIRECT_URL  — direct hostname (no -pooler), sslmode=require
 */

export function stripChannelBinding(url: string) {
  return url.replace(/[&?]channel_binding=[^&]*/g, "").replace(/\?&/, "?").replace(/&$/, "");
}

export function ensureSslModeRequire(url: string) {
  if (/[?&]sslmode=/.test(url)) return url;
  return `${url}${url.includes("?") ? "&" : "?"}sslmode=require`;
}

export function ensureConnectTimeout(url: string, seconds = 15) {
  if (/[?&]connect_timeout=/.test(url)) return url;
  return `${url}${url.includes("?") ? "&" : "?"}connect_timeout=${seconds}`;
}

/** Neon pooler + Prisma on serverless (Vercel) needs pgbouncer=true. */
export function ensurePgBouncer(url: string) {
  if (!url.includes("-pooler.") || /[?&]pgbouncer=/.test(url)) return url;
  return `${url}${url.includes("?") ? "&" : "?"}pgbouncer=true`;
}

/** Pooled URL for Prisma Client runtime connections. */
export function getRuntimeDatabaseUrl(url = process.env.DATABASE_URL) {
  if (!url) return url;
  let normalized = stripChannelBinding(url);
  normalized = ensureSslModeRequire(normalized);
  normalized = ensureConnectTimeout(normalized);
  normalized = ensurePgBouncer(normalized);
  return normalized;
}

/** Direct URL for Prisma CLI — falls back to DATABASE_URL without -pooler. */
export function getDirectDatabaseUrl(
  directUrl = process.env.DIRECT_URL,
  pooledUrl = process.env.DATABASE_URL,
) {
  const raw =
    directUrl ||
    (pooledUrl ? pooledUrl.replace("-pooler.", ".") : undefined);
  if (!raw) return raw;
  let normalized = stripChannelBinding(raw);
  normalized = ensureSslModeRequire(normalized);
  normalized = ensureConnectTimeout(normalized);
  return normalized;
}

export function assertPooledHostname(url: string | undefined) {
  if (process.env.NODE_ENV === "production" && url && !url.includes("-pooler.")) {
    console.warn(
      "[database] DATABASE_URL should use Neon pooled hostname (-pooler) for runtime connections.",
    );
  }
}
