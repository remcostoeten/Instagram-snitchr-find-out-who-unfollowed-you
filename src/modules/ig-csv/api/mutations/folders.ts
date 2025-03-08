import { useCSVStore } from "../../store/store"

export function createFolder(name: string): string {
  return useCSVStore.getState().addFolder(name)
}

export function updateFolder(id: string, name: string): void {
  useCSVStore.getState().updateFolder(id, name)
}

export function deleteFolder(id: string): void {
  useCSVStore.getState().deleteFolder(id)
}

export function useCreateFolder() {
  return useCSVStore((state) => state.addFolder)
}

export function useUpdateFolder() {
  return useCSVStore((state) => state.updateFolder)
}

export function useDeleteFolder() {
  return useCSVStore((state) => state.deleteFolder)
}

