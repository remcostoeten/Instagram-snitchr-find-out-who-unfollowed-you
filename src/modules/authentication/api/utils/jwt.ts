import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { JWTPayload } from "../models/schema"

// Secret key for JWT signing and verification
// In production, use a secure environment variable
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-min-32-chars-long-here")

// Token expiration time (24 hours)
const EXPIRES_IN = "24h"

// Cookie name for storing the JWT
export const AUTH_COOKIE = "auth_token"

/**
 * Creates a new JWT token
 */
export async function createToken(payload: Omit<JWTPayload, "iat" | "exp">): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRES_IN)
    .sign(JWT_SECRET)
}

/**
 * Verifies a JWT token and returns the payload
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as JWTPayload
  } catch (error) {
    return null
  }
}

/**
 * Sets the JWT token as an HTTP-only cookie
 */
export function setTokenCookie(token: string): void {
  cookies().set({
    name: AUTH_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    // Expiration time should match the JWT expiration
    maxAge: 60 * 60 * 24, // 24 hours in seconds
  })
}

/**
 * Removes the JWT token cookie
 */
export function removeTokenCookie(): void {
  cookies().delete(AUTH_COOKIE)
}

/**
 * Gets the JWT token from cookies
 */
export function getTokenFromCookies(): string | undefined {
  return cookies().get(AUTH_COOKIE)?.value
}

