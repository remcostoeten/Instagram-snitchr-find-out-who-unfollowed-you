"use client"

import * as React from "react"
import { motion, AnimatePresence, MotionConfig } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import * as Icons from "lucide-react"
import { Input } from "@/components/ui/input"
import { themes, type ThemePreset } from "./dropdown-themes"
import { type AnimationConfig, defaultAnimationConfig, easingFunctions } from "./types"
import { useClickAway } from "../../../hooks/use-click-away"
import type { LucideIcon } from 'lucide-react'

interface Category {
    id: string
    label: string
    icon: keyof typeof Icons
    color: string
}

interface FluidDropdownProps {
    categories: Category[]
    theme?: "dark" | "light"
    themePreset?: ThemePreset
    setTheme?: (theme: "dark" | "light") => void
    allowNewItems?: boolean
    onNewItemSubmit?: (newItem: string) => void
    animation?: AnimationConfig
}

function IconWrapper({
    icon,
    isHovered,
    color,
    duration,
}: { icon: string; isHovered: boolean; color: string; duration: number }) {
    const Icon = Icons[icon as keyof typeof Icons] as LucideIcon
    return (
        <motion.div
            className="w-4 h-4 mr-2 relative"
            initial={false}
            animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
            transition={{ duration: duration / 1000 }}
        >
            <Icon className="w-4 h-4" />
            {isHovered && (
                <motion.div
                    className="absolute inset-0"
                    style={{ color }}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: duration / 1000 }}
                >
                    <Icon className="w-4 h-4" strokeWidth={2} />
                </motion.div>
            )}
        </motion.div>
    )
}

