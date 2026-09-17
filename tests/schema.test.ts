import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  brandProfiles,
  buildOrganizationSchema,
  buildPageSchema,
  buildWebSiteSchema,
  jsonLdScriptProps,
} from "@/lib/seo/schema";
import { siteConfig } from "@/lib/seo/config";

describe("brand identity schema", () => {
  const organization = buildOrganizationSchema();

  it("claims every spelling of the brand name", () => {
    assert.deepEqual(organization.alternateName, siteConfig.alternateNames);
    assert.ok(siteConfig.alternateNames.includes("mOperator"));
  });

  it("links the brand to its off-domain profiles via sameAs", () => {
    assert.deepEqual(organization.sameAs, brandProfiles());
    assert.ok(organization.sameAs.includes(siteConfig.contact.x));
    assert.ok(organization.sameAs.includes(siteConfig.contact.github));
  });

  it("publishes a contact point answer engines can verify", () => {
    assert.equal(organization.contactPoint[0].email, siteConfig.contact.email);
    assert.equal(organization.contactPoint[0].url, `${siteConfig.url}/contact`);
  });
});

describe("buildWebSiteSchema", () => {
  const graph = buildWebSiteSchema()["@graph"];

  it("carries WebSite, Organization and Person in one graph", () => {
    assert.deepEqual(
      graph.map((node) => node["@type"]),
      ["WebSite", "Organization", "Person"]
    );
  });

  it("resolves every @id reference inside the graph", () => {
    const ids = new Set(graph.map((node) => node["@id"]));
    const references = JSON.stringify(graph).match(/"@id":"[^"]+"/g) ?? [];
    for (const reference of references) {
      const id = reference.slice('"@id":"'.length, -1);
      assert.ok(ids.has(id) || id.endsWith("#logo"), `dangling @id ${id}`);
    }
  });
});

describe("buildPageSchema", () => {
  /** Serialised shape, which is what actually ships in the page. */
  function pageNode(schema: unknown): Record<string, unknown> {
    const graph = (JSON.parse(JSON.stringify(schema)) as {
      "@graph": Record<string, unknown>[];
    })["@graph"];
    return graph[0];
  }

  it("marks the contact page as a ContactPage", () => {
    const page = pageNode(
      buildPageSchema({
        type: "ContactPage",
        path: "/contact",
        name: "Contact",
        description: "How to get in touch.",
      })
    );
    assert.equal(page["@type"], "ContactPage");
    assert.equal(page.url, `${siteConfig.url}/contact`);
  });

  it("carries dateModified when one is given, and omits it otherwise", () => {
    const withDate = pageNode(
      buildPageSchema({
        type: "WebPage",
        path: "/privacy",
        name: "Privacy",
        description: "What is collected.",
        dateModified: siteConfig.legal.privacyUpdated,
      })
    );
    assert.equal(withDate.dateModified, siteConfig.legal.privacyUpdated);

    const withoutDate = pageNode(
      buildPageSchema({
        type: "AboutPage",
        path: "/about",
        name: "About",
        description: "Who runs this.",
      })
    );
    assert.ok(!("dateModified" in withoutDate));
  });
});

describe("jsonLdScriptProps", () => {
  it("neutralises a closing script tag inside the payload", () => {
    const props = jsonLdScriptProps({ name: "</script><img onerror=1>" });
    assert.ok(!props.dangerouslySetInnerHTML.__html.includes("</script>"));
    assert.ok(props.dangerouslySetInnerHTML.__html.includes("\\u003c/script>"));
  });
});
