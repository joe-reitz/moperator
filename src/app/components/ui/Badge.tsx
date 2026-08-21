import type { ReactNode } from "react";

type Variant = "accent" | "muted" | "outline";

const VARIANTS: Record<Variant, string> = {
  accent: "text-accent border-accent/30 bg-[var(--accent-glow-soft)]",
  muted: "text-muted border-border bg-surface",
  outline: "text-foreground border-border-strong bg-transparent",
};

export function Badge({
  variant = "accent",
  dot = false,
  className = "",
  children,
}: {
  variant?: Variant;
  dot?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-[5px] font-mono text-xs ${VARIANTS[variant]} ${className}`}
    >
      {dot && (
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent animate-pulse"
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
