'use server'

import { db } from '@/server/db'
import { files as filesTable } from '@/server/db/schema'
import { getCurrentUser } from '@/modules/auth/api/queries/auth'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'

export async function createFile(input: FormData) {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error('Not authenticated')

    const name = input.get('name') as string
    const originalName = input.get('originalName') as string
    const data = JSON.parse(input.get('data') as string)
    const columns = JSON.parse(input.get('columns') as string)
    const folderId = input.get('folderId') as string | null
    const labels = JSON.parse(input.get('labels') as string)

    const [file] = await db.insert(filesTable)
      .values({
        userId: user.id,
        name,
        originalName,
        data,
        columns,
        folderId,
        labels,
      })
      .returning()

    revalidatePath('/files')
    return { success: true, file }
  } catch (error) {
    console.error('Create file error:', error)
    return { error: 'Failed to create file' }
  }
}

export async function updateFile(fileId: string, input: FormData) {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error('Not authenticated')

    const updates = {
      name: input.get('name') as string,
      data: JSON.parse(input.get('data') as string),
      columns: JSON.parse(input.get('columns') as string),
      folderId: input.get('folderId') as string | null,
      labels: JSON.parse(input.get('labels') as string),
    }

    const [file] = await db.update(filesTable)
      .set(updates)
      .where(eq(filesTable.id, fileId))
      .returning()

    revalidatePath('/files')
    return { success: true, file }
  } catch (error) {
    console.error('Update file error:', error)
    return { error: 'Failed to update file' }
  }
}

export async function deleteFile(fileId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error('Not authenticated')

    await db.delete(filesTable)
      .where(eq(filesTable.id, fileId))

    revalidatePath('/files')
    return { success: true }
  } catch (error) {
    console.error('Delete file error:', error)
    return { error: 'Failed to delete file' }
  }
}

export async function moveFileToFolder(fileId: string, folderId: string | null) {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error('Not authenticated')

    const [file] = await db.update(filesTable)
      .set({ folderId })
      .where(eq(filesTable.id, fileId))
      .returning()

    revalidatePath('/files')
    return { success: true, file }
  } catch (error) {
    console.error('Move file error:', error)
    return { error: 'Failed to move file' }
  }
}

export async function addLabelToFile(fileId: string, labelId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error('Not authenticated')

    const file = await db.query.files.findFirst({
      where: eq(filesTable.id, fileId)
    })

    if (!file) throw new Error('File not found')

    const [updatedFile] = await db.update(filesTable)
      .set({
        labels: [...file.labels, labelId]
      })
      .where(eq(filesTable.id, fileId))
      .returning()

    revalidatePath('/files')
    return { success: true, file: updatedFile }
  } catch (error) {
    console.error('Add label error:', error)
    return { error: 'Failed to add label' }
  }
}

export async function removeLabelFromFile(fileId: string, labelId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error('Not authenticated')

    const file = await db.query.files.findFirst({
      where: eq(filesTable.id, fileId)
    })

    if (!file) throw new Error('File not found')

    const [updatedFile] = await db.update(filesTable)
      .set({
        labels: file.labels.filter(id => id !== labelId)
      })
      .where(eq(filesTable.id, fileId))
      .returning()

    revalidatePath('/files')
    return { success: true, file: updatedFile }
  } catch (error) {
    console.error('Remove label error:', error)
    return { error: 'Failed to remove label' }
  }
}

