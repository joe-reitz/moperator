import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  portableTextToMarkdown,
  type PortableBlock,
} from "@/lib/agents/portable-text-to-markdown";

function block(
  text: string,
  extra: Record<string, unknown> = {}
): PortableBlock {
  return {
    _type: "block",
    children: [{ _type: "span", text }],
    ...extra,
  } as PortableBlock;
}

describe("portableTextToMarkdown", () => {
  it("returns an empty string for nothing", () => {
    assert.equal(portableTextToMarkdown(null), "");
    assert.equal(portableTextToMarkdown([]), "");
  });

  it("renders paragraphs separated by a blank line", () => {
    assert.equal(
      portableTextToMarkdown([block("First."), block("Second.")]),
      "First.\n\nSecond."
    );
  });

  it("demotes a body h1 to h2, matching the HTML rendering", () => {
    // The post title already owns the page's only h1.
    assert.equal(portableTextToMarkdown([block("Title", { style: "h1" })]), "## Title");
  });

  it("maps the remaining heading styles straight across", () => {
    assert.equal(portableTextToMarkdown([block("A", { style: "h2" })]), "## A");
    assert.equal(portableTextToMarkdown([block("A", { style: "h3" })]), "### A");
    assert.equal(portableTextToMarkdown([block("A", { style: "h4" })]), "#### A");
  });

  it("renders blockquote and aside styles as quotes", () => {
    assert.equal(
      portableTextToMarkdown([block("Noted.", { style: "blockquote" })]),
      "> Noted."
    );
    assert.equal(
      portableTextToMarkdown([block("Side note.", { style: "aside" })]),
      "> Side note."
    );
  });

  it("keeps consecutive list items tight and nests by level", () => {
    assert.equal(
      portableTextToMarkdown([
        block("One", { listItem: "bullet", level: 1 }),
        block("Nested", { listItem: "bullet", level: 2 }),
        block("Two", { listItem: "bullet", level: 1 }),
      ]),
      "- One\n  - Nested\n- Two"
    );
  });

  it("renders numbered lists", () => {
    assert.equal(
      portableTextToMarkdown([block("Step", { listItem: "number", level: 1 })]),
      "1. Step"
    );
  });

  it("applies decorators innermost-first", () => {
    const value: PortableBlock[] = [
      {
        _type: "block",
        children: [{ _type: "span", text: "loud", marks: ["strong", "em"] }],
      } as PortableBlock,
    ];
    assert.equal(portableTextToMarkdown(value), "***loud***");
  });

  it("renders inline code without escaping its contents", () => {
    const value: PortableBlock[] = [
      {
        _type: "block",
        children: [{ _type: "span", text: "a_b*c", marks: ["code"] }],
      } as PortableBlock,
    ];
    assert.equal(portableTextToMarkdown(value), "`a_b*c`");
  });

  it("renders links from markDefs", () => {
    const value: PortableBlock[] = [
      {
        _type: "block",
        markDefs: [{ _key: "k1", _type: "link", href: "https://example.com" }],
        children: [{ _type: "span", text: "here", marks: ["k1"] }],
      } as PortableBlock,
    ];
    assert.equal(portableTextToMarkdown(value), "[here](https://example.com)");
  });

  it("escapes markdown syntax in plain text", () => {
    assert.equal(
      portableTextToMarkdown([block("a * b _ c [d]")]),
      "a \\* b \\_ c \\[d\\]"
    );
  });

  it("renders images with alt text and caption", () => {
    const value: PortableBlock[] = [
      {
        _type: "image",
        alt: "A chart",
        caption: "Cost per conversion",
        asset: { url: "https://cdn.sanity.io/x.png" },
      } as PortableBlock,
    ];
    assert.equal(
      portableTextToMarkdown(value),
      "![A chart](https://cdn.sanity.io/x.png)\n\n*Cost per conversion*"
    );
  });

  it("skips an image with no asset", () => {
    assert.equal(portableTextToMarkdown([{ _type: "image" } as PortableBlock]), "");
  });

  it("fences code blocks with their language and filename", () => {
    const value: PortableBlock[] = [
      {
        _type: "codeBlock",
        language: "typescript",
        filename: "proxy.ts",
        code: "export const a = 1\n",
      } as PortableBlock,
    ];
    assert.equal(
      portableTextToMarkdown(value),
      "`proxy.ts`\n\n```typescript\nexport const a = 1\n```"
    );
  });

  it("still renders legacy blocks typed 'code'", () => {
    const value: PortableBlock[] = [
      { _type: "code", language: "sh", code: "ls" } as PortableBlock,
    ];
    assert.equal(portableTextToMarkdown(value), "```sh\nls\n```");
  });

  it("skips unknown block types instead of rendering junk", () => {
    assert.equal(
      portableTextToMarkdown([{ _type: "someFutureType" }, block("Real.")]),
      "Real."
    );
  });

  it("skips empty blocks", () => {
    assert.equal(portableTextToMarkdown([block("   "), block("Real.")]), "Real.");
  });
});
