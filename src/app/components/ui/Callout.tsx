import type { ReactNode } from "react";

type Tone = "note" | "warning";

const TONES: Record<Tone, { border: string; label: string; text: string }> = {
  note: { border: "border-l-accent", label: "text-accent", text: "Note" },
  warning: { border: "border-l-warning", label: "text-warning", text: "Heads up" },
};

export function Callout({
  tone = "note",
  title,
  children,
}: {
  tone?: Tone;
  title?: string;
  children: ReactNode;
}) {
  const t = TONES[tone];
  return (
    <aside
      className={`my-6 rounded-r-[--radius-md] border-l-[3px] bg-surface px-5 py-4 ${t.border}`}
    >
      <p
        className={`mb-1.5 font-mono text-[11px] uppercase tracking-[var(--tracking-label)] ${t.label}`}
      >
        {title ?? t.text}
      </p>
      <div className="text-[15px] leading-relaxed text-muted">{children}</div>
    </aside>
  );
}
