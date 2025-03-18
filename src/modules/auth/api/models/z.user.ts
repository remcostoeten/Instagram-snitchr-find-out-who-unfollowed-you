import { z } from "zod"

export const userSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    instagramHandle: z.string()
        .min(1, { message: "Instagram handle is required" })
        .regex(/^@?[\w.](?!.*?\.{2})[\w.]+[\w]$/, {
            message: "Invalid Instagram handle format"
        })
        .transform(val => val.startsWith('@') ? val.substring(1) : val),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export type User = z.infer<typeof userSchema> 