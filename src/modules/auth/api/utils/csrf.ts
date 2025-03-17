import { randomBytes } from "crypto"
import { cookies } from "next/headers"
import { RequestCookies } from "next/dist/server/web/spec-extension/cookies"

const CSRF_TOKEN_LENGTH = 32
const CSRF_COOKIE_NAME = "csrf_token"
const CSRF_HEADER_NAME = "X-CSRF-Token"

/**
 * Generates a new CSRF token
 */
export function generateToken(): string {
  return randomBytes(CSRF_TOKEN_LENGTH).toString("hex")
}

/**
 * Sets a CSRF token cookie
 */
export async function setCsrfToken(): Promise<string> {
  const token = generateToken()
  const cookieStore = await cookies()
  cookieStore.set({
    name: CSRF_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  })
  return token
}

/**
 * Gets the CSRF token from cookies
 */
export async function getCsrfToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(CSRF_COOKIE_NAME)?.value
}

/**
 * Validates a CSRF token against the stored token
 */
export async function validateCsrfToken(token: string | null): Promise<boolean> {
  if (!token) return false

  const storedToken = await getCsrfToken()
  if (!storedToken) return false

  // Use timing-safe comparison
  return timingSafeEqual(token, storedToken)
}

// Timing-safe string comparison to prevent timing attacks
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

// Middleware to validate CSRF token
export async function validateCsrf(request: Request) {
  const token = request.headers.get(CSRF_HEADER_NAME)
  if (!await validateCsrfToken(token)) {
    throw new Error("Invalid CSRF token")
  }
}

