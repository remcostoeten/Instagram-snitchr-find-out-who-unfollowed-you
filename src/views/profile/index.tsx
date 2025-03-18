'use client'

import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ProfileActivity } from './components/profile-activity'
import { ProfileHeader } from './components/profile-header'
import { ProfileSettings } from './components/profile-settings'
import { ProfileStats } from './components/profile-stats'

export function ProfileView() {
    return (
        <div className="container max-w-6xl py-8 space-y-8">
            <Card className="p-6 space-y-6">
                <ProfileHeader />
                <Separator />
                <ProfileStats />
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-8">
                <ProfileActivity />
                <ProfileSettings />
            </div>
        </div>
    )
} 