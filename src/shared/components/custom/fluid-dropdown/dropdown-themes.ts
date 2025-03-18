export type ThemeColor = {
    bg: string
    bgHover: string
    text: string
    textMuted: string
    border: string
    borderHover: string
    focus: string
    accent: string
}

export type ThemePreset = "system" | "catppuccin" | "monochrome"

export const themes: Record<ThemePreset, { light: ThemeColor; dark: ThemeColor }> = {
    system: {
        light: {
            bg: "bg-white",
            bgHover: "hover:bg-neutral-100",
            text: "text-neutral-900",
            textMuted: "text-neutral-500",
            border: "border-neutral-200",
            borderHover: "hover:border-neutral-300",
            focus: "focus:ring-neutral-200",
            accent: "bg-neutral-900",
        },
        dark: {
            bg: "bg-neutral-900",
            bgHover: "hover:bg-neutral-800",
            text: "text-neutral-400",
            textMuted: "text-neutral-500",
            border: "border-neutral-800",
            borderHover: "hover:border-neutral-700",
            focus: "focus:ring-neutral-800",
            accent: "bg-neutral-700",
        },
    },
    catppuccin: {
        light: {
            bg: "bg-[#EFF1F5]",
            bgHover: "hover:bg-[#DCE0E8]",
            text: "text-[#4C4F69]",
            textMuted: "text-[#9CA0B0]",
            border: "border-[#DCE0E8]",
            borderHover: "hover:border-[#BCC0CC]",
            focus: "focus:ring-[#DCE0E8]",
            accent: "bg-[#7287FD]",
        },
        dark: {
            bg: "bg-[#1E1E2E]",
            bgHover: "hover:bg-[#313244]",
            text: "text-[#CDD6F4]",
            textMuted: "text-[#7F849C]",
            border: "border-[#313244]",
            borderHover: "hover:border-[#45475A]",
            focus: "focus:ring-[#313244]",
            accent: "bg-[#89B4FA]",
        },
    },
    monochrome: {
        light: {
            bg: "bg-white",
            bgHover: "hover:bg-gray-50",
            text: "text-black",
            textMuted: "text-gray-500",
            border: "border-gray-200",
            borderHover: "hover:border-gray-300",
            focus: "focus:ring-gray-100",
            accent: "bg-black",
        },
        dark: {
            bg: "bg-black",
            bgHover: "hover:bg-gray-900",
            text: "text-white",
            textMuted: "text-gray-400",
            border: "border-gray-800",
            borderHover: "hover:border-gray-700",
            focus: "focus:ring-gray-800",
            accent: "bg-white",
        },
    },
}

export type AnimationSpeed = "slow" | "normal" | "fast"

export const animationSpeeds: Record<AnimationSpeed, number> = {
    slow: 0.6,
    normal: 0.3,
    fast: 0.15,
}

