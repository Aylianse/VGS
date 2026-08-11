import { NextResponse } from "next/server";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

/** Public health check — safe booleans only, no secrets. */
export async function GET() {
  const checks = {
    jwtSecret: Boolean(process.env.JWT_SECRET),
    databaseUrl: Boolean(process.env.DATABASE_URL),
    directUrl: Boolean(process.env.DIRECT_URL),
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null),
    cloudinary: isCloudinaryConfigured(),
    database: false as boolean,
    adminUser: false as boolean,
    error: null as string | null,
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = true;
    const adminCount = await prisma.adminUser.count();
    checks.adminUser = adminCount > 0;
  } catch (error) {
    checks.error = error instanceof Error ? error.message : "Database connection failed";
  }

  const ok =
    checks.jwtSecret &&
    checks.databaseUrl &&
    checks.database &&
    checks.adminUser;

  return NextResponse.json(
    { ok, ...checks },
    { status: ok ? 200 : 503 },
  );
}
