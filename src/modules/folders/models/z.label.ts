import { z } from 'zod'

export const labelSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    name: z.string().min(1, 'Label name is required'),
    color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
    icon: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const createLabelSchema = z.object({
    name: z.string().min(1, 'Label name is required'),
    color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format').optional(),
    icon: z.string().optional(),
})

export const updateLabelSchema = createLabelSchema.partial()

export type Label = z.infer<typeof labelSchema>
export type CreateLabelInput = z.infer<typeof createLabelSchema>
export type UpdateLabelInput = z.infer<typeof updateLabelSchema> 