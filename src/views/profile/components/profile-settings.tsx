'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FontSwitcher } from '@/modules/font-switcher'
import { ModeToggle } from '@/components/mode-toggle'
import { Settings, LogOut } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export function ProfileSettings() {
    return (
        <Card className="p-6 space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-4">Settings</h2>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Theme</label>
                        <ModeToggle />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Font</label>
                        <FontSwitcher />
                    </div>
                </div>
            </div>

            <Separator />

            <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start" size="lg">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                </Button>
                <Button variant="destructive" className="w-full justify-start" size="lg">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                </Button>
            </div>
        </Card>
    )
} 