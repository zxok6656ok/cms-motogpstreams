
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "./components/skeleton";

const Loading = () => {
  return (
    <div className="mx-auto w-full  px-4 py-4">
      <Skeleton className="mb-4 h-96 w-full rounded-xl bg-muted" />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
};

export default Loading;
