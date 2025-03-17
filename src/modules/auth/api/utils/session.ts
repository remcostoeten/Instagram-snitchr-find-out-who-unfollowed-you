import { db } from '@/server/db';
import { sessions } from '@/server/db/schema';
import { eq, lt } from 'drizzle-orm';
import { addHours } from 'date-fns';

const SESSION_DURATION_HOURS = 24;

export async function createSession(userId: string): Promise<{ id: string }> {
    const [session] = await db.insert(sessions)
        .values({
            userId,
            expiresAt: addHours(new Date(), SESSION_DURATION_HOURS),
        })
        .returning({ id: sessions.id });

    return session;
}

export async function getSession(sessionId: string) {
    return db.query.sessions.findFirst({
        where: eq(sessions.id, sessionId),
    });
}

export async function deleteSession(sessionId: string) {
    await db.delete(sessions)
        .where(eq(sessions.id, sessionId));
}

export async function deleteUserSessions(userId: string) {
    await db.delete(sessions)
        .where(eq(sessions.userId, userId));
}

export async function cleanupExpiredSessions() {
    await db.delete(sessions)
        .where(lt(sessions.expiresAt, new Date()));
}

// Function to extend session duration
export async function extendSession(sessionId: string) {
    await db.update(sessions)
        .set({
            expiresAt: addHours(new Date(), SESSION_DURATION_HOURS),
        })
        .where(eq(sessions.id, sessionId));
}

// Function to validate session
export async function validateSession(sessionId: string): Promise<boolean> {
    const session = await getSession(sessionId);
    if (!session) return false;

    const now = new Date();
    if (session.expiresAt < now) {
        await deleteSession(sessionId);
        return false;
    }

    // Extend session if it's valid
    await extendSession(sessionId);
    return true;
} 