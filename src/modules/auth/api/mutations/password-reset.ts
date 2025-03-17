import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { randomBytes } from 'crypto';
import { hashPassword } from '../utils/password';
import { addHours } from 'date-fns';

// Store reset tokens in memory (in production, use Redis or similar)
const resetTokens = new Map<string, { userId: string; expiresAt: Date }>();

const requestResetSchema = z.object({
    email: z.string().email(),
});

const resetPasswordSchema = z.object({
    token: z.string(),
    password: z.string().min(8),
});

export type RequestResetInput = z.infer<typeof requestResetSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export async function requestPasswordReset(input: RequestResetInput) {
    try {
        const { email } = requestResetSchema.parse(input);

        const user = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (!user) {
            // Return success even if user doesn't exist to prevent email enumeration
            return { success: true };
        }

        // Generate reset token
        const token = randomBytes(32).toString('hex');
        const expiresAt = addHours(new Date(), 1); // Token expires in 1 hour

        // Store token (in production, store in database or Redis)
        resetTokens.set(token, {
            userId: user.id,
            expiresAt,
        });

        // TODO: Send password reset email
        // In production, integrate with your email service
        console.log(`Password reset token for ${email}: ${token}`);

        return { success: true };
    } catch (error) {
        console.error('Password reset request error:', error);
        if (error instanceof z.ZodError) {
            return { fieldErrors: error.flatten().fieldErrors };
        }
        return { error: 'Failed to process password reset request' };
    }
}

export async function resetPassword(input: ResetPasswordInput) {
    try {
        const { token, password } = resetPasswordSchema.parse(input);

        const resetInfo = resetTokens.get(token);
        if (!resetInfo) {
            return { error: 'Invalid or expired reset token' };
        }

        const now = new Date();
        if (now > resetInfo.expiresAt) {
            resetTokens.delete(token);
            return { error: 'Reset token has expired' };
        }

        const hashedPassword = await hashPassword(password);

        // Update password in database
        await db.update(users)
            .set({ password: hashedPassword })
            .where(eq(users.id, resetInfo.userId));

        // Remove used token
        resetTokens.delete(token);

        return { success: true };
    } catch (error) {
        console.error('Password reset error:', error);
        if (error instanceof z.ZodError) {
            return { fieldErrors: error.flatten().fieldErrors };
        }
        return { error: 'Failed to reset password' };
    }
}

// Cleanup expired tokens periodically
setInterval(() => {
    const now = new Date();
    for (const [token, info] of resetTokens.entries()) {
        if (now > info.expiresAt) {
            resetTokens.delete(token);
        }
    }
}, 15 * 60 * 1000); // Clean up every 15 minutes 