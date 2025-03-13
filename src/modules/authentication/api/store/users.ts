import { eq } from 'drizzle-orm';
import { db, users } from "@/server/db";
import type { User } from "../models/schema";

/**
 * Creates a new user
 */
export async function createUser(
  email: string,
  hashedPassword: string,
  name: string,
  instagramHandle: string
): Promise<User> {
  const user = {
    id: crypto.randomUUID(),
    email,
    password: hashedPassword,
    name,
    instagramHandle,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await db.insert(users).values(user);
  return user;
}

/**
 * Finds a user by email
 */
export async function findUserByEmail(email: string): Promise<User | undefined> {
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0];
}

/**
 * Finds a user by ID
 */
export async function findUserById(id: string): Promise<User | undefined> {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}

/**
 * Updates a user
 */
export async function updateUser(
  id: string,
  updates: Partial<Omit<User, "id" | "createdAt">>,
): Promise<User | undefined> {
  const updateData = {
    ...updates,
    updatedAt: new Date(),
  };

  await db.update(users)
    .set(updateData)
    .where(eq(users.id, id));

  return findUserById(id);
}

/**
 * Deletes a user
 */
export async function deleteUser(id: string): Promise<boolean> {
  const result = await db.delete(users).where(eq(users.id, id));
  return result.rowCount > 0;
}

