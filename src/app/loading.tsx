export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 font-mono text-sm text-muted">
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        Loading…
      </div>
    </div>
  );
}
