"use client"

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { logout } from '@/modules/auth/api/mutations/auth'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const result = await logout()

      if (!result.success) {
        throw new Error(result.error || 'Failed to logout')
      }

      toast.success('Logged out successfully')
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Error logging out:', error)
      toast.error('Failed to logout')
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      className="w-full sm:w-auto"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  )
}

