
import Link from "next/link";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="rounded-2xl border bg-card p-6 sm:p-10">
          {/* Icon */}
          <div className="mb-6 flex size-14 items-center justify-center rounded-xl bg-muted">
            <SearchX className="size-7 text-muted-foreground" />
          </div>

          {/* 404 */}
          <p className="text-7xl font-bold leading-none tracking-tight sm:text-8xl">
            404
          </p>

          <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            Page Not Found
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
            Sorry, the page you are looking for is not available or may have
            been moved.
          </p>

          {/* Actions */}
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Home className="size-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
