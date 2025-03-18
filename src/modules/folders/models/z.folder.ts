import { z } from 'zod'

export const folderSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    name: z.string().min(1, 'Folder name is required'),
    description: z.string().nullable(),
    color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
    icon: z.string(),
    isArchived: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const createFolderSchema = z.object({
    name: z.string().min(1, 'Folder name is required'),
    description: z.string().optional(),
    color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format').optional(),
    icon: z.string().optional(),
    labelIds: z.array(z.string().uuid()).optional(),
})

export const updateFolderSchema = createFolderSchema.partial().extend({
    isArchived: z.boolean().optional(),
})

export type Folder = z.infer<typeof folderSchema>
export type CreateFolderInput = z.infer<typeof createFolderSchema>
export type UpdateFolderInput = z.infer<typeof updateFolderSchema> 