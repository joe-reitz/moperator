/**
 * Code blocks inside article body copy.
 *
 * The brand handoff specifies the TerminalWindow frame for article code, so this
 * reuses its chrome — traffic lights and a mono caption bar — while keeping the
 * body a plain <pre> so any language renders correctly, not just shell
 * transcripts (TerminalWindow's typed line model only suits those).
 */
export type SanityCode = {
  code?: string;
  language?: string;
  filename?: string;
};

const LANGUAGE_LABELS: Record<string, string> = {
  sh: "shell",
  typescript: "typescript",
  javascript: "javascript",
  jsx: "tsx",
  json: "json",
  sql: "sql",
  python: "python",
  html: "html",
  css: "css",
  markdown: "markdown",
  text: "text",
};

export function ArticleCodeBlock({ value }: { value: SanityCode }) {
  const code = value?.code;
  if (!code) return null;

  const caption =
    value.filename || LANGUAGE_LABELS[value.language ?? ""] || value.language;

  return (
    <figure className="article-code">
      <div className="article-code-bar">
        <span className="article-code-dot article-code-dot-danger" />
        <span className="article-code-dot article-code-dot-warning" />
        <span className="article-code-dot article-code-dot-accent" />
        {caption && <span className="article-code-caption">{caption}</span>}
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </figure>
  );
}
