import { NextResponse } from "next/server"
import { setCsrfToken } from "@/modules/auth/api/utils/csrf"

export async function GET() {
  try {
    const token = await setCsrfToken()
    return NextResponse.json({ csrfToken: token })
  } catch (error) {
    console.error('Error generating CSRF token:', error)
    return NextResponse.json({ error: 'Failed to generate CSRF token' }, { status: 500 })
  }
}

