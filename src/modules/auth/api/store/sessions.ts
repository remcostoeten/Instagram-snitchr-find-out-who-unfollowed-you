import { v4 as uuidv4 } from "uuid"
import type { Session } from "../models/schema"

// In-memory store for sessions (replace with a database in production)
let sessions: Session[] = []

/**
 * Creates a new session
 */
export async function createSession(userId: string): Promise<Session> {
  const now = new Date()
  // Session expires in 24 hours
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)

  const newSession: Session = {
    id: uuidv4(),
    userId,
    expiresAt,
    createdAt: now,
  }

  sessions.push(newSession)
  return newSession
}

/**
 * Finds a session by ID
 */
export async function findSessionById(id: string): Promise<Session | undefined> {
  return sessions.find((session) => session.id === id)
}

/**
 * Finds all sessions for a user
 */
export async function findSessionsByUserId(userId: string): Promise<Session[]> {
  return sessions.filter((session) => session.userId === userId)
}

/**
 * Deletes a session
 */
export async function deleteSession(id: string): Promise<boolean> {
  const initialLength = sessions.length
  sessions = sessions.filter((session) => session.id !== id)
  return sessions.length < initialLength
}

/**
 * Deletes all sessions for a user
 */
export async function deleteUserSessions(userId: string): Promise<boolean> {
  const initialLength = sessions.length
  sessions = sessions.filter((session) => session.userId !== userId)
  return sessions.length < initialLength
}

/**
 * Cleans up expired sessions
 */
export async function cleanupExpiredSessions(): Promise<void> {
  const now = new Date()
  sessions = sessions.filter((session) => session.expiresAt > now)
}

