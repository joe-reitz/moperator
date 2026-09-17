import { NextRequest, NextResponse } from 'next/server'
import {
  HTML_MEDIA_TYPE,
  MARKDOWN_MEDIA_TYPE,
  decideRepresentation,
  isRscRequest,
} from '@/lib/agents/negotiation'

/**
 * Next 16 deprecated the `middleware` file convention in favour of `proxy`.
 *
 * This file has to sit in `src/`, next to `app/` — a root-level `proxy.ts` is
 * silently ignored in this layout (the build prints no "Proxy (Middleware)"
 * line and the function never runs), even though a root-level `middleware.ts`
 * was picked up fine.
 */

const LOGIN_PATH = '/studio/seo-aeo/login'
const COOKIE_NAME = 'seo-studio-auth'

/**
 * Vary value for negotiated responses.
 *
 * Without `Accept`, a shared cache can hand the HTML variant to an agent that
 * asked for markdown, or the reverse, depending on which one landed in the
 * cache first (https://acceptmarkdown.com/guides/vary-accept).
 *
 * This is emitted as its own header rather than merged into the framework's:
 * Next.js appends its own `Vary` for the RSC router headers, and HTTP combines
 * repeated `Vary` headers into one list, so both survive.
 *
 * Known limitation: on a *prerendered* HTML page Next replays the headers it
 * captured with the prerender, which overwrites this one. That leaves the HTML
 * variant without `Vary: Accept` in production. It is not a correctness problem
 * here because the proxy runs ahead of the CDN and rewrites markdown requests
 * to a different path, so the two variants never share a cache key — but it is
 * why only the markdown branch can be verified to carry the header.
 */
const VARY = 'Accept, Accept-Encoding'

/**
 * Body for a 406. RFC 9110 suggests listing the representations that *are*
 * available so the client can retry without guessing.
 */
const NOT_ACCEPTABLE_BODY = [
  '406 Not Acceptable',
  '',
  'This URL can be served as:',
  `  ${HTML_MEDIA_TYPE}`,
  `  ${MARKDOWN_MEDIA_TYPE}`,
  '',
  'Retry with one of those in the Accept header, or append ".md" to the path',
  'for the markdown representation.',
  '',
].join('\n')

function requireStudioAuth(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl

  // Only protect the SEO tool page, not the API routes.
  // API routes are called from both the SEO tool page (has cookie)
  // and the Sanity Studio document action (has Sanity auth, no cookie).
  // The APIs require a server-side AI key to function, so exposure risk is minimal.
  if (!pathname.startsWith('/studio/seo-aeo')) return null

  // Don't protect the login page itself
  if (pathname === LOGIN_PATH) return null

  const authCookie = request.cookies.get(COOKIE_NAME)
  const envPassword = process.env.STUDIO_SEO_PASSWORD

  if (!envPassword) {
    // No password configured - allow access (dev mode)
    return null
  }

  const expectedValue = Buffer.from(`seo-studio:${envPassword}`).toString('base64')

  if (authCookie?.value === expectedValue) return null

  const loginUrl = new URL(LOGIN_PATH, request.url)
  loginUrl.searchParams.set('redirect', pathname)
  return NextResponse.redirect(loginUrl)
}

export function proxy(request: NextRequest) {
  const authRedirect = requireStudioAuth(request)
  if (authRedirect) return authRedirect

  const decision = decideRepresentation({
    method: request.method,
    pathname: request.nextUrl.pathname,
    accept: request.headers.get('accept'),
    rsc: isRscRequest(request.headers),
  })

  switch (decision.kind) {
    case 'pass':
      return NextResponse.next()

    case 'markdown': {
      const rewritten = new URL(request.nextUrl)
      rewritten.pathname = decision.contentPath
      const response = NextResponse.rewrite(rewritten)
      response.headers.set('Vary', VARY)
      return response
    }

    case 'not-acceptable':
      return new NextResponse(NOT_ACCEPTABLE_BODY, {
        status: 406,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          Vary: VARY,
          // Accept varies per request, so a shared cache should not hold this.
          'Cache-Control': 'no-store',
        },
      })

    case 'html': {
      const response = NextResponse.next()
      response.headers.set('Vary', VARY)
      return response
    }
  }
}

export const config = {
  // Everything except Next internals and static assets. Page paths and `.md`
  // paths both need to reach the negotiation above; `.txt`/`.xml`/image
  // requests never do.
  matcher: [
    '/((?!_next/static|_next/image|_vercel/|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|avif|woff|woff2|ttf|otf|txt|xml|json|css|js|map)$).*)',
  ],
}
