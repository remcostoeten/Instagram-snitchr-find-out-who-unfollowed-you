'use client'

import { Card } from '@/components/ui/card'
import { Users, UserMinus, Clock } from 'lucide-react'

interface StatCardProps {
    icon: React.ReactNode
    label: string
    value: string | number
    description?: string
}

function StatCard({ icon, label, value, description }: StatCardProps) {
    return (
        <Card className="p-4 flex items-start gap-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {icon}
            </div>
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <h3 className="text-2xl font-bold">{value}</h3>
                {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}
            </div>
        </Card>
    )
}

export function ProfileStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
                icon={<Users className="w-4 h-4" />}
                label="Total Followers"
                value="1,234"
                description="Last updated 2 hours ago"
            />
            <StatCard
                icon={<UserMinus className="w-4 h-4" />}
                label="Unfollowers"
                value="12"
                description="In the last 30 days"
            />
            <StatCard
                icon={<Clock className="w-4 h-4" />}
                label="Last Scan"
                value="2 hours ago"
            />
        </div>
    )
} 