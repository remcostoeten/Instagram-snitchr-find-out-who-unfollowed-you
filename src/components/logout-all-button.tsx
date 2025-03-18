"use client"

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { logoutAll } from '@/modules/auth/api/mutations/auth'

export default function LogoutAllButton() {
  const router = useRouter()

  const handleLogoutAll = async () => {
    try {
      const result = await logoutAll()

      if (!result.success) {
        throw new Error(result.error || 'Failed to logout from all devices')
      }

      toast.success('Logged out from all devices')
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Error logging out from all devices:', error)
      toast.error('Failed to logout from all devices')
    }
  }

  return (
    <Button
      variant="destructive"
      onClick={handleLogoutAll}
      className="w-full sm:w-auto"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Logout All Devices
    </Button>
  )
}

