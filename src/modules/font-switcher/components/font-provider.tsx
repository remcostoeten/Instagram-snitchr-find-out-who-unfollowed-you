'use client'

import { type ReactNode } from 'react'
import { useFontLoader } from '../hooks/use-font-loader'

interface FontProviderProps {
    children: ReactNode
}

export function FontProvider({ children }: FontProviderProps) {
    useFontLoader()

    return <>{children}</>
} 