import { z } from "zod"

export const updateProfileSchema = z.object({
    name: z.string().min(1),
    instagramHandle: z.string().min(1),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>