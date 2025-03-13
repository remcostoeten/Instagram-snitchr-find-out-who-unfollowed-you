import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Database connection string should be in environment variables
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
}

// Create the connection
const client = postgres(connectionString);

// Create the database instance
export const db = drizzle(client, { schema });

// Export the schema
export * from './schema'; 