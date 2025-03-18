import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { RequestCookies } from "next/dist/server/web/spec-extension/cookies"
import { users } from "@/server/db/schema"
import { sessions } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { db } from "@/server/db"

// Secret key for JWT signing and verification
// In production, use a secure environment variable
const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-min-32-chars-long-here")

// Token expiration time (24 hours)
const EXPIRES_IN = "24h"

// Cookie name for storing the JWT
export const AUTH_COOKIE = "auth_token"

interface JWTPayload {
  sub: string;
  email: string;
  [key: string]: any;
}

/**
 * Creates a new JWT token
 */
export async function createToken(payload: JWTPayload): Promise<string> {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRES_IN)
    .sign(secret)

  return token
}

/**
 * Verifies a JWT token and returns the payload
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as JWTPayload
  } catch (error) {
    console.error('Error verifying token:', error)
    return null
  }
}

/**
 * Sets the JWT token as an HTTP-only cookie
 */
export async function setTokenCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours in seconds
  })
}

/**
 * Removes the JWT token cookie
 */
export async function removeTokenCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE)
}

/**
 * Gets the JWT token from cookies
 */
export async function getTokenFromCookies(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(AUTH_COOKIE)?.value
}

export async function findSessionById(id: string) {
  const session = await db.query.sessions.findFirst({
    where: eq(sessions.id, id),
  })
  return session
}

export async function findUserById(id: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  })
  return user
}