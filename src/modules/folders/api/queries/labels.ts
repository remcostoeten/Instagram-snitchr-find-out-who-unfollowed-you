'use server'

import { db } from '@/server/db'
import { labels } from '@/server/db/schema'
import { eq, and } from 'drizzle-orm'
import { getCurrentUser } from '@/modules/auth/api/queries/auth'

export async function getLabels() {
    try {
        const user = await getCurrentUser()
        if (!user) throw new Error('Not authenticated')

        const userLabels = await db.query.labels.findMany({
            where: eq(labels.userId, user.id),
            orderBy: labels.createdAt
        })

        return { success: true, labels: userLabels }
    } catch (error) {
        console.error('Get labels error:', error)
        return { error: 'Failed to get labels' }
    }
}

export async function getLabel(labelId: string) {
    try {
        const user = await getCurrentUser()
        if (!user) throw new Error('Not authenticated')

        const label = await db.query.labels.findFirst({
            where: and(
                eq(labels.id, labelId),
                eq(labels.userId, user.id)
            ),
            with: {
                folders: {
                    with: {
                        folder: true
                    }
                }
            }
        })

        if (!label) {
            return { error: 'Label not found' }
        }

        return { success: true, label }
    } catch (error) {
        console.error('Get label error:', error)
        return { error: 'Failed to get label' }
    }
} 