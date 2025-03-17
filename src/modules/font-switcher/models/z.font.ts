import { z } from 'zod'

export const fontSchema = z.object({
    id: z.string(),
    name: z.string(),
    variable: z.string(),
    googleFontName: z.string(),
    category: z.enum(['sans', 'serif', 'display', 'monospace']),
    weights: z.array(z.number()).default([400, 700]),
})

export type Font = z.infer<typeof fontSchema>

export const fontPreferenceSchema = z.object({
    selectedFontId: z.string(),
    customFallback: z.string().optional(),
}) 