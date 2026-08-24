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
    <div
      className="
        flex h-full flex-col
        border-4 border-black
        bg-white
        shadow-[7px_7px_0_#000]
      "
    >
      {showImage && (
        <Skeleton className="aspect-video w-full rounded-none border-b-4 border-black" />
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 space-y-2">
          {Array.from({ length: titleLines }).map((_, index) => (
            <Skeleton
              key={index}
              className={`h-7 rounded-sm ${
                index === titleLines - 1 ? "w-4/5" : "w-full"
              }`}
            />
          ))}
        </div>

        {showTags && (
          <div className="mb-4 flex min-h-8 gap-2">
            <Skeleton className="h-7 w-20 rounded-sm" />
            <Skeleton className="h-7 w-24 rounded-sm" />
          </div>
        )}

        {showDescription && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded-sm" />
            <Skeleton className="h-4 w-full rounded-sm" />
            <Skeleton className="h-4 w-3/4 rounded-sm" />
          </div>
        )}

        {showFooter && (
          <div className="mt-auto flex items-center justify-between gap-3 pt-6">
            <Skeleton className="h-4 w-24 rounded-sm" />
            <Skeleton className="h-10 w-24 rounded-sm" />
          </div>
        )}
      </div>
    </div>
  );
}