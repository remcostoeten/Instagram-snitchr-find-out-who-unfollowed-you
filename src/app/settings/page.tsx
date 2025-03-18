import { redirect } from "next/navigation"
import { getCurrentUser } from "@/modules/auth/api/queries/auth"
import Link from "next/link"
import LogoutButton from "@/components/logout-button"
import LogoutAllButton from "@/components/logout-all-button"

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container max-w-7xl py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Account</h2>
            <div className="space-y-1">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Name:</strong> {user.name}</p>
              {user.instagramHandle && (
                <p><strong>Instagram:</strong> @{user.instagramHandle}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Actions</h2>
            <div className="flex space-x-4">
              <LogoutButton />
              <LogoutAllButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

