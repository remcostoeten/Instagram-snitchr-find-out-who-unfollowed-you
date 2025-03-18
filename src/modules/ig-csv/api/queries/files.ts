'use server'

import { db } from '@/server/db'
import { files as filesTable } from '@/server/db/schema'
import { getCurrentUser } from '@/modules/auth/api/queries/auth'
import { eq, isNull, sql, and } from 'drizzle-orm'
import type { CSVFile } from "../../models/schema"

interface FileResponse<T> {
  success: boolean
  error?: string
  data?: T
}

export async function getFiles() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    const files = await db.query.files.findMany({
      where: eq(filesTable.userId, user.id),
      orderBy: (files) => [files.createdAt],
      with: {
        folder: true,
      }
    })

    return {
      success: true,
      data: files.map(file => ({
        ...file,
        data: file.data as Record<string, string | undefined>[],
        columns: file.columns as string[],
        labels: file.labels as string[]
      }))
    }
  } catch (error) {
    console.error('Get files error:', error)
    return { success: false, error: 'Failed to fetch files' }
  }
}

export async function getFile(fileId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    const file = await db.query.files.findFirst({
      where: eq(filesTable.id, fileId),
      with: {
        folder: true,
      }
    })

    if (!file) {
      return { success: false, error: 'File not found' }
    }

    // Verify ownership
    if (file.userId !== user.id) {
      return { success: false, error: 'Not authorized' }
    }

    return { success: true, file }
  } catch (error) {
    console.error('Get file error:', error)
    return { success: false, error: 'Failed to fetch file' }
  }
}

export async function getFilesByFolder(folderId: string | null): Promise<FileResponse<CSVFile[]>> {
  const user = await getCurrentUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const files = await db.query.files.findMany({
    where: folderId ? eq(filesTable.folderId, folderId) : isNull(filesTable.folderId),
    with: { folder: true },
  })

  return {
    success: true,
    data: files.map(file => ({
      ...file,
      data: file.data as Record<string, string | undefined>[],
      columns: file.columns as string[],
      labels: file.labels as string[]
    }))
  }
}

export async function getFilesByLabel(labelId: string): Promise<FileResponse<CSVFile[]>> {
  const user = await getCurrentUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const files = await db.query.files.findMany({
    where: and(
      eq(filesTable.userId, user.id),
      sql`${filesTable.labels}::jsonb ? ${labelId}`
    ),
    with: { folder: true },
  })

  return {
    success: true,
    data: files.map(file => ({
      ...file,
      data: file.data as Record<string, string | undefined>[],
      columns: file.columns as string[],
      labels: file.labels as string[]
    }))
  }
}
