import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";

export default function NotFound() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      <SiteHeader />

      <main
        id="main-content"
        className="relative z-10 flex-1 flex items-center justify-center px-4 py-20"
      >
        <div className="text-center max-w-lg">
          <p className="font-mono text-accent text-sm mb-4">404</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            This page didn&apos;t ship
          </h1>
          <p className="text-muted mb-8">
            The page you&apos;re looking for doesn&apos;t exist, or it moved
            somewhere better.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/"
              className="gradient-border rounded-lg px-6 py-3 font-medium hover:bg-surface-elevated transition-colors"
            >
              Back home
            </Link>
            <Link
              href="/blog"
              className="border border-border rounded-lg px-6 py-3 font-medium text-muted hover:text-foreground hover:border-muted transition-colors"
            >
              Read the blog
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