export function FluidDropdown({
    categories,
    theme = "dark",
    themePreset = "system",
    setTheme,
    allowNewItems = false,
    onNewItemSubmit,
    animation = defaultAnimationConfig,
}: FluidDropdownProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [selectedCategory, setSelectedCategory] = React.useState<Category>(categories[0])
    const [hoveredCategory, setHoveredCategory] = React.useState<string | null>(null)
    const [newItemValue, setNewItemValue] = React.useState("")
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const dropdownRef = React.useRef<HTMLDivElement>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)

    const currentTheme = themes[themePreset][theme]
    const duration = animation.duration || defaultAnimationConfig.duration
    const curve = animation.curve || defaultAnimationConfig.curve
    const staggerDelay = animation.staggerDelay || defaultAnimationConfig.staggerDelay
    const bounce = animation.bounce || defaultAnimationConfig.bounce

    const bezierCurve = animation.customCurve || (curve === "custom" ? easingFunctions.easeInOut : easingFunctions[curve])

    useClickAway(dropdownRef, () => setIsOpen(false))

    async function handleNewItemSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (newItemValue.trim() !== "" && !isSubmitting) {
            setIsSubmitting(true)
            await onNewItemSubmit?.(newItemValue.trim())
            setNewItemValue("")
            setIsSubmitting(false)
        }
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Escape") {
            setIsOpen(false)
        } else if (e.key === "Enter" && allowNewItems && newItemValue.trim() !== "") {
            e.preventDefault()
            handleNewItemSubmit(e)
        }
    }

    return (
        <MotionConfig reducedMotion="user">
            <div className={cn("min-h-screen w-full flex flex-col items-center justify-center", currentTheme.bg)}>
                <div className="w-full max-w-md px-4">
                    <Button
                        onClick={() => setTheme?.(theme === "dark" ? "light" : "dark")}
                        className={cn(
                            "mb-4 w-full",
                            theme === "dark" ? "bg-neutral-950 text-neutral-400 border-neutral-800" : "bg-black text-white",
                        )}
                        style={{
                            transition: `all ${duration}ms cubic-bezier(${bezierCurve.join(",")})`,
                        }}
                    >
                        {theme === "dark" ? <Icons.Sun className="w-4 h-4 mr-2" /> : <Icons.Moon className="w-4 h-4 mr-2" />}
                        Toggle Theme
                    </Button>
                    <div className="w-full relative" style={{ height: "40px" }} ref={dropdownRef}>
                        <Button
                            variant="outline"
                            onClick={() => setIsOpen(!isOpen)}
                            className={cn(
                                "w-full justify-between",
                                "focus:ring-0",
                                "border",
                                "border-neutral-800",
                                "bg-neutral-950",
                                "text-neutral-400",
                                isOpen ? "text-neutral-200" : "hover:text-neutral-200",
                            )}
                            style={{
                                transition: `all ${duration}ms cubic-bezier(${bezierCurve.join(",")})`,
                            }}
                            aria-expanded={isOpen}
                            aria-haspopup="true"
                        >
                            <span className="flex items-center">
                                <IconWrapper
                                    icon={selectedCategory.icon}
                                    isHovered={false}
                                    color={selectedCategory.color}
                                    duration={duration}
                                />
                                <span>{selectedCategory.label}</span>
                            </span>
                            <motion.div
                                animate={{ rotate: isOpen ? 180 : 0 }}
                                transition={{
                                    duration: duration / 1000,
                                    ease: bezierCurve,
                                }}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "20px",
                                    height: "20px",
                                }}
                            >
                                <ChevronDown className="w-4 h-4" />
                            </motion.div>
                        </Button>

                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            duration: duration / 1000,
                                            ease: bezierCurve,
                                        },
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: -10,
                                        transition: {
                                            duration: duration / 1000,
                                            ease: bezierCurve,
                                        },
                                    }}
                                    className="absolute left-0 right-0 top-full mt-2 z-50"
                                    onKeyDown={handleKeyDown}
                                >
                                    <motion.div
                                        className={cn("absolute w-full rounded-lg border border-neutral-800", "p-1", "bg-neutral-950")}
                                        initial={{ borderRadius: 8 }}
                                        animate={{
                                            borderRadius: 12,
                                            transition: {
                                                duration: duration / 1000,
                                                ease: bezierCurve,
                                            },
                                        }}
                                        style={{ transformOrigin: "top" }}
                                    >
                                        <motion.div
                                            className="py-1 relative"
                                            initial="hidden"
                                            animate="visible"
                                            variants={{
                                                hidden: { opacity: 0 },
                                                visible: {
                                                    opacity: 1,
                                                    transition: {
                                                        staggerChildren: staggerDelay / 1000,
                                                    },
                                                },
                                            }}
                                        >
                                            <motion.div
                                                layoutId="hover-highlight"
                                                className="absolute inset-x-1 rounded-md bg-neutral-800"
                                                animate={{
                                                    y: categories.findIndex((c) => (hoveredCategory || selectedCategory.id) === c.id) * 36,
                                                    height: 36,
                                                }}
                                                transition={{
                                                    type: "spring",
                                                    bounce,
                                                    duration: duration / 1000,
                                                }}
                                            />
                                            {categories.map((category) => (
                                                <motion.button
                                                    key={category.id}
                                                    onClick={() => {
                                                        setSelectedCategory(category)
                                                        setIsOpen(false)
                                                    }}
                                                    onMouseEnter={() => setHoveredCategory(category.id)}
                                                    onMouseLeave={() => setHoveredCategory(null)}
                                                    className={cn(
                                                        "relative flex w-full items-center px-4 py-2 text-sm rounded-md",
                                                        "focus:outline-none",
                                                        selectedCategory.id === category.id || hoveredCategory === category.id
                                                            ? "text-neutral-200"
                                                            : "text-neutral-500",
                                                    )}
                                                    style={{
                                                        transition: `color ${duration}ms cubic-bezier(${bezierCurve.join(",")})`,
                                                    }}
                                                    variants={{
                                                        hidden: { opacity: 0, y: -10 },
                                                        visible: {
                                                            opacity: 1,
                                                            y: 0,
                                                            transition: {
                                                                duration: duration / 1000,
                                                                ease: bezierCurve,
                                                            },
                                                        },
                                                    }}
                                                >
                                                    <IconWrapper
                                                        icon={category.icon}
                                                        isHovered={hoveredCategory === category.id}
                                                        color={category.color}
                                                        duration={duration}
                                                    />
                                                    <span>{category.label}</span>
                                                </motion.button>
                                            ))}
                                            {allowNewItems && (
                                                <form onSubmit={handleNewItemSubmit} className="px-2 py-2">
                                                    <Input
                                                        ref={inputRef}
                                                        type="text"
                                                        placeholder="Add new item..."
                                                        value={newItemValue}
                                                        onChange={(e) => setNewItemValue(e.target.value)}
                                                        className={cn(
                                                            "w-full text-sm",
                                                            "focus:ring-0",
                                                            "bg-neutral-950",
                                                            "text-neutral-400",
                                                            "border-neutral-800",
                                                            "placeholder:text-neutral-500",
                                                        )}
                                                        style={{
                                                            transition: `all ${duration}ms cubic-bezier(${bezierCurve.join(",")})`,
                                                        }}
                                                        disabled={isSubmitting}
                                                    />
                                                </form>
                                            )}
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </MotionConfig>
    )
}

