import { create } from "zustand"
import { persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"
import type { CSVFile, StoreState } from "../models/schema"

interface CSVStore extends StoreState {
  // Folder operations
  addFolder: (name: string) => string
  updateFolder: (id: string, name: string) => void
  deleteFolder: (id: string) => void

  // Label operations
  addLabel: (name: string, color?: string) => string
  updateLabel: (id: string, name: string, color?: string) => void
  deleteLabel: (id: string) => void

  // File operations
  addFile: (file: Omit<CSVFile, "id" | "createdAt" | "updatedAt">) => string
  updateFile: (id: string, updates: Partial<Omit<CSVFile, "id" | "createdAt" | "updatedAt">>) => void
  deleteFile: (id: string) => void

  // File organization
  moveFileToFolder: (fileId: string, folderId: string | null) => void
  addLabelToFile: (fileId: string, labelId: string) => void
  removeLabelFromFile: (fileId: string, labelId: string) => void
}

export const useCSVStore = create<CSVStore>()(
  persist(
    immer((set) => ({
      folders: [],
      labels: [],
      files: [],

      // Folder operations
      addFolder: (name) => {
        const id = Date.now().toString()
        const now = new Date()

        set((state) => {
          state.folders.push({
            id,
            name,
            createdAt: now,
            updatedAt: now,
          })
        })

        return id
      },

      updateFolder: (id, name) => {
        set((state) => {
          const folder = state.folders.find((f) => f.id === id)
          if (folder) {
            folder.name = name
            folder.updatedAt = new Date()
          }
        })
      },

      deleteFolder: (id) => {
        set((state) => {
          // Remove folder
          state.folders = state.folders.filter((f) => f.id !== id)

          // Update files that were in this folder
          state.files.forEach((file) => {
            if (file.folderId === id) {
              file.folderId = null
            }
          })
        })
      },

      // Label operations
      addLabel: (name, color) => {
        const id = Date.now().toString()

        set((state) => {
          state.labels.push({
            id,
            name,
            color,
          })
        })

        return id
      },

      updateLabel: (id, name, color) => {
        set((state) => {
          const label = state.labels.find((l) => l.id === id)
          if (label) {
            label.name = name
            if (color) label.color = color
          }
        })
      },

      deleteLabel: (id) => {
        set((state) => {
          // Remove label
          state.labels = state.labels.filter((l) => l.id !== id)

          // Remove label from all files
          state.files.forEach((file) => {
            file.labels = file.labels.filter((labelId) => labelId !== id)
          })
        })
      },

      // File operations
      addFile: (file) => {
        const id = Date.now().toString()
        const now = new Date()

        set((state) => {
          state.files.push({
            ...file,
            id,
            createdAt: now,
            updatedAt: now,
          })
        })

        return id
      },

      updateFile: (id, updates) => {
        set((state) => {
          const file = state.files.find((f) => f.id === id)
          if (file) {
            Object.assign(file, updates)
            file.updatedAt = new Date()
          }
        })
      },

      deleteFile: (id) => {
        set((state) => {
          state.files = state.files.filter((f) => f.id !== id)
        })
      },

      // File organization
      moveFileToFolder: (fileId, folderId) => {
        set((state) => {
          const file = state.files.find((f) => f.id === fileId)
          if (file) {
            file.folderId = folderId
            file.updatedAt = new Date()
          }
        })
      },

      addLabelToFile: (fileId, labelId) => {
        set((state) => {
          const file = state.files.find((f) => f.id === fileId)
          if (file && !file.labels.includes(labelId)) {
            file.labels.push(labelId)
            file.updatedAt = new Date()
          }
        })
      },

      removeLabelFromFile: (fileId, labelId) => {
        set((state) => {
          const file = state.files.find((f) => f.id === fileId)
          if (file) {
            file.labels = file.labels.filter((id) => id !== labelId)
            file.updatedAt = new Date()
          }
        })
      },
    })),
    {
      name: "csv-storage",
    },
  ),
)

