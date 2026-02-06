import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_PATHS = ['/studio/seo-aeo', '/api/generate-seo', '/api/generate-og']
const LOGIN_PATH = '/studio/seo-aeo/login'
const COOKIE_NAME = 'seo-studio-auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if path is protected
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  // Don't protect the login page itself
  if (pathname === LOGIN_PATH) return NextResponse.next()

  // Check for auth cookie
  const authCookie = request.cookies.get(COOKIE_NAME)

  if (!authCookie?.value) {
    // API routes get a 401, pages get redirected
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const loginUrl = new URL(LOGIN_PATH, request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Validate the cookie value matches a hash of the password
  const expectedToken = authCookie.value
  const envPassword = process.env.STUDIO_SEO_PASSWORD

  if (!envPassword) {
    // No password configured - allow access (dev mode)
    return NextResponse.next()
  }

  // Simple token validation: the cookie stores a base64-encoded token
  // that was set by the auth route after password validation
  const expectedValue = Buffer.from(`seo-studio:${envPassword}`).toString('base64')

  if (expectedToken !== expectedValue) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const loginUrl = new URL(LOGIN_PATH, request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/studio/seo-aeo/:path*', '/api/generate-seo/:path*', '/api/generate-og/:path*'],
}
