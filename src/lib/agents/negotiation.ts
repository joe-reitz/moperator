/**
 * Where markdown content negotiation applies, and what it should do.
 *
 * Every page on this site has two representations at the same URL: the HTML
 * the browser gets, and a markdown rendering for agents. This module holds the
 * routing policy for that — pure functions only, so the behaviour is testable
 * without booting Next.js. `proxy.ts` is the only caller that turns these
 * decisions into responses.
 *
 * Conventions followed: https://acceptmarkdown.com
 */

import { negotiateMediaType, parseAcceptHeader } from "./accept";

export const HTML_MEDIA_TYPE = "text/html";
export const MARKDOWN_MEDIA_TYPE = "text/markdown";

/**
 * Server preference order. HTML is first, so it is both the default and the
 * tie-break winner for `Accept: *\/*` — browsers and naive crawlers keep
 * getting HTML, and only a client that explicitly ranks markdown higher gets
 * markdown.
 */
export const REPRESENTATIONS = [HTML_MEDIA_TYPE, MARKDOWN_MEDIA_TYPE] as const;

/** Route prefix the markdown route handler is mounted at. */
export const MARKDOWN_ROUTE_PREFIX = "/md";

/** Suffix that addresses a page's markdown representation directly. */
export const MARKDOWN_SUFFIX = ".md";

/**
 * Paths that have no markdown twin: API routes, the Studio, Next internals,
 * and the machine-readable files that are already single-representation.
 */
const EXCLUDED_PREFIXES = [
  "/_next",
  "/_vercel",
  "/api",
  "/studio",
  "/preview-email",
  "/unsubscribe",
  MARKDOWN_ROUTE_PREFIX,
];

/** Next.js sets these on router-initiated (RSC) fetches. */
const RSC_HEADERS = [
  "rsc",
  "next-router-prefetch",
  "next-router-state-tree",
  "next-router-segment-prefetch",
];

/**
 * The media type a Next.js router fetch asks for.
 *
 * This, not `RSC_HEADERS`, is what actually identifies a router fetch inside
 * the proxy: Next strips its own router headers from the request before the
 * proxy function runs, so `Accept` is the only signal left. Missing it would
 * 406 every client-side navigation on the site.
 */
const RSC_MEDIA_TYPE = "text/x-component";

/** True only for an exact, non-refused listing — a wildcard does not count. */
function acceptsExactly(accept: string | null, mediaType: string): boolean {
  const [type, subtype] = mediaType.split("/");
  return parseAcceptHeader(accept).some(
    (range) => range.type === type && range.subtype === subtype && range.q > 0
  );
}

export type RepresentationDecision =
  /** Not a negotiable route — leave the request completely alone. */
  | { kind: "pass" }
  /** Serve HTML as usual, but advertise that the response varies on Accept. */
  | { kind: "html" }
  /** Serve markdown; `contentPath` is the internal route to rewrite to. */
  | { kind: "markdown"; canonicalPath: string; contentPath: string }
  /** Nothing we can produce is acceptable to this client. */
  | { kind: "not-acceptable" };

function hasFileExtension(pathname: string): boolean {
  const lastSegment = pathname.slice(pathname.lastIndexOf("/") + 1);
  return lastSegment.includes(".");
}

/** True for the page routes that have both an HTML and a markdown rendering. */
export function isNegotiablePath(pathname: string): boolean {
  if (!pathname.startsWith("/")) return false;

  // Prefix match on whole segments, so `/md` and `/md/about` are excluded
  // while `/mdx-guide` stays negotiable.
  for (const prefix of EXCLUDED_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return false;
  }

  // `/robots.txt`, `/feed.xml`, `/icon.svg` and friends serve one thing only.
  // A `.md` suffix is the exception: that *is* a request for markdown.
  if (hasFileExtension(pathname) && !pathname.endsWith(MARKDOWN_SUFFIX)) {
    return false;
  }

  return true;
}

/** `/about.md` -> `/about`, `/index.md` -> `/`, `/blog/x.md` -> `/blog/x`. */
export function canonicalPathFor(pathname: string): string {
  if (!pathname.endsWith(MARKDOWN_SUFFIX)) return normalisePath(pathname);
  const stripped = pathname.slice(0, -MARKDOWN_SUFFIX.length);
  if (stripped === "" || stripped === "/index") return "/";
  return normalisePath(stripped);
}

/** Drops a trailing slash so `/about/` and `/about` resolve to one document. */
export function normalisePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname === "" ? "/" : pathname;
}

/** `/` -> `/md`, `/blog/post` -> `/md/blog/post`. */
export function markdownContentPath(canonicalPath: string): string {
  const path = normalisePath(canonicalPath);
  return path === "/" ? MARKDOWN_ROUTE_PREFIX : `${MARKDOWN_ROUTE_PREFIX}${path}`;
}

/** `/md/blog/post` -> `/blog/post`, `/md` -> `/`. */
export function canonicalPathFromContentPath(contentPath: string): string {
  const path = normalisePath(contentPath);
  if (path === MARKDOWN_ROUTE_PREFIX) return "/";
  if (path.startsWith(`${MARKDOWN_ROUTE_PREFIX}/`)) {
    return path.slice(MARKDOWN_ROUTE_PREFIX.length);
  }
  return path;
}

export function isRscRequest(headers: {
  get(name: string): string | null;
}): boolean {
  return RSC_HEADERS.some((name) => headers.get(name) !== null);
}

/**
 * The whole negotiation decision for one request.
 *
 * RSC navigations are passed straight through: they ask for
 * `text/x-component`, which is neither of our representations, so negotiating
 * them would 406 every client-side navigation on the site.
 */
export function decideRepresentation(input: {
  method: string;
  pathname: string;
  accept: string | null;
  rsc: boolean;
}): RepresentationDecision {
  const { method, pathname, accept, rsc } = input;

  if (method !== "GET" && method !== "HEAD") return { kind: "pass" };
  if (rsc || acceptsExactly(accept, RSC_MEDIA_TYPE)) return { kind: "pass" };
  if (!isNegotiablePath(pathname)) return { kind: "pass" };

  const canonicalPath = canonicalPathFor(pathname);

  // An explicit `.md` URL is a request for markdown regardless of Accept —
  // the extension is the negotiation.
  if (pathname.endsWith(MARKDOWN_SUFFIX)) {
    return {
      kind: "markdown",
      canonicalPath,
      contentPath: markdownContentPath(canonicalPath),
    };
  }

  const negotiated = negotiateMediaType(accept, REPRESENTATIONS);

  if (negotiated.outcome === "not-acceptable") return { kind: "not-acceptable" };
  if (negotiated.mediaType === MARKDOWN_MEDIA_TYPE) {
    return {
      kind: "markdown",
      canonicalPath,
      contentPath: markdownContentPath(canonicalPath),
    };
  }

  return { kind: "html" };
}
