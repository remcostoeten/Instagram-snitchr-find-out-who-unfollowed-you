'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, RefreshCw } from 'lucide-react'

export function ProfileActivity() {
    return (
        <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Activity</h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload CSV
                    </Button>
                    <Button variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Scan Now
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                    No recent activity. Upload a new Instagram followers CSV to start tracking changes.
                </div>
            </div>
        </Card>
    )
} 