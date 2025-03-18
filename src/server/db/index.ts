import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Database connection string from environment variable
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
}

// Create postgres connection
const client = postgres(connectionString);

// Create drizzle database instance
export const db = drizzle(client, { schema });

// Export schema
export * from './schema'; 