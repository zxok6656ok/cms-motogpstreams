import Link from "next/link";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#FFFDF5] px-4 py-12">
      <div className="w-full max-w-2xl">
        <div
          className="
            border-4 border-black
            bg-white
            p-6
            shadow-[8px_8px_0_#000]
            sm:p-10
          "
        >
          {/* Icon */}
          <div
            className="
              mb-6
              flex size-20
              items-center justify-center
              border-4 border-black
              bg-[#ff90e8]
              shadow-[5px_5px_0_#000]
            "
          >
            <SearchX className="size-10 stroke-[3]" />
          </div>

          {/* 404 */}
          <p className="text-7xl font-black leading-none tracking-tighter sm:text-9xl">
            404
          </p>

          <h1 className="mt-4 text-3xl font-black uppercase tracking-tight sm:text-4xl">
            Page Not Found
          </h1>

          <p className="mt-4 max-w-lg text-base font-medium leading-relaxed text-neutral-700">
            Sorry, the page you are looking for is not available or may have been moved.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="
                inline-flex
                items-center gap-2
                border-2 border-black
                bg-[#4d7aff]
                px-5 py-3
                font-black
                uppercase
                shadow-[4px_4px_0_#000]
                transition-all
                hover:translate-x-1
                hover:translate-y-1
                hover:shadow-none
              "
            >
              <Home className="size-5 stroke-3" />
              Back to Home
            </Link>

           
          </div>
        </div>
      </div>
    </main>
  );
}