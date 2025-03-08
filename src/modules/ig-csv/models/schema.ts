import { z } from "zod"

// Base schemas
export const folderSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const labelSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string().optional(),
})

export const csvFileSchema = z.object({
  id: z.string(),
  name: z.string(),
  originalName: z.string(),
  folderId: z.string().nullable(),
  labels: z.array(z.string()), // Array of label IDs
  createdAt: z.date(),
  updatedAt: z.date(),
  data: z.array(z.record(z.string(), z.string().optional())),
  columns: z.array(z.string()),
})

// Types derived from schemas
export type Folder = z.infer<typeof folderSchema>
export type Label = z.infer<typeof labelSchema>
export type CSVFile = z.infer<typeof csvFileSchema>

// Store state schema
export const storeSchema = z.object({
  folders: z.array(folderSchema),
  labels: z.array(labelSchema),
  files: z.array(csvFileSchema),
})

export type StoreState = z.infer<typeof storeSchema>

