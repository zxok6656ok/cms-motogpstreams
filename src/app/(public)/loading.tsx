import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "./components/skeleton";

const Loading = () => {
  return (
    <div className="mx-auto max-w-6xl px-2  py-2">
      <Skeleton
        className="
          h-96 w-full
          mb-2
          rounded-none
          border-4 border-black
          bg-neutral-200
          shadow-[8px_8px_0_#000]
        "
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
};

export default Loading;
