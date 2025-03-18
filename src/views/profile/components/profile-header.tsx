'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Instagram } from 'lucide-react'
import { useFontStore } from '@/modules/font-switcher'

export function ProfileHeader() {
    const { user } = useFontStore()

    return (
        <div className="flex items-start justify-between">
            <div className="flex gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={`https://avatar.vercel.sh/${user?.email}`} />
                    <AvatarFallback>{user?.name?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-2xl font-bold">{user?.name}</h1>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <Instagram className="w-4 h-4" />
                        <span className="text-sm">@{user?.instagramHandle}</span>
                    </div>
                </div>
            </div>
            <Button variant="outline">Edit Profile</Button>
        </div>
    )
} 