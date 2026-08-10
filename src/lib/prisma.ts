import { PrismaClient } from "@prisma/client";
import {
  assertPooledHostname,
  getRuntimeDatabaseUrl,
} from "@/lib/database-url";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const databaseUrl = getRuntimeDatabaseUrl();
assertPooledHostname(databaseUrl);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: databaseUrl ? { db: { url: databaseUrl } } : undefined,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

// Reuse client across serverless invocations (Vercel)
globalForPrisma.prisma = prisma;
