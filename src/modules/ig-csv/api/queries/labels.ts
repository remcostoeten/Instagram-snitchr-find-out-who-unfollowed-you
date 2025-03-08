import { useCSVStore } from "../../store/store"
import type { Label } from "../../models/schema"

export function getLabels(): Label[] {
  return useCSVStore.getState().labels
}

export function getLabel(id: string): Label | undefined {
  return useCSVStore.getState().labels.find((label) => label.id === id)
}

export function useGetLabels() {
  return useCSVStore((state) => state.labels)
}

export function useGetLabel(id: string) {
  return useCSVStore((state) => state.labels.find((label) => label.id === id))
}

