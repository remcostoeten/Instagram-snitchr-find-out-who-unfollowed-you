import { getCurrentUser } from '@/modules/auth/api/utils/auth-server'
import { redirect } from 'next/navigation'
import { ProfileView } from '@/views/profile'

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return <ProfileView />
}

