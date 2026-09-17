import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  canonicalPathFor,
  canonicalPathFromContentPath,
  decideRepresentation,
  isNegotiablePath,
  isRscRequest,
  markdownContentPath,
  normalisePath,
} from "@/lib/agents/negotiation";

function decide(
  pathname: string,
  accept: string | null,
  overrides: { method?: string; rsc?: boolean } = {}
) {
  return decideRepresentation({
    method: overrides.method ?? "GET",
    pathname,
    accept,
    rsc: overrides.rsc ?? false,
  });
}

describe("isNegotiablePath", () => {
  for (const path of ["/", "/about", "/blog", "/blog/some-post", "/about.md"]) {
    it(`negotiates ${path}`, () => assert.equal(isNegotiablePath(path), true));
  }

  for (const path of [
    "/api/subscribe",
    "/studio",
    "/studio/seo-aeo",
    "/_next/static/chunk.js",
    "/_vercel/insights/view",
    "/md",
    "/md/about",
    "/preview-email",
    "/unsubscribe",
    "/llms.txt",
    "/agents.txt",
    "/sitemap.xml",
    "/robots.txt",
    "/feed.xml",
    "/icon.svg",
  ]) {
    it(`leaves ${path} alone`, () => assert.equal(isNegotiablePath(path), false));
  }

  it("does not treat /mdx-guide as the markdown mount point", () => {
    assert.equal(isNegotiablePath("/mdx-guide"), true);
  });
});

describe("path mapping", () => {
  it("strips a trailing slash", () => {
    assert.equal(normalisePath("/about/"), "/about");
    assert.equal(normalisePath("/"), "/");
  });

  it("maps .md URLs to their canonical page", () => {
    assert.equal(canonicalPathFor("/about.md"), "/about");
    assert.equal(canonicalPathFor("/blog/a-post.md"), "/blog/a-post");
    assert.equal(canonicalPathFor("/index.md"), "/");
    assert.equal(canonicalPathFor("/about"), "/about");
  });

  it("round-trips through the internal markdown route", () => {
    for (const path of ["/", "/about", "/blog/a-post", "/oss-moperator/setup"]) {
      assert.equal(
        canonicalPathFromContentPath(markdownContentPath(path)),
        path,
        path
      );
    }
    assert.equal(markdownContentPath("/"), "/md");
    assert.equal(markdownContentPath("/about"), "/md/about");
  });
});

describe("isRscRequest", () => {
  it("detects the Next.js router headers", () => {
    assert.equal(isRscRequest(new Headers({ RSC: "1" })), true);
    assert.equal(isRscRequest(new Headers({ "Next-Router-Prefetch": "1" })), true);
    assert.equal(isRscRequest(new Headers({ Accept: "text/html" })), false);
  });
});

describe("decideRepresentation", () => {
  it("serves html to a browser and advertises the Vary", () => {
    assert.deepEqual(decide("/", "text/html,*/*;q=0.8"), { kind: "html" });
  });

  it("serves markdown when the client prefers it", () => {
    assert.deepEqual(decide("/about", "text/markdown"), {
      kind: "markdown",
      canonicalPath: "/about",
      contentPath: "/md/about",
    });
  });

  it("serves markdown for an explicit .md URL whatever the Accept says", () => {
    assert.deepEqual(decide("/about.md", "text/html"), {
      kind: "markdown",
      canonicalPath: "/about",
      contentPath: "/md/about",
    });
  });

  it("406s a client that can take neither representation", () => {
    assert.deepEqual(decide("/", "application/pdf"), { kind: "not-acceptable" });
  });

  it("never 406s an RSC navigation, even without the router headers", () => {
    // Next strips its own RSC headers before the proxy runs, so the media type
    // is the only signal left. Getting this wrong 406s every client-side
    // navigation on the site.
    assert.deepEqual(decide("/blog", "text/x-component"), { kind: "pass" });
    assert.deepEqual(decide("/blog", "text/x-component", { rsc: true }), {
      kind: "pass",
    });
    assert.deepEqual(decide("/blog", "text/x-component;q=0.9, */*;q=0.1"), {
      kind: "pass",
    });
  });

  it("does not mistake a wildcard for an RSC fetch", () => {
    assert.deepEqual(decide("/blog", "*/*"), { kind: "html" });
    assert.deepEqual(decide("/blog", "text/x-component;q=0, text/markdown"), {
      kind: "markdown",
      canonicalPath: "/blog",
      contentPath: "/md/blog",
    });
  });

  it("still passes through when only the router headers are present", () => {
    assert.deepEqual(decide("/blog", "*/*", { rsc: true }), { kind: "pass" });
  });

  it("leaves non-GET requests alone", () => {
    assert.deepEqual(decide("/api/subscribe", "text/markdown", { method: "POST" }), {
      kind: "pass",
    });
    assert.deepEqual(decide("/", "text/markdown", { method: "POST" }), {
      kind: "pass",
    });
  });

  it("leaves excluded paths alone even when markdown is requested", () => {
    for (const path of ["/llms.txt", "/api/subscribe", "/studio", "/md/about"]) {
      assert.deepEqual(decide(path, "text/markdown"), { kind: "pass" }, path);
    }
  });

  it("negotiates HEAD the same way as GET", () => {
    assert.deepEqual(decide("/about", "text/markdown", { method: "HEAD" }), {
      kind: "markdown",
      canonicalPath: "/about",
      contentPath: "/md/about",
    });
  });
});
