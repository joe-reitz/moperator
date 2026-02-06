import { NextRequest, NextResponse } from 'next/server'

const LOGIN_PATH = '/studio/seo-aeo/login'
const COOKIE_NAME = 'seo-studio-auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect the SEO tool page, not the API routes.
  // API routes are called from both the SEO tool page (has cookie)
  // and the Sanity Studio document action (has Sanity auth, no cookie).
  // The APIs require a server-side AI key to function, so exposure risk is minimal.
  if (!pathname.startsWith('/studio/seo-aeo')) return NextResponse.next()

  // Don't protect the login page itself
  if (pathname === LOGIN_PATH) return NextResponse.next()

  // Check for auth cookie
  const authCookie = request.cookies.get(COOKIE_NAME)

  const envPassword = process.env.STUDIO_SEO_PASSWORD

  if (!envPassword) {
    // No password configured - allow access (dev mode)
    return NextResponse.next()
  }

  const expectedValue = Buffer.from(`seo-studio:${envPassword}`).toString('base64')

  if (authCookie?.value === expectedValue) {
    return NextResponse.next()
  }

  const loginUrl = new URL(LOGIN_PATH, request.url)
  loginUrl.searchParams.set('redirect', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/studio/seo-aeo/:path*'],
}
