import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "terminal";
type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, string> = {
  sm: "text-[13px] px-3.5 py-[7px]",
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-6 py-3.5 sm:px-7",
};

// Hover lives in CSS, not JS handlers, so these stay server components.
const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-accent text-background border border-transparent hover:brightness-110",
  secondary:
    "bg-transparent text-foreground border border-border-strong hover:border-accent",
  ghost:
    "bg-transparent text-muted border border-transparent hover:text-foreground",
  terminal:
    "bg-surface text-accent border border-border font-mono hover:border-accent",
};

function classes(variant: Variant, size: Size, glow: boolean, extra?: string) {
  return [
    "inline-flex items-center justify-center gap-2 rounded-[--radius-md] font-semibold",
    "transition-[color,border-color,filter] duration-200",
    SIZES[size],
    VARIANTS[variant],
    glow ? "shadow-[0_0_18px_var(--accent-glow)]" : "",
    extra ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

type Common = { variant?: Variant; size?: Size; glow?: boolean; children: ReactNode };

export function Button({
  variant = "primary",
  size = "md",
  glow = false,
  className,
  children,
  ...rest
}: Common & ComponentProps<"button">) {
  return (
    <button className={classes(variant, size, glow, className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  glow = false,
  className,
  children,
  ...rest
}: Common & ComponentProps<typeof Link>) {
  return (
    <Link className={classes(variant, size, glow, className)} {...rest}>
      {children}
    </Link>
  );
}
