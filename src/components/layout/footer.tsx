import { Github } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
    return (
        <footer className="border-t border-border/40 bg-background/80 backdrop-blur-sm py-6 mt-auto">
            <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between text-sm">
                <p className="text-muted-foreground">
                    Built with ♥️ by{" "}
                    <a
                        href="https://github.com/remcostoeten"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-foreground hover:text-primary transition-colors"
                    >
                        Remco Stoeten
                    </a>
                </p>

                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        asChild
                    >
                        <a
                            href="https://github.com/remcostoeten/instagram-csv-comparer"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View source on GitHub"
                        >
                            <Github className="h-5 w-5" />
                        </a>
                    </Button>
                </div>
            </div>
        </footer>
    )
} 