// Simple in-memory rate limiter
// In production, use a distributed solution like Redis

interface RateLimitEntry {
  count: number
  resetAt: number
}

// Store IP addresses and their request counts
const ipRequests = new Map<string, RateLimitEntry>()

// Store email addresses and their login attempt counts
const loginAttempts = new Map<string, RateLimitEntry>()

// Clean up expired entries every hour
setInterval(
  () => {
    const now = Date.now()

    // Clean up IP requests
    for (const [ip, entry] of ipRequests.entries()) {
      if (entry.resetAt <= now) {
        ipRequests.delete(ip)
      }
    }

    // Clean up login attempts
    for (const [email, entry] of loginAttempts.entries()) {
      if (entry.resetAt <= now) {
        loginAttempts.delete(email)
      }
    }
  },
  60 * 60 * 1000,
) // 1 hour

/**
 * Rate limits requests by IP address
 * @param ip The IP address
 * @param limit The maximum number of requests
 * @param windowMs The time window in milliseconds
 * @returns Whether the request is allowed
 */
export function rateLimit(
  ip: string,
  limit = 100,
  windowMs: number = 60 * 1000, // 1 minute
): boolean {
  const now = Date.now()

  // Get or create entry
  let entry = ipRequests.get(ip)
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + windowMs }
    ipRequests.set(ip, entry)
  }

  // Increment count
  entry.count++

  // Check if limit exceeded
  return entry.count <= limit
}

/**
 * Rate limits login attempts by email address
 * @param email The email address
 * @param limit The maximum number of attempts
 * @param windowMs The time window in milliseconds
 * @returns Whether the login attempt is allowed
 */
export function rateLimitLogin(
  email: string,
  limit = 5,
  windowMs: number = 15 * 60 * 1000, // 15 minutes
): boolean {
  const now = Date.now()

  // Get or create entry
  let entry = loginAttempts.get(email)
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + windowMs }
    loginAttempts.set(email, entry)
  }

  // Increment count
  entry.count++

  // Check if limit exceeded
  return entry.count <= limit
}

/**
 * Resets login attempts for an email address
 * @param email The email address
 */
export function resetLoginAttempts(email: string): void {
  loginAttempts.delete(email)
}

