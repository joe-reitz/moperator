export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { success, error } = await searchParams;

  return (
    <main className="min-h-screen relative flex items-center justify-center px-4">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-4 sm:px-6 sm:py-6 md:px-12 lg:px-20">
        <a href="/" className="flex items-center gap-2 sm:gap-4">
          <img
            src="/icon.svg"
            alt="The MOPerator"
            className="h-10 sm:h-14 md:h-16 lg:h-20 w-auto"
          />
          <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight">
            The <span className="text-accent glow-text">MOP</span>erator
          </span>
        </a>
      </nav>

      <div className="text-center max-w-md">
        {success === "true" ? (
          <>
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">
              You&apos;ve been unsubscribed
            </h1>
            <p className="text-muted mb-8">
              You won&apos;t receive any more emails from The MOPerator. 
              We&apos;re sorry to see you go!
            </p>
            <a
              href="/"
              className="inline-block gradient-border rounded-lg px-6 py-3 font-medium hover:bg-surface-elevated transition-colors"
            >
              Back to Home
            </a>
          </>
        ) : error ? (
          <>
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">
              Something went wrong
            </h1>
            <p className="text-muted mb-8">
              {error === "notfound"
                ? "We couldn't find that email address in our system."
                : error === "missing"
                ? "The unsubscribe link appears to be invalid."
                : "There was an error processing your request. Please try again."}
            </p>
            <a
              href="/"
              className="inline-block gradient-border rounded-lg px-6 py-3 font-medium hover:bg-surface-elevated transition-colors"
            >
              Back to Home
            </a>
          </>
        ) : (
          <>
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">Unsubscribe</h1>
            <p className="text-muted">Processing your request...</p>
          </>
        )}
      </div>
    </main>
  );
}

