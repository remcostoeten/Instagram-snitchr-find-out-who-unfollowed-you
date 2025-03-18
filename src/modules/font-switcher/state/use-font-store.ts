'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Font } from '../models/z.font'

interface FontState {
    fonts: Font[]
    selectedFontId: string | null
    isLoading: boolean
    error: string | null
    setSelectedFont: (fontId: string) => void
    setFonts: (fonts: Font[]) => void
    setError: (error: string | null) => void
    setLoading: (isLoading: boolean) => void
}

const defaultFonts: Font[] = [
    {
        id: 'space-grotesk',
        name: 'Space Grotesk',
        variable: '--font-space-grotesk',
        category: 'sans',
    },
    {
        id: 'source-sans',
        name: 'Source Sans 3',
        variable: '--font-source-sans',
        category: 'sans',
    },
    {
        id: 'roboto-mono',
        name: 'Roboto Mono',
        variable: '--font-roboto-mono',
        category: 'monospace',
    },
    {
        id: 'inter',
        name: 'Inter',
        variable: '--font-inter',
        category: 'sans',
    },
    {
        id: 'cal-sans',
        name: 'Cal Sans',
        variable: '--font-cal',
        category: 'display',
    }
]

export const useFontStore = create<FontState>()(
    persist(
        (set) => ({
            fonts: defaultFonts,
            selectedFontId: defaultFonts[0].id,
            isLoading: false,
            error: null,
            setSelectedFont: (fontId: string) => set({ selectedFontId: fontId }),
            setFonts: (fonts: Font[]) => set({ fonts }),
            setError: (error: string | null) => set({ error }),
            setLoading: (isLoading: boolean) => set({ isLoading }),
        }),
        {
            name: 'font-preferences',
            partialize: (state) => ({ selectedFontId: state.selectedFontId }),
        }
    )
) 