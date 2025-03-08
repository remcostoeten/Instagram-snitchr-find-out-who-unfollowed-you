import { useCSVStore } from "../../store/store"
import type { CSVFile } from "../../models/schema"

export function getFiles(): CSVFile[] {
  return useCSVStore.getState().files
}

export function getFile(id: string): CSVFile | undefined {
  return useCSVStore.getState().files.find((file) => file.id === id)
}

export function getFilesByFolder(folderId: string | null): CSVFile[] {
  return useCSVStore.getState().files.filter((file) => file.folderId === folderId)
}

export function getFilesByLabel(labelId: string): CSVFile[] {
  return useCSVStore.getState().files.filter((file) => file.labels.includes(labelId))
}

export function useGetFiles() {
  return useCSVStore((state) => state.files)
}

export function useGetFile(id: string) {
  return useCSVStore((state) => state.files.find((file) => file.id === id))
}

export function useGetFilesByFolder(folderId: string | null) {
  return useCSVStore((state) => state.files.filter((file) => file.folderId === folderId))
}

export function useGetFilesByLabel(labelId: string) {
  return useCSVStore((state) => state.files.filter((file) => file.labels.includes(labelId)))
}

