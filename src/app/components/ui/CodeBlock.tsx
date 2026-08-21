/** Copy-pasteable commands. Mono, scrollable, never wraps mid-token. */
export function CodeBlock({
  children,
  label,
}: {
  children: string;
  label?: string;
}) {
  return (
    <div className="my-5 overflow-hidden rounded-[--radius-md] border border-border bg-surface">
      {label && (
        <div className="border-b border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[var(--tracking-label)] text-muted-dim">
          {label}
        </div>
      )}
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-[1.9] text-foreground">
        <code>{children}</code>
      </pre>
    </div>
  );
}
