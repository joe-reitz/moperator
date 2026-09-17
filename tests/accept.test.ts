import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  negotiateMediaType,
  parseAcceptHeader,
  scoreMediaType,
} from "@/lib/agents/accept";

const BOTH = ["text/html", "text/markdown"] as const;
const MD_ONLY = ["text/markdown"] as const;

describe("parseAcceptHeader", () => {
  it("defaults a missing q to 1", () => {
    assert.deepEqual(parseAcceptHeader("text/markdown"), [
      { type: "text", subtype: "markdown", q: 1 },
    ]);
  });

  it("reads q values and tolerates whitespace and casing", () => {
    assert.deepEqual(parseAcceptHeader("  TEXT/HTML ;  Q=0.8 "), [
      { type: "text", subtype: "html", q: 0.8 },
    ]);
  });

  it("keeps media-type parameters out of the q lookup", () => {
    assert.deepEqual(parseAcceptHeader("text/html;level=1;q=0.5"), [
      { type: "text", subtype: "html", q: 0.5 },
    ]);
  });

  it("clamps out-of-range q values", () => {
    assert.equal(parseAcceptHeader("text/html;q=7")[0].q, 1);
    assert.equal(parseAcceptHeader("text/html;q=-3")[0].q, 0);
  });

  it("returns nothing for a missing header", () => {
    assert.deepEqual(parseAcceptHeader(null), []);
    assert.deepEqual(parseAcceptHeader(undefined), []);
  });

  it("drops malformed entries but keeps the valid ones", () => {
    assert.deepEqual(parseAcceptHeader("garbage, */json, text/markdown"), [
      { type: "text", subtype: "markdown", q: 1 },
    ]);
  });

  it("keeps the full wildcard", () => {
    assert.deepEqual(parseAcceptHeader("*/*;q=0.1"), [
      { type: "*", subtype: "*", q: 0.1 },
    ]);
  });
});

describe("scoreMediaType", () => {
  const ranges = parseAcceptHeader("text/markdown;q=0.4, text/*;q=0.7, */*;q=0.9");

  it("prefers the most specific match over the highest q", () => {
    assert.equal(scoreMediaType(ranges, "text/markdown"), 0.4);
  });

  it("falls back to the subtype wildcard", () => {
    assert.equal(scoreMediaType(ranges, "text/html"), 0.7);
  });

  it("falls back to the catch-all", () => {
    assert.equal(scoreMediaType(ranges, "application/json"), 0.9);
  });

  it("scores an unmatched type at zero", () => {
    assert.equal(scoreMediaType(parseAcceptHeader("text/html"), "text/markdown"), 0);
  });
});

// The worked examples published at https://acceptmarkdown.com/guides/accept-parsing
describe("negotiateMediaType — acceptmarkdown.com test vectors", () => {
  it("'text/markdown, text/html;q=0.8' produces markdown", () => {
    assert.deepEqual(negotiateMediaType("text/markdown, text/html;q=0.8", BOTH), {
      outcome: "match",
      mediaType: "text/markdown",
    });
  });

  it("'text/markdown;q=0, text/html' produces html", () => {
    assert.deepEqual(negotiateMediaType("text/markdown;q=0, text/html", BOTH), {
      outcome: "match",
      mediaType: "text/html",
    });
  });

  it("'text/markdown;q=0' with markdown as the only option is 406", () => {
    assert.deepEqual(negotiateMediaType("text/markdown;q=0", MD_ONLY), {
      outcome: "not-acceptable",
    });
  });

  it("a missing header produces the default", () => {
    assert.deepEqual(negotiateMediaType(null, BOTH), {
      outcome: "default",
      mediaType: "text/html",
    });
  });

  it("'*/*' produces the default", () => {
    assert.deepEqual(negotiateMediaType("*/*", BOTH), {
      outcome: "match",
      mediaType: "text/html",
    });
  });
});

describe("negotiateMediaType — other cases", () => {
  it("406s when nothing we produce is listed", () => {
    assert.deepEqual(negotiateMediaType("application/pdf", BOTH), {
      outcome: "not-acceptable",
    });
  });

  it("serves html to a real browser header", () => {
    const chrome =
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8";
    assert.deepEqual(negotiateMediaType(chrome, BOTH), {
      outcome: "match",
      mediaType: "text/html",
    });
  });

  it("serves html to curl's default */*", () => {
    assert.deepEqual(negotiateMediaType("*/*", BOTH), {
      outcome: "match",
      mediaType: "text/html",
    });
  });

  it("serves markdown when text/* outranks html", () => {
    assert.deepEqual(negotiateMediaType("text/*, text/html;q=0.1", BOTH), {
      outcome: "match",
      mediaType: "text/markdown",
    });
  });

  it("breaks an exact tie toward the server's first preference", () => {
    assert.deepEqual(negotiateMediaType("text/markdown, text/html", BOTH), {
      outcome: "match",
      mediaType: "text/html",
    });
  });

  it("treats an unparseable header as no constraint rather than an error", () => {
    assert.deepEqual(negotiateMediaType("???", BOTH), {
      outcome: "default",
      mediaType: "text/html",
    });
  });

  it("406s when there is nothing at all to serve", () => {
    assert.deepEqual(negotiateMediaType("text/html", []), {
      outcome: "not-acceptable",
    });
  });
});
