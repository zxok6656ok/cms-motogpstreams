
import { Skeleton } from "@/components/ui/skeleton";

type SkeletonCardProps = {
  showImage?: boolean;
  showTags?: boolean;
  showDescription?: boolean;
  showFooter?: boolean;
  titleLines?: number;
};

export function SkeletonCard({
  showImage = true,
  showTags = true,
  showDescription = true,
  showFooter = true,
  titleLines = 2,
}: SkeletonCardProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-card">
      {showImage && (
        <Skeleton className="aspect-video w-full rounded-none" />
      )}

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-4 space-y-2">
          {Array.from({ length: titleLines }).map((_, index) => (
            <Skeleton
              key={index}
              className={`h-5 rounded-md ${
                index === titleLines - 1 ? "w-4/5" : "w-full"
              }`}
            />
          ))}
        </div>

        {showTags && (
          <div className="mb-4 flex min-h-7 flex-wrap gap-2">
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-6 w-24 rounded-md" />
          </div>
        )}

        {showDescription && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
          </div>
        )}

        {showFooter && (
          <div className="mt-auto flex items-center justify-between gap-3 pt-6">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        )}
      </div>
    </div>
  );
}
