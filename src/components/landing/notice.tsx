"use client"

import { Banner } from "@/components/ui/banner"
import { Button } from "@/components/ui/button"
import { Rocket, X } from "lucide-react"
import { useState } from "react"

function BannerWithIcon() {
    const [isVisible, setIsVisible] = useState(true)

    if (!isVisible) return null

    return (
        <Banner variant="muted" className="dark text-foreground">
            <div className="flex w-full gap-2 md:items-center">
                <div className="flex grow gap-3 md:items-center">
                    <div
                        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 max-md:mt-0.5"
                        aria-hidden="true"
                    >
                        <Rocket className="opacity-80" size={16} strokeWidth={2} />
                    </div>
                    <div className="flex grow flex-col justify-between gap-3 md:flex-row md:items-center">
                        <div className="space-y-0.5">
                            <p className="text-sm font-medium">Boost your experience with Origin UI</p>
                            <p className="text-sm text-muted-foreground">
                                The new feature is live! Try it out and let us know what you think.
                            </p>
                        </div>
                        <div className="flex gap-2 max-md:flex-wrap">
                            <Button size="sm" className="text-sm">Try now</Button>
                        </div>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
                    onClick={() => setIsVisible(false)}
                    aria-label="Close banner"
                >
                    <X
                        size={16}
                        strokeWidth={2}
                        className="opacity-60 transition-opacity group-hover:opacity-100"
                        aria-hidden="true"
                    />
                </Button>
            </div>
        </Banner>
    )
}

export { BannerWithIcon }