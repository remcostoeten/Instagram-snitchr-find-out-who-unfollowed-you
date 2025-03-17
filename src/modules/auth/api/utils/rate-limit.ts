// Simple in-memory rate limiter
// In production, use a distributed solution like Redis

import { LRUCache } from 'lru-cache';

interface RateLimitOptions {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per interval
}

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private cache: LRUCache<string, RateLimitInfo>;
  private interval: number;
  private maxRequests: number;

  constructor(options: RateLimitOptions) {
    this.interval = options.interval;
    this.maxRequests = options.maxRequests;
    this.cache = new LRUCache({
      max: 10000, // Maximum number of items to store
      ttl: options.interval, // Time to live in milliseconds
    });
  }

  attempt(key: string): { success: boolean; resetTime?: number; remaining: number } {
    const now = Date.now();
    const info = this.cache.get(key) || { count: 0, resetTime: now + this.interval };

    // Reset count if we're in a new time window
    if (now > info.resetTime) {
      info.count = 0;
      info.resetTime = now + this.interval;
    }

    info.count++;
    this.cache.set(key, info);

    const remaining = Math.max(0, this.maxRequests - info.count);
    const success = info.count <= this.maxRequests;

    return {
      success,
      resetTime: success ? undefined : info.resetTime,
      remaining,
    };
  }

  reset(key: string): void {
    this.cache.delete(key);
  }
}

// Create rate limiters for different actions
export const loginRateLimiter = new RateLimiter({
  interval: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
});

export const registrationRateLimiter = new RateLimiter({
  interval: 60 * 60 * 1000, // 1 hour
  maxRequests: 3,
});

export const passwordResetRateLimiter = new RateLimiter({
  interval: 60 * 60 * 1000, // 1 hour
  maxRequests: 3,
});

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

