import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  STATIC_DOCUMENTS,
  buildBlogIndexDocument,
  buildNotFoundDocument,
  buildPostDocument,
  buildReposDocument,
  buildVideosDocument,
  renderDocument,
} from "@/lib/agents/documents";
import { buildAgentInstructions } from "@/lib/agents/instructions";
import { CMS_BACKED_ROUTES, STATIC_ROUTES } from "@/lib/site/routes";
import { siteConfig } from "@/lib/seo/config";

const { url } = siteConfig;

describe("markdown coverage", () => {
  it("every sitemap route resolves to a markdown document", () => {
    for (const route of STATIC_ROUTES) {
      const covered =
        route.path in STATIC_DOCUMENTS || CMS_BACKED_ROUTES.includes(route.path);
      assert.ok(covered, `${route.path} has no markdown representation`);
    }
  });

  it("no static document points at a path that is not in the sitemap", () => {
    const sitemapPaths = new Set(STATIC_ROUTES.map((route) => route.path));
    // /coming-soon is deliberately unlisted: it is a placeholder, not content.
    const allowedExtras = new Set(["/coming-soon"]);
    for (const path of Object.keys(STATIC_DOCUMENTS)) {
      assert.ok(
        sitemapPaths.has(path) || allowedExtras.has(path),
        `${path} has markdown but is not in the sitemap`
      );
    }
  });
});

describe("renderDocument", () => {
  const rendered = renderDocument("/about", {
    title: "About",
    description: "Summary line.",
    body: "## Section\n\nBody text.",
  });

  it("leads with a single H1", () => {
    assert.ok(rendered.startsWith("# About\n"));
    assert.equal(rendered.split("\n").filter((l) => l.startsWith("# ")).length, 1);
  });

  it("carries the summary as a blockquote", () => {
    assert.ok(rendered.includes("> Summary line."));
  });

  it("footers the canonical HTML URL and the machine-readable indexes", () => {
    assert.ok(rendered.includes(`Canonical HTML: ${url}/about`));
    assert.ok(rendered.includes(`${url}/llms.txt`));
    assert.ok(rendered.includes(`${url}/sitemap.xml`));
  });

  it("uses the bare origin as the canonical URL for the home page", () => {
    const home = renderDocument("/", { title: "T", description: "D", body: "B" });
    assert.ok(home.includes(`Canonical HTML: ${url}\n`));
  });
});

describe("trust anchor documents", () => {
  for (const path of ["/about", "/contact", "/privacy"] as const) {
    it(`${path} has well over 500 characters of prose`, () => {
      const document = STATIC_DOCUMENTS[path];
      assert.ok(document, `${path} is missing`);
      assert.ok(
        document.body.length > 500,
        `${path} body is only ${document.body.length} chars`
      );
    });
  }

  it("contact names a reachable email address", () => {
    assert.ok(STATIC_DOCUMENTS["/contact"].body.includes(siteConfig.contact.email));
  });

  it("privacy states what is collected and how to have it deleted", () => {
    const body = STATIC_DOCUMENTS["/privacy"].body.toLowerCase();
    for (const term of ["analytics", "cookie", "newsletter", "delet"]) {
      assert.ok(body.includes(term), `privacy policy never mentions "${term}"`);
    }
  });
});

describe("buildNotFoundDocument", () => {
  const document = buildNotFoundDocument("/nope");

  it("names the path that was missed", () => {
    assert.ok(document.includes("/nope"));
  });

  it("points at the sitemap, llms.txt and agents.txt", () => {
    assert.ok(document.includes(`${url}/sitemap.xml`));
    assert.ok(document.includes(`${url}/llms.txt`));
    assert.ok(document.includes(`${url}/agents.txt`));
  });

  it("lists the real sections so an agent can recover", () => {
    for (const path of ["/blog", "/videos", "/repos", "/about", "/contact"]) {
      assert.ok(document.includes(`${url}${path})`), `missing link to ${path}`);
    }
  });

  it("is markdown, not an HTML shell", () => {
    assert.ok(document.startsWith("# 404"));
    assert.ok(!document.includes("<html"));
  });
});

