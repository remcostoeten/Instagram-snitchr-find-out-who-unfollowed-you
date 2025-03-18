'use server'

import { db } from '@/server/db'
import { folders, labels, folderLabels } from '@/server/db/schema'
import { eq, and } from 'drizzle-orm'
import { getCurrentUser } from '@/modules/auth/api/queries/auth'

export async function getFolders() {
    try {
        const user = await getCurrentUser()
        if (!user) throw new Error('Not authenticated')

        const userFolders = await db.query.folders.findMany({
            where: eq(folders.userId, user.id),
            with: {
                labels: {
                    with: {
                        label: true
                    }
                }
            },
            orderBy: folders.createdAt
        })

        return { success: true, folders: userFolders }
    } catch (error) {
        console.error('Get folders error:', error)
        return { error: 'Failed to get folders' }
    }
}

export async function getFolder(folderId: string) {
    try {
        const user = await getCurrentUser()
        if (!user) throw new Error('Not authenticated')

        const folder = await db.query.folders.findFirst({
            where: and(
                eq(folders.id, folderId),
                eq(folders.userId, user.id)
            ),
            with: {
                labels: {
                    with: {
                        label: true
                    }
                }
            }
        })

        if (!folder) {
            return { error: 'Folder not found' }
        }

        return { success: true, folder }
    } catch (error) {
        console.error('Get folder error:', error)
        return { error: 'Failed to get folder' }
    }
} 