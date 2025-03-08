import { z } from "zod"

// User schema with validation
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Registration input validation schema
export const registerInputSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

// Login input validation schema
export const loginInputSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
})

// Session schema
export const sessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  expiresAt: z.date(),
  createdAt: z.date(),
})

// Types derived from schemas
export type User = z.infer<typeof userSchema>
export type RegisterInput = z.infer<typeof registerInputSchema>
export type LoginInput = z.infer<typeof loginInputSchema>
export type Session = z.infer<typeof sessionSchema>

// JWT payload schema
export const jwtPayloadSchema = z.object({
  sub: z.string(), // subject (user id)
  email: z.string().email(),
  name: z.string(),
  sessionId: z.string(),
  iat: z.number(), // issued at
  exp: z.number(), // expiration time
})

export type JWTPayload = z.infer<typeof jwtPayloadSchema>

