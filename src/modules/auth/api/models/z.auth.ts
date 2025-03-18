import { z } from "zod"

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    rememberMe: z.boolean().optional(),
    csrfToken: z.string(),
})

export const registerSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    instagramHandle: z.string()
        .min(1, { message: "Instagram handle is required" })
        .regex(/^@?[\w.](?!.*?\.{2})[\w.]+[\w]$/, {
            message: "Invalid Instagram handle format"
        })
        .transform(val => val.startsWith('@') ? val.substring(1) : val),
    csrfToken: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export const passwordResetRequestSchema = z.object({
    email: z.string().email(),
})

export const passwordResetSchema = z.object({
    token: z.string(),
    password: z.string().min(8),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>
export type PasswordResetInput = z.infer<typeof passwordResetSchema> 