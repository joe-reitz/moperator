"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <p className="font-mono text-accent text-sm mb-4">Something broke</p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          That didn&apos;t work
        </h1>
        <p className="text-muted mb-8">
          An unexpected error occurred. Trying again usually helps — if it
          doesn&apos;t, the problem is on our end.
        </p>
        {error.digest && (
          <p className="font-mono text-xs text-muted mb-8">
            Reference: {error.digest}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            type="button"
            onClick={reset}
            className="gradient-border rounded-lg px-6 py-3 font-medium hover:bg-surface-elevated transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="border border-border rounded-lg px-6 py-3 font-medium text-muted hover:text-foreground hover:border-muted transition-colors"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
