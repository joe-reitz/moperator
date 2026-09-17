/**
 * Portable Text -> CommonMark.
 *
 * Covers exactly the block types the post schema allows (see
 * `src/sanity/schemaTypes/post.ts`): blocks with the normal/h1-h4/blockquote/
 * aside styles, bullet and numbered lists, inline marks, links, images and
 * code blocks. Anything unknown is skipped rather than rendered as `[object
 * Object]`, so a new schema type degrades to a gap instead of to noise.
 *
 * Deliberately dependency-free and synchronous so it can be unit-tested.
 */

type Span = {
  _type: "span";
  text?: string;
  marks?: string[];
};

type MarkDef = {
  _key: string;
  _type: string;
  href?: string;
};

type TextBlock = {
  _type: "block";
  style?: string;
  listItem?: string;
  level?: number;
  children?: Span[];
  markDefs?: MarkDef[];
};

type ImageBlock = {
  _type: "image";
  alt?: string;
  caption?: string;
  asset?: { url?: string } | null;
};

type CodeBlock = {
  _type: "code" | "codeBlock";
  language?: string;
  filename?: string;
  code?: string;
};

export type PortableBlock = TextBlock | ImageBlock | CodeBlock | { _type: string };

const HEADING_LEVELS: Record<string, number> = {
  // The HTML template demotes a body h1 to h2 because the post title already
  // owns the page's only h1. The markdown rendering keeps the same shape.
  h1: 2,
  h2: 2,
  h3: 3,
  h4: 4,
  h5: 5,
  h6: 6,
};

/** Escapes the characters that would otherwise start markdown syntax. */
function escapeText(text: string): string {
  return text.replace(/([\\`*_[\]<>])/g, "\\$1");
}

function renderSpan(span: Span, markDefs: MarkDef[]): string {
  let text = escapeText(span.text ?? "");
  if (text === "") return "";

  const marks = span.marks ?? [];
  const annotations = marks.filter((mark) =>
    markDefs.some((def) => def._key === mark)
  );
  const decorators = marks.filter((mark) => !annotations.includes(mark));

  // Innermost first: code, then emphasis, then strong.
  if (decorators.includes("code")) text = `\`${span.text ?? ""}\``;
  if (decorators.includes("em")) text = `*${text}*`;
  if (decorators.includes("strong")) text = `**${text}**`;
  if (decorators.includes("strike-through")) text = `~~${text}~~`;

  for (const key of annotations) {
    const def = markDefs.find((candidate) => candidate._key === key);
    if (def?._type === "link" && def.href) {
      text = `[${text}](${def.href})`;
    }
  }

  return text;
}

function renderTextBlock(block: TextBlock): string {
  const markDefs = block.markDefs ?? [];
  const text = (block.children ?? [])
    .map((span) => renderSpan(span, markDefs))
    .join("")
    .trim();

  if (text === "") return "";

  if (block.listItem) {
    const indent = "  ".repeat(Math.max((block.level ?? 1) - 1, 0));
    const bullet = block.listItem === "number" ? "1." : "-";
    return `${indent}${bullet} ${text}`;
  }

  const style = block.style ?? "normal";

  if (style in HEADING_LEVELS) {
    return `${"#".repeat(HEADING_LEVELS[style])} ${text}`;
  }

  if (style === "blockquote" || style === "aside") {
    return text
      .split("\n")
      .map((line) => `> ${line}`)
      .join("\n");
  }

  return text;
}

function renderImage(block: ImageBlock): string {
  const url = block.asset?.url;
  if (!url) return "";
  const alt = (block.alt ?? "").trim();
  const image = `![${alt}](${url})`;
  const caption = (block.caption ?? "").trim();
  return caption ? `${image}\n\n*${caption}*` : image;
}

function renderCode(block: CodeBlock): string {
  const code = (block.code ?? "").replace(/\s+$/, "");
  if (code === "") return "";
  const language = (block.language ?? "").trim();
  const filename = (block.filename ?? "").trim();
  const fence = ["```" + language, code, "```"].join("\n");
  return filename ? `\`${filename}\`\n\n${fence}` : fence;
}

/** Renders a Portable Text array to markdown, blocks separated by blank lines. */
export function portableTextToMarkdown(
  blocks: readonly PortableBlock[] | null | undefined
): string {
  if (!blocks?.length) return "";

  const rendered: string[] = [];
  let previousWasListItem = false;

  for (const block of blocks) {
    let markdown = "";

    if (block._type === "block") {
      markdown = renderTextBlock(block as TextBlock);
    } else if (block._type === "image") {
      markdown = renderImage(block as ImageBlock);
    } else if (block._type === "code" || block._type === "codeBlock") {
      markdown = renderCode(block as CodeBlock);
    }

    if (markdown === "") continue;

    const isListItem = Boolean((block as TextBlock).listItem);

    // Consecutive list items form one tight list; everything else gets a blank
    // line between it and what came before.
    if (rendered.length > 0) {
      rendered.push(isListItem && previousWasListItem ? "\n" : "\n\n");
    }
    rendered.push(markdown);
    previousWasListItem = isListItem;
  }

  return rendered.join("");
}
