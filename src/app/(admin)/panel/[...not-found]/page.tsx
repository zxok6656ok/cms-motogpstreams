import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function PanelNotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-xl border bg-muted/50">
          <FileQuestion className="size-8 text-muted-foreground" />
        </div>

        <h1 className="mt-6 text-4xl font-bold tracking-tight">404</h1>

        <h2 className="mt-2 text-xl font-semibold">Page Not Found</h2>

        <p className="mt-2 text-sm text-muted-foreground">
         The panel page you are looking for is unavailable or has been moved.
        </p>

        <Link
          href="/panel/dashboard"
          className="
            mt-6
            inline-flex
            items-center
            gap-2
            rounded-md
            border
            bg-background
            px-4
            py-2
            text-sm
            font-medium
            shadow-sm
            transition-colors
            hover:bg-accent
            hover:text-accent-foreground
          "
        >
          <ArrowLeft className="size-4" />
          Kembali ke Panel
        </Link>
      </div>
    </div>
  );
}
