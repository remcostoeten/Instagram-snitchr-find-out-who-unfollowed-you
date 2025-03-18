'use server'

import { db } from '@/server/db'
import { folders, folderLabels } from '@/server/db/schema'
import { eq, and } from 'drizzle-orm'
import { getCurrentUser } from '@/modules/auth/api/queries/auth'
import { createFolderSchema, updateFolderSchema } from '../../models/z.folder'
import { revalidatePath } from 'next/cache'

export async function createFolder(input: FormData) {
    try {
        const user = await getCurrentUser()
        if (!user) throw new Error('Not authenticated')

        const validatedFields = createFolderSchema.safeParse({
            name: input.get('name'),
            description: input.get('description'),
            color: input.get('color'),
            icon: input.get('icon'),
            labelIds: input.getAll('labelIds'),
        })

        if (!validatedFields.success) {
            return { error: 'Invalid fields' }
        }

        const { name, description, color, icon, labelIds } = validatedFields.data

        const [folder] = await db.insert(folders)
            .values({
                userId: user.id,
                name,
                description: description || null,
                color: color || '#94a3b8',
                icon: icon || 'folder',
            })
            .returning()

        if (labelIds?.length) {
            await db.insert(folderLabels)
                .values(
                    labelIds.map(labelId => ({
                        folderId: folder.id,
                        labelId,
                    }))
                )
        }

        revalidatePath('/folders')
        return { success: true, folder }
    } catch (error) {
        console.error('Create folder error:', error)
        return { error: 'Failed to create folder' }
    }
}

export async function updateFolder(folderId: string, input: FormData) {
    try {
        const user = await getCurrentUser()
        if (!user) throw new Error('Not authenticated')

        const validatedFields = updateFolderSchema.safeParse({
            name: input.get('name'),
            description: input.get('description'),
            color: input.get('color'),
            icon: input.get('icon'),
            isArchived: input.get('isArchived') === 'true',
            labelIds: input.getAll('labelIds'),
        })

        if (!validatedFields.success) {
            return { error: 'Invalid fields' }
        }

        const { labelIds, ...updateData } = validatedFields.data

        // Update folder
        const [folder] = await db.update(folders)
            .set(updateData)
            .where(
                and(
                    eq(folders.id, folderId),
                    eq(folders.userId, user.id)
                )
            )
            .returning()

        if (!folder) {
            return { error: 'Folder not found' }
        }

        // Update labels if provided
        if (labelIds) {
            // Remove existing labels
            await db.delete(folderLabels)
                .where(eq(folderLabels.folderId, folderId))

            // Add new labels
            if (labelIds.length) {
                await db.insert(folderLabels)
                    .values(
                        labelIds.map(labelId => ({
                            folderId: folder.id,
                            labelId,
                        }))
                    )
            }
        }

        revalidatePath('/folders')
        return { success: true, folder }
    } catch (error) {
        console.error('Update folder error:', error)
        return { error: 'Failed to update folder' }
    }
}

export async function deleteFolder(folderId: string) {
    try {
        const user = await getCurrentUser()
        if (!user) throw new Error('Not authenticated')

        await db.delete(folders)
            .where(
                and(
                    eq(folders.id, folderId),
                    eq(folders.userId, user.id)
                )
            )

        revalidatePath('/folders')
        return { success: true }
    } catch (error) {
        console.error('Delete folder error:', error)
        return { error: 'Failed to delete folder' }
    }
} 