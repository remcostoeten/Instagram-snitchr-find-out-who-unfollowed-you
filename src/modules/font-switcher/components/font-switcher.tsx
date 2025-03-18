'use client'

import { useFontStore } from '../state/use-font-store'
import { FluidDropdown } from '@/shared/components/custom/fluid-dropdown/fluid-dropdown'
import { Type, Terminal, Brush, Pen } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useMemo } from 'react'

const iconMap = {
    sans: Type,
    monospace: Terminal,
    display: Brush,
    serif: Pen,
}

export function FontSwitcher() {
    const { fonts, selectedFontId, setSelectedFont } = useFontStore()
    const { theme = 'dark' } = useTheme()

    const categories = useMemo(() => {
        return fonts.map(font => ({
            id: font.id,
            label: font.name,
            icon: font.category as keyof typeof iconMap,
            color: getColorForCategory(font.category),
        }))
    }, [fonts])

    const selectedCategory = useMemo(() => {
        return categories.find(cat => cat.id === selectedFontId) || categories[0]
    }, [categories, selectedFontId])

    function getColorForCategory(category: string): string {
        const colors = {
            sans: '#4ECDC4',
            serif: '#FF6B6B',
            display: '#A06CD5',
            monospace: '#45B7D1',
        }
        return colors[category as keyof typeof colors] || '#F9C74F'
    }

    return (
        <div className="w-full max-w-xs">
            <FluidDropdown
                categories={categories}
                theme={theme as 'dark' | 'light'}
                allowNewItems={false}
                animation={{
                    duration: 300,
                    curve: 'easeInOut',
                    staggerDelay: 50,
                    bounce: 0.15,
                }}
                onSelect={(categoryId) => {
                    setSelectedFont(categoryId)
                }}
            />
        </div>
    )
} 