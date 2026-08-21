import type { ReactNode } from "react";

export function Card({
  icon,
  title,
  className = "",
  children,
}: {
  icon?: ReactNode;
  title?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={`rounded-[--radius-lg] border border-border bg-surface p-6 transition-colors duration-200 hover:border-accent/35 ${className}`}
    >
      {icon && (
        <div
          className="mb-4 flex h-11 w-11 items-center justify-center rounded-[--radius-md] bg-[var(--accent-glow-soft)] text-accent"
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      {title && (
        <h3 className="mb-2 text-[17px] font-semibold text-foreground">{title}</h3>
      )}
      {children && (
        <p className="text-sm leading-relaxed text-muted">{children}</p>
      )}
    </div>
  );
}
