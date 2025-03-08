"use server"

import { cookies } from "next/headers"

// Validate the demo access password
export async function validateDemoPassword(formData: FormData) {
  const password = formData.get("password") as string
  const storedPassword = process.env.DEMO_ACCESS_PASSWORD

  if (!password || password !== storedPassword) {
    return { success: false, message: "Invalid password. Please try again." }
  }

  // Set a cookie to remember the authenticated state
  (await
        // Set a cookie to remember the authenticated state
        cookies()).set({
    name: "demo-access",
    value: "granted",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  })

  return { success: true }
}

// Check if the user has demo access
export async function checkDemoAccess() {
  const cookie = (await cookies()).get("demo-access")
  return cookie?.value === "granted"
}

// Revoke demo access
export async function revokeDemoAccess() {
  (await cookies()).set({
    name: "demo-access",
    value: "",
    expires: new Date(0),
    path: "/",
  })
  return { success: true }
} 