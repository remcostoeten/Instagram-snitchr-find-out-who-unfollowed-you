import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PillState {
    hiddenPills: string[]
    isPillVisible: (id: string) => boolean
    showPill: (id: string) => void
    hidePill: (id: string) => void
}

export const usePillStore = create<PillState>()(
    persist(
        (set, get) => ({
            hiddenPills: [],
            isPillVisible: (id) => !get().hiddenPills.includes(id),
            showPill: (id) =>
                set((state) => ({
                    hiddenPills: state.hiddenPills.filter((pillId) => pillId !== id),
                })),
            hidePill: (id) =>
                set((state) => ({
                    hiddenPills: [...state.hiddenPills, id],
                })),
        }),
        {
            name: 'pill-storage',
        }
    )
) 