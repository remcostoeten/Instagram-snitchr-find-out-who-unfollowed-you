'use server'

import { db } from '@/server/db'
import { labels, folderLabels } from '@/server/db/schema'
import { eq, and } from 'drizzle-orm'
import { getCurrentUser } from '@/modules/auth/api/queries/auth'
import { createLabelSchema, updateLabelSchema } from '../../models/z.label'
import { revalidatePath } from 'next/cache'

export async function createLabel(input: FormData) {
    try {
        const user = await getCurrentUser()
        if (!user) throw new Error('Not authenticated')

        const validatedFields = createLabelSchema.safeParse({
            name: input.get('name'),
            color: input.get('color'),
            icon: input.get('icon'),
        })

        if (!validatedFields.success) {
            return { error: 'Invalid fields' }
        }

        const { name, color, icon } = validatedFields.data

        const [label] = await db.insert(labels)
            .values({
                userId: user.id,
                name,
                color: color || '#94a3b8',
                icon: icon || 'tag',
            })
            .returning()

        revalidatePath('/folders')
        return { success: true, label }
    } catch (error) {
        console.error('Create label error:', error)
        return { error: 'Failed to create label' }
    }
}

export async function updateLabel(labelId: string, input: FormData) {
    try {
        const user = await getCurrentUser()
        if (!user) throw new Error('Not authenticated')

        const validatedFields = updateLabelSchema.safeParse({
            name: input.get('name'),
            color: input.get('color'),
            icon: input.get('icon'),
        })

        if (!validatedFields.success) {
            return { error: 'Invalid fields' }
        }

        const [label] = await db.update(labels)
            .set(validatedFields.data)
            .where(
                and(
                    eq(labels.id, labelId),
                    eq(labels.userId, user.id)
                )
            )
            .returning()

        if (!label) {
            return { error: 'Label not found' }
        }

        revalidatePath('/folders')
        return { success: true, label }
    } catch (error) {
        console.error('Update label error:', error)
        return { error: 'Failed to update label' }
    }
}

export async function deleteLabel(labelId: string) {
    try {
        const user = await getCurrentUser()
        if (!user) throw new Error('Not authenticated')

        // First delete all folder-label associations
        await db.delete(folderLabels)
            .where(eq(folderLabels.labelId, labelId))

        // Then delete the label
        await db.delete(labels)
            .where(
                and(
                    eq(labels.id, labelId),
                    eq(labels.userId, user.id)
                )
            )

        revalidatePath('/folders')
        return { success: true }
    } catch (error) {
        console.error('Delete label error:', error)
        return { error: 'Failed to delete label' }
    }
} 