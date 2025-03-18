'use client'

import { useEffect } from 'react'
import { useFontStore } from '../state/use-font-store'
import * as fonts from '@/lib/fonts'

export function useFontLoader() {
    const { selectedFontId, fonts: availableFonts, setError } = useFontStore()

    useEffect(() => {
        const selectedFont = availableFonts.find(f => f.id === selectedFontId)
        if (!selectedFont) return

        try {
            // Apply the font to the document
            document.documentElement.style.setProperty('--font-family', `var(${selectedFont.variable})`)
        } catch (error) {
            console.error('Error applying font:', error)
            setError(error instanceof Error ? error.message : 'Failed to apply font')
        }
    }, [selectedFontId, availableFonts, setError])
} 