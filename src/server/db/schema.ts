import { pgTable, text, timestamp, uuid, boolean, jsonb, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export const users = pgTable('users', {
    id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: text('password').notNull(),
    name: varchar('name', { length: 255 }),
    instagramHandle: varchar('instagram_handle', { length: 30 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const folders = pgTable('folders', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    description: text('description'),
    color: text('color').default('#94a3b8'),
    icon: text('icon').default('folder'),
    isArchived: boolean('is_archived').default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const labels = pgTable('labels', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    color: text('color').default('#94a3b8'), // Default slate-400
    icon: text('icon').default('tag'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Relation for folders to have multiple labels
export const folderLabels = pgTable('folder_labels', {
    id: uuid('id').primaryKey().defaultRandom(),
    folderId: uuid('folder_id').notNull().references(() => folders.id, { onDelete: 'cascade' }),
    labelId: uuid('label_id').notNull().references(() => labels.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const files = pgTable('files', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    originalName: text('original_name').notNull(),
    folderId: uuid('folder_id').references(() => folders.id, { onDelete: 'set null' }),
    labels: jsonb('labels').notNull().default([]),
    data: jsonb('data').notNull(),
    columns: jsonb('columns').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const sessions = pgTable('sessions', {
    id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
    userId: varchar('user_id', { length: 128 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
    folders: many(folders),
    labels: many(labels),
    files: many(files),
    sessions: many(sessions),
}));

export const foldersRelations = relations(folders, ({ one, many }) => ({
    user: one(users, {
        fields: [folders.userId],
        references: [users.id],
    }),
    labels: many(folderLabels),
}));

export const labelsRelations = relations(labels, ({ one, many }) => ({
    user: one(users, {
        fields: [labels.userId],
        references: [users.id],
    }),
    folders: many(folderLabels),
}));

export const folderLabelsRelations = relations(folderLabels, ({ one }) => ({
    folder: one(folders, {
        fields: [folderLabels.folderId],
        references: [folders.id],
    }),
    label: one(labels, {
        fields: [folderLabels.labelId],
        references: [labels.id],
    }),
}));

export const filesRelations = relations(files, ({ one }) => ({
    user: one(users, {
        fields: [files.userId],
        references: [users.id],
    }),
    folder: one(folders, {
        fields: [files.folderId],
        references: [folders.id],
    }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
})); 