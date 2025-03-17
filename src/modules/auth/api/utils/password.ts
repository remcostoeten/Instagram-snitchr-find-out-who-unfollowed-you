import bcrypt from "bcryptjs"

// Number of salt rounds for bcrypt
const SALT_ROUNDS = 10

/**
 * Hashes a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Compares a password with a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

