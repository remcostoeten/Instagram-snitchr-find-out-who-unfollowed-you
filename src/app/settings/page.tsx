import { redirect } from "next/navigation"
import { getCurrentUser } from "@/modules/authentication/api/queries/auth"
import Link from "next/link"
import LogoutButton from "@/components/logout-button"
import LogoutAllButton from "@/components/logout-all-button"

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-500">
              Dashboard
            </Link>
            <Link href="/profile" className="text-sm text-blue-600 hover:text-blue-500">
              Profile
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>

          <div className="mt-6 border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium">Security</h3>
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Sessions</h4>
                <p className="mt-1 text-sm text-gray-600">
                  You can log out from all devices if you suspect unauthorized access to your account.
                </p>
                <div className="mt-2">
                  <LogoutAllButton />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Password</h4>
                <p className="mt-1 text-sm text-gray-600">
                  It's a good idea to use a strong password that you don't use elsewhere.
                </p>
                <div className="mt-2">
                  <Link
                    href="/settings/change-password"
                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Change Password
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium">Danger Zone</h3>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-500">Delete Account</h4>
              <p className="mt-1 text-sm text-gray-600">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <div className="mt-2">
                <button className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

