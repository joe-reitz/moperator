export type TerminalLine = {
  type: "cmd" | "ok" | "out" | "plain";
  text: string;
};

const LINE_COLOR: Record<TerminalLine["type"], string> = {
  cmd: "text-muted",
  ok: "text-accent",
  out: "text-foreground",
  plain: "text-muted",
};

/** Glyph that opens each line. Terminal context is the only place these belong. */
const GLYPH: Partial<Record<TerminalLine["type"], string>> = {
  ok: "✓ ",
  out: "→ ",
};

export function TerminalWindow({
  title = "~/projects/my-ai-app",
  lines,
  cursor = true,
  glow = false,
  className = "",
}: {
  title?: string;
  lines: TerminalLine[];
  cursor?: boolean;
  glow?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[--radius-lg] border bg-surface ${
        glow
          ? "border-accent-dim shadow-[0_0_30px_var(--accent-glow-soft)]"
          : "border-border"
      } ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="h-[11px] w-[11px] rounded-full bg-danger/80" />
        <span className="h-[11px] w-[11px] rounded-full bg-warning/80" />
        <span className="h-[11px] w-[11px] rounded-full bg-accent/80" />
        <span className="ml-2 font-mono text-xs text-muted">{title}</span>
      </div>

      <div className="p-[18px] font-mono text-[13.5px] leading-[2]">
        {lines.map((line, i) => (
          <div key={i} className={LINE_COLOR[line.type]}>
            {line.type === "cmd" && <span className="text-accent">$ </span>}
            {GLYPH[line.type]}
            {line.text}
          </div>
        ))}
        {cursor && (
          <div className="flex items-center text-muted">
            <span className="text-accent">$</span>
            <span
              className="ml-2 inline-block h-4 w-2 bg-accent cursor-blink"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
    </div>
  );
}
