import { v4 as uuidv4 } from "uuid"
import type { User } from "../models/schema"

// In-memory store for users (replace with a database in production)
let users: User[] = []

/**
 * Creates a new user
 */
export async function createUser(email: string, hashedPassword: string, name: string): Promise<User> {
  const now = new Date()
  const newUser: User = {
    id: uuidv4(),
    email,
    password: hashedPassword,
    name,
    createdAt: now,
    updatedAt: now,
  }

  users.push(newUser)
  return newUser
}

/**
 * Finds a user by email
 */
export async function findUserByEmail(email: string): Promise<User | undefined> {
  return users.find((user) => user.email === email)
}

/**
 * Finds a user by ID
 */
export async function findUserById(id: string): Promise<User | undefined> {
  return users.find((user) => user.id === id)
}

/**
 * Updates a user
 */
export async function updateUser(
  id: string,
  updates: Partial<Omit<User, "id" | "createdAt">>,
): Promise<User | undefined> {
  const userIndex = users.findIndex((user) => user.id === id)
  if (userIndex === -1) return undefined

  const updatedUser = {
    ...users[userIndex],
    ...updates,
    updatedAt: new Date(),
  }

  users[userIndex] = updatedUser
  return updatedUser
}

/**
 * Deletes a user
 */
export async function deleteUser(id: string): Promise<boolean> {
  const initialLength = users.length
  users = users.filter((user) => user.id !== id)
  return users.length < initialLength
}

