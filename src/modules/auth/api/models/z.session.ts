import { z } from "zod"

export const sessionSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    expiresAt: z.date(),
    createdAt: z.date(),
})

export const jwtPayloadSchema = z.object({
    sub: z.string(), // subject (user id)
    email: z.string().email(),
    name: z.string(),
    instagramHandle: z.string(),
    sessionId: z.string(),
    iat: z.number(), // issued at
    exp: z.number(), // expiration time
})

export type Session = z.infer<typeof sessionSchema>
export type JWTPayload = z.infer<typeof jwtPayloadSchema> 