"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PencilIcon, CheckIcon, XIcon } from "lucide-react"
import { toast } from "sonner"

interface DocumentTitleProps {
    initialTitle: string
    onTitleChange?: (newTitle: string) => void
    className?: string
}

export function DocumentTitle({ initialTitle, onTitleChange, className }: DocumentTitleProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState(initialTitle)
    const [editValue, setEditValue] = useState(initialTitle)

    const handleSave = () => {
        if (editValue.trim()) {
            setTitle(editValue)
            onTitleChange?.(editValue)
            setIsEditing(false)
            toast.success("Document renamed successfully")
        } else {
            toast.error("Title cannot be empty")
        }
    }

    const handleCancel = () => {
        setEditValue(title)
        setIsEditing(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSave()
        } else if (e.key === "Escape") {
            handleCancel()
        }
    }

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {isEditing ? (
                <div className="flex items-center gap-2">
                    <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-8 w-[200px]"
                        autoFocus
                    />
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={handleSave}
                    >
                        <CheckIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={handleCancel}
                    >
                        <XIcon className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <span className="font-medium text-lg">{title}</span>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => setIsEditing(true)}
                    >
                        <PencilIcon className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    )
} 