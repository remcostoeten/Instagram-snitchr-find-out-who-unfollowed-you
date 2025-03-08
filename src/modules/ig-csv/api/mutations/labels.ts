import { useCSVStore } from "../../store/store"

export function createLabel(name: string, color?: string): string {
  return useCSVStore.getState().addLabel(name, color)
}

export function updateLabel(id: string, name: string, color?: string): void {
  useCSVStore.getState().updateLabel(id, name, color)
}

export function deleteLabel(id: string): void {
  useCSVStore.getState().deleteLabel(id)
}

export function useCreateLabel() {
  return useCSVStore((state) => state.addLabel)
}

export function useUpdateLabel() {
  return useCSVStore((state) => state.updateLabel)
}

export function useDeleteLabel() {
  return useCSVStore((state) => state.deleteLabel)
}

