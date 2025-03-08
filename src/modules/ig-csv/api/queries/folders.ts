import { useCSVStore } from "../../store/store"
import type { Folder } from "../../models/schema"

export function getFolders(): Folder[] {
  return useCSVStore.getState().folders
}

export function getFolder(id: string): Folder | undefined {
  return useCSVStore.getState().folders.find((folder) => folder.id === id)
}

export function useGetFolders() {
  return useCSVStore((state) => state.folders)
}

export function useGetFolder(id: string) {
  return useCSVStore((state) => state.folders.find((folder) => folder.id === id))
}

