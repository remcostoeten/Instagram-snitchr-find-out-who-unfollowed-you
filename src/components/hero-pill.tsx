"use client"

import { useRef, useEffect } from "react"
import { motion, useAnimation, type PanInfo, useMotionValue, useTransform, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { usePillStore } from "@/lib/store"
import { X } from "lucide-react"

interface HeroPillProps {
    id: string
    href: string
    label: string
    announcement?: string
    className?: string
    isExternal?: boolean
    autoShowDelay?: number
}

export function HeroPill({
    id,
    href,
    label,
    announcement = "📣 Announcement",
    className,
    isExternal = false,
    autoShowDelay = 0,
}: HeroPillProps) {
    const controls = useAnimation()
    const { isPillVisible, showPill, hidePill } = usePillStore()
    const isVisible = isPillVisible(id)

    // Motion values for drag - always create these regardless of visibility
    const x = useMotionValue(0)
    const dragProgress = useMotionValue(0)

    // Always create transforms, never conditionally
    const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0])
    const scale = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8])
    const rotate = useTransform(x, [-200, 0, 200], [-10, 0, 10])
    const boxShadow = useTransform(
        dragProgress,
        [0, 1],
        ["0px 3px 8px rgba(0, 0, 0, 0.1)", "0px 10px 20px rgba(0, 0, 0, 0.2)"],
    )
    const indicatorOpacity = useTransform(dragProgress, [0, 0.3, 1], [0, 1, 1])
    const indicatorScale = useTransform(dragProgress, [0, 1], [0.8, 1])

    // Ref to track if we've shown this pill during this session
    const hasShownRef = useRef(false)

    useEffect(() => {
        // Auto-show the pill after the specified delay if it hasn't been shown yet
        if (!hasShownRef.current && autoShowDelay > 0) {
            const timer = setTimeout(() => {
                showPill(id)
                hasShownRef.current = true
            }, autoShowDelay)

            return () => clearTimeout(timer)
        }
    }, [id, autoShowDelay, showPill])

    const handleDragEnd = (_: MouseEvent, info: PanInfo) => {
        const threshold = 100

        if (Math.abs(info.offset.x) > threshold) {
            hidePill(id)
            controls.start({
                x: info.offset.x > 0 ? 500 : -500,
                opacity: 0,
                rotate: info.offset.x > 0 ? 45 : -45,
                transition: {
                    duration: 0.5,
                    ease: [0.32, 0.72, 0, 1], // Custom easing for a more playful exit
                },
            })
        } else {
            controls.start({
                x: 0,
                rotate: 0,
                transition: {
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    velocity: info.velocity.x,
                },
            })
        }

        // Reset drag progress
        dragProgress.set(0)
    }

    const handleDrag = (_: MouseEvent, info: PanInfo) => {
        // Update drag progress for visual feedback
        const progress = Math.min(Math.abs(info.offset.x) / 150, 1)
        dragProgress.set(progress)
    }

    // Staggered animation variants for internal elements
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    }

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 30,
            },
        },
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[400px] touch-none"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    style={{
                        x,
                        rotate,
                        boxShadow,
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDrag={handleDrag}
                    onDragEnd={handleDragEnd}
                    dragElastic={0.1}
                    dragTransition={{
                        power: 0.2,
                        timeConstant: 200,
                        modifyTarget: (target) => Math.round(target / 50) * 50,
                    }}
                    whileTap={{ scale: 0.98 }}
                >
                    <motion.a
                        href={href}
                        target={isExternal ? "_blank" : undefined}
                        className={cn(
                            "flex w-full items-center justify-center space-x-2 rounded-full",
                            "bg-secondary/80 ring-1 ring-accent/50 hover:ring-accent/80",
                            "px-4 py-2 whitespace-pre transition-all duration-300",
                            "backdrop-blur-sm",
                            className,
                        )}
                        variants={container}
                        initial="hidden"
                        animate="show"
                        whileHover={{ scale: 1.03 }}
                        style={{
                            opacity,
                            scale,
                        }}
                    >
                        <motion.div
                            className={cn(
                                "rounded-full bg-purple-600 dark:bg-purple-500 px-2 py-0.5",
                                "text-xs font-medium text-white sm:text-sm",
                            )}
                            variants={item}
                        >
                            {announcement}
                        </motion.div>

                        <motion.p className="text-xs font-medium text-foreground sm:text-sm" variants={item}>
                            {label}
                        </motion.p>

                        <motion.button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                hidePill(id)
                            }}
                            className="ml-2 rounded-full p-1 hover:bg-muted/80 transition-colors"
                            aria-label="Close announcement"
                            variants={item}
                            whileHover={{
                                scale: 1.2,
                                rotate: 90,
                                transition: { duration: 0.2 },
                            }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <X className="h-3.5 w-3.5 text-muted-foreground" />
                        </motion.button>
                    </motion.a>

                    {/* Drag indicator that appears when dragging */}
                    <motion.div
                        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground opacity-0"
                        style={{
                            opacity: indicatorOpacity,
                            scale: indicatorScale,
                        }}
                    >
                        Drag to dismiss
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
} 