describe("CMS-backed documents", () => {
  it("lists posts newest-first with their summaries", () => {
    const document = buildBlogIndexDocument([
      {
        title: "First post",
        slug: "first-post",
        excerpt: "  A   wrapped\nexcerpt.  ",
        publishedAt: "2026-01-02T10:00:00Z",
      },
    ]);
    assert.ok(document.body.includes(`[First post](${url}/blog/first-post)`));
    assert.ok(document.body.includes("(2026-01-02)"));
    assert.ok(document.body.includes("A wrapped excerpt."));
    assert.ok(document.body.includes("1 post,"));
  });

  it("says so plainly when there is nothing published", () => {
    assert.ok(buildBlogIndexDocument([]).body.includes("No posts are published yet."));
    assert.ok(buildVideosDocument([]).body.includes("No videos are published yet."));
    assert.ok(
      buildReposDocument([]).body.includes("No repositories are published yet.")
    );
  });

  it("renders a post's metadata line and body", () => {
    const document = buildPostDocument({
      title: "How to ship",
      slug: "how-to-ship",
      excerpt: "An excerpt.",
      metaDescription: null,
      publishedAt: "2026-02-03T00:00:00Z",
      updatedAt: "2026-02-04T00:00:00Z",
      authorName: "Joe Reitz",
      tag: "Tutorials",
      body: [
        {
          _type: "block",
          style: "h2",
          children: [{ _type: "span", text: "Step one" }],
        },
      ],
    });

    assert.equal(document.title, "How to ship");
    assert.equal(document.description, "An excerpt.");
    assert.ok(document.body.startsWith("Published: 2026-02-03"));
    assert.ok(document.body.includes("Updated: 2026-02-04"));
    assert.ok(document.body.includes("Author: Joe Reitz"));
    assert.ok(document.body.includes("Category: Tutorials"));
    assert.ok(document.body.includes("## Step one"));
  });

  it("prefers the meta description over the excerpt", () => {
    const document = buildPostDocument({
      title: "T",
      slug: "t",
      excerpt: "Excerpt.",
      metaDescription: "Meta description.",
      publishedAt: null,
      updatedAt: null,
      authorName: null,
      tag: null,
      body: null,
    });
    assert.equal(document.description, "Meta description.");
  });

  it("includes repo source and demo links", () => {
    const document = buildReposDocument([
      {
        title: "Lead scorer",
        description: "Scores leads.",
        githubUrl: "https://github.com/x/y",
        demoUrl: "https://demo.example.com",
        tags: ["nextjs"],
      },
    ]);
    assert.ok(document.body.includes("source: https://github.com/x/y"));
    assert.ok(document.body.includes("demo: https://demo.example.com"));
    assert.ok(document.body.includes("Tags: nextjs."));
  });
});

describe("agent instructions", () => {
  const instructions = buildAgentInstructions();

  it("has an explicit when-to-use section", () => {
    assert.ok(instructions.includes("## When to use this site"));
  });

  it("names concrete best-fit jobs rather than marketing copy", () => {
    for (const term of [
      "Worked examples",
      "forkable marketing-ops agent",
      "GTM Engineering",
    ]) {
      assert.ok(instructions.includes(term), `missing "${term}"`);
    }
  });

  it("says what the site is not a good source for", () => {
    assert.ok(instructions.includes("Do **not** use this site"));
  });

  it("documents how to call the site", () => {
    assert.ok(instructions.includes("## How to call this site"));
    assert.ok(instructions.includes("Accept: text/markdown"));
    assert.ok(instructions.includes("Vary: Accept, Accept-Encoding"));
    assert.ok(instructions.includes(`${url}/llms.txt`));
    assert.ok(instructions.includes("404"));
    assert.ok(instructions.includes("406"));
  });

  it("gives a contact route", () => {
    assert.ok(instructions.includes(siteConfig.contact.email));
    assert.ok(instructions.includes(`${url}/contact`));
  });

  it("is embedded in the home page's markdown", () => {
    assert.ok(STATIC_DOCUMENTS["/"].body.includes("## When to use this site"));
  });
});
