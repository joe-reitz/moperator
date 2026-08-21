/**
 * Phosphor logo: lowercase m + ring-O + blinking block cursor.
 *
 * The brand rules allow exactly two lockups and forbid combining them:
 *   - LogoMark  — header only, mark by itself (~58px basis)
 *   - Wordmark  — footer only, mono `the mOperator_`
 *
 * Rendered in live CSS rather than as an SVG so the cursor can blink.
 */

/** Geometric mark. Decorative — give the wrapping link an accessible name. */
export function LogoMark({ size = 58 }: { size?: number }) {
  const s = size / 30;

  return (
    <span className="inline-flex items-center" aria-hidden="true">
      <span
        className="font-bold text-foreground"
        style={{ fontSize: 30 * s, letterSpacing: "-0.04em", lineHeight: 1 }}
      >
        m
      </span>
      <span
        className="box-border rounded-full"
        style={{
          width: 25 * s,
          height: 25 * s,
          border: `${4 * s}px solid var(--accent)`,
          marginLeft: 3 * s,
          boxShadow: "0 0 10px var(--accent-glow)",
        }}
      />
      <span
        className="cursor-block"
        style={{ width: 7 * s, height: 19 * s, marginLeft: 4 * s }}
      />
    </span>
  );
}

/** Typeset mono wordmark for the footer. The trailing underscore blinks. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-mono font-bold text-base text-foreground ${className}`}>
      the m<span className="text-accent">Operator</span>
      <span className="text-accent cursor-blink" aria-hidden="true">
        _
      </span>
    </span>
  );
}
