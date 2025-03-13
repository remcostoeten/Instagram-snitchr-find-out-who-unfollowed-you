import { randomBytes } from "crypto"
import { cookies } from "next/headers"

// CSRF token cookie name
export const CSRF_COOKIE = "csrf_token"

// CSRF token expiration time (1 hour)
const CSRF_EXPIRATION = 60 * 60 // 1 hour in seconds

/**
 * Generates a new CSRF token
 */
export function generateCsrfToken(): string {
  return randomBytes(32).toString("hex")
}

/**
 * Sets a CSRF token cookie
 */
export async function setCsrfCookie(): Promise<string> {
  const token = generateCsrfToken()

  await (await cookies()).set({
    name: CSRF_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: CSRF_EXPIRATION,
  })

  return token
}

/**
 * Gets the CSRF token from cookies
 */
export async function getCsrfToken(): Promise<string | undefined> {
  return (await cookies()).get(CSRF_COOKIE)?.value
}

/**
 * Validates a CSRF token against the stored token
 */
export function validateCsrfToken(token: string): boolean {
  const storedToken = getCsrfToken()
  return !!storedToken && token === storedToken
}

