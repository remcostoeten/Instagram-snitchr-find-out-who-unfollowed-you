import { NextResponse } from "next/server"
import { getCurrentUser } from "@/modules/authentication/api/queries/auth"

export async function GET() {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  return NextResponse.json(user)
}

