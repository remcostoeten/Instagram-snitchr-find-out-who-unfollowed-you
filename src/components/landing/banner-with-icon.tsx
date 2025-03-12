"use client"

import { useEffect, useState } from "react"
import { ArrowRight, Rocket, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GlowEffect } from "../ui/effects/glow-button"
import { cn } from "@/lib/utils"

interface BannerWithIconProps {
    onViewDemo?: () => void;
    title?: string;
    subtitle?: string;
}

function BannerWithIcon({ onViewDemo, title = "Instagram Snitch'r", subtitle = "Find out who unfollowed you and analyze your Instagram follower data" }: BannerWithIconProps) {
    const [isVisible, setIsVisible] = useState(true)
    const STORAGE_KEY = "banner-dismissed"

    useEffect(() => {
        // Check localStorage when component mounts
        const isDismissed = localStorage.getItem(STORAGE_KEY) === "true"
        if (isDismissed) {
            setIsVisible(false)
        }
    }, [])

    const handleDismiss = () => {
        setIsVisible(false)
        // Store dismissal in localStorage
        localStorage.setItem(STORAGE_KEY, "true")
    }

    const handleViewDemo = () => {
        if (onViewDemo) {
            onViewDemo();
        } else {
            // Default behavior: scroll to demo section
            const demoSection = document.querySelector('[id="demo-section"]');
            if (demoSection) {
                demoSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, rotateX: 90, perspective: 1000 }}
                    animate={{ opacity: 1, rotateX: 0 }}
                    exit={{ opacity: 0, rotateX: -90 }}
                    transition={{
                        duration: 0.6,
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="w-full"
                >
                    <div className="bg-secondary border border-border shadow-md rounded-lg p-4 overflow-hidden relative transition-colors duration-300">
                        <div className="flex w-full gap-3 md:items-center">
                            <div className="flex grow gap-3 md:items-center">
                                <div
                                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent transition-colors duration-300"
                                    aria-hidden="true"
                                >
                                    <Rocket className="text-primary transition-colors duration-300" size={18} strokeWidth={1.5} />
                                </div>
                                <div className="flex grow flex-col justify-between gap-3 md:flex-row md:items-center">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-medium text-foreground transition-colors duration-300">{title}</p>
                                        <p className="text-sm text-muted-foreground transition-colors duration-300">
                                            {subtitle}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 max-md:flex-wrap">
                                        <div className='relative'>
                                            <GlowEffect
                                                colors={['#FF5733', '#33FF57', '#3357FF', '#F1C40F']}
                                                mode='colorShift'
                                                blur='soft'
                                                duration={3}
                                                scale={0.9}
                                            />
                                            <Button
                                                onClick={handleViewDemo}
                                                className={cn(
                                                    'group relative inline-flex items-center gap-1 rounded-md',
                                                    'bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-800',
                                                    'px-4 py-1.5 text-sm',
                                                    'hover:bg-zinc-950/[95%] dark:hover:bg-zinc-950/[95%] light:hover:bg-zinc-800/90',
                                                    'transition-all duration-300',
                                                    'text-neutral-300',
                                                    'outline outline-1 outline-[#fff2f21f]'
                                                )}
                                            >
                                                View demo <ArrowRight className='h4 w-4 group-hover:translate-x-1 transition-transform duration-300' />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:scale-105 hover:bg-transparent transition-all duration-300 hover:rotate-6 text-muted-foreground hover:text-foreground"
                                onClick={handleDismiss}
                                aria-label="Close banner"
                            >
                                <X
                                    size={16}
                                    strokeWidth={1.5}
                                    className="transition-all duration-300"
                                    aria-hidden="true"
                                />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export { BannerWithIcon }

