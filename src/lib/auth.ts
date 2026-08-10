import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { AUTH_COOKIE } from "./constants";
import { prisma } from "./prisma";

export { AUTH_COOKIE };

export function authCookieOptions() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  const secure = siteUrl.startsWith("https://");

  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return new TextEncoder().encode(secret);
}

export type AdminSession = {
  id: string;
  email: string;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createAdminToken(user: AdminSession) {
  return new SignJWT({ email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub || typeof payload.email !== "string") return null;
    return { id: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("UNAUTHORIZED");

  const user = await prisma.adminUser.findUnique({ where: { id: session.id } });
  if (!user) throw new Error("UNAUTHORIZED");

  return user;
}

export function isUnauthorized(error: unknown) {
  return error instanceof Error && error.message === "UNAUTHORIZED";
}
