import { NextResponse } from "next/server"
import { setCsrfCookie } from "@/modules/authentication/api/utils/csrf"

export async function GET() {
  // Generate and set CSRF token
  const csrfToken = setCsrfCookie()

  return NextResponse.json({ csrfToken })
}

