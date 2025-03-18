'use server'

import { db } from '@/server/db';
import { users, passwordResetTokens } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { addHours } from 'date-fns';
import { hashPassword } from '../utils/password';
import { validateCsrfToken } from '../utils/csrf';
import { forgotPasswordSchema, resetPasswordSchema } from '../models/z.auth';
import { RateLimiter } from '../utils/rate-limit';

// Rate limiter for password reset attempts
const passwordResetRateLimiter = new RateLimiter({
    interval: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
});

export async function forgotPassword(input: { email: string, csrfToken: string }) {
    try {
        const { email, csrfToken } = forgotPasswordSchema.parse(input);

        // Validate CSRF token
        if (!await validateCsrfToken(csrfToken)) {
            return { error: 'Invalid request' };
        }

        // Check rate limiting
        const rateLimitResult = passwordResetRateLimiter.attempt(email);
        if (!rateLimitResult.success) {
            return {
                error: `Too many reset attempts. Please try again after ${new Date(rateLimitResult.resetTime!).toLocaleString()}`,
                resetTime: rateLimitResult.resetTime,
            };
        }

        const user = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (!user) {
            // Return success even if user doesn't exist to prevent email enumeration
            return { success: true };
        }

        // Generate reset token
        const token = uuidv4();
        const expiresAt = addHours(new Date(), 1); // Token expires in 1 hour

        // Save reset token
        await db.insert(passwordResetTokens).values({
            userId: user.id,
            token,
            expiresAt,
        });

        // TODO: Send password reset email
        // For now, we'll just return the token (in production, this should be sent via email)
        return { success: true, token };
    } catch (error) {
        console.error('Password reset error:', error);
        return { error: 'An error occurred while processing your request' };
    }
}

export async function resetPassword(input: { token: string, password: string, confirmPassword: string, csrfToken: string }) {
    try {
        const { token, password, csrfToken } = resetPasswordSchema.parse(input);

        // Validate CSRF token
        if (!await validateCsrfToken(csrfToken)) {
            return { error: 'Invalid request' };
        }

        // Find and validate reset token
        const resetToken = await db.query.passwordResetTokens.findFirst({
            where: eq(passwordResetTokens.token, token),
        });

        if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
            return { error: 'Invalid or expired reset token' };
        }

        // Hash new password
        const hashedPassword = await hashPassword(password);

        // Update password and mark token as used
        await db.transaction(async (tx) => {
            await tx.update(users)
                .set({ password: hashedPassword })
                .where(eq(users.id, resetToken.userId));

            await tx.update(passwordResetTokens)
                .set({ used: true })
                .where(eq(passwordResetTokens.id, resetToken.id));
        });

        return { success: true };
    } catch (error) {
        console.error('Password reset error:', error);
        return { error: 'An error occurred while resetting your password' };
    }
} 