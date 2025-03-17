import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./modules/auth/api/utils/jwt"

// Paths that require authentication
const PROTECTED_PATHS = ["/dashboard", "/profile", "/settings"]

// Paths that are only accessible to unauthenticated users
const AUTH_PATHS = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get token from cookies
  const token = request.cookies.get("auth_token")?.value

  // Check if the path requires authentication
  const isProtectedPath = PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))

  // Check if the path is only for unauthenticated users
  const isAuthPath = AUTH_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))

  if (token) {
    // Verify token
    const payload = await verifyToken(token)

    if (payload) {
      // User is authenticated
      if (isAuthPath) {
        // Redirect authenticated users away from auth pages
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }

      // Allow access to protected paths
      return NextResponse.next()
    }
  }

  // User is not authenticated
  if (isProtectedPath) {
    // Redirect to login page with return URL
    const returnUrl = encodeURIComponent(pathname)
    return NextResponse.redirect(new URL(`/login?returnUrl=${returnUrl}`, request.url))
  }

  // Allow access to public paths
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes that don't require authentication
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api/public).*)",
  ],
}

