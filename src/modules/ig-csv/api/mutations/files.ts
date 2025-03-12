import { useCSVStore } from "../../store/store"
import type { CSVFile } from "../../models/schema"
import { toast } from "sonner"

export function createFile(file: Omit<CSVFile, "id" | "createdAt" | "updatedAt">): string {
  return useCSVStore.getState().addFile(file)
}

export function updateFile(id: string, updates: Partial<Omit<CSVFile, "id" | "createdAt" | "updatedAt">>): void {
  useCSVStore.getState().updateFile(id, updates)
}

export function deleteFile(id: string): void {
  useCSVStore.getState().deleteFile(id)
}

export function moveFileToFolder(fileId: string, folderId: string | null): void {
  useCSVStore.getState().moveFileToFolder(fileId, folderId)
}

export function addLabelToFile(fileId: string, labelId: string): void {
  useCSVStore.getState().addLabelToFile(fileId, labelId)
}

export function removeLabelFromFile(fileId: string, labelId: string): void {
  useCSVStore.getState().removeLabelFromFile(fileId, labelId)
}

export function useCreateFile() {
  return useCSVStore((state) => state.addFile)
}

export function useUpdateFile() {
  return useCSVStore((state) => state.updateFile)
}

export function useDeleteFile() {
  return useCSVStore((state) => state.deleteFile)
}

export function useMoveFileToFolder() {
  return useCSVStore((state) => state.moveFileToFolder)
}

export function useAddLabelToFile() {
  return useCSVStore((state) => state.addLabelToFile)
}

export function useRemoveLabelFromFile() {
  return useCSVStore((state) => state.removeLabelFromFile)
}

export function useRenameFile() {
  const updateFile = useCSVStore((state) => state.updateFile)

  return (fileId: string, newName: string) => {
    try {
      updateFile(fileId, { name: newName })
      toast.success("File renamed", {
        description: `File has been renamed to "${newName}"`
      })
    } catch (error) {
      toast.error("Failed to rename file", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      })
    }
  }
}

