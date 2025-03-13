import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    name: text('name').notNull(),
    instagramHandle: text('instagram_handle').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const sessions = pgTable('sessions', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
}); 