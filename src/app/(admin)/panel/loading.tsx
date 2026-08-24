import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40 rounded-sm" />
          <Skeleton className="h-4 w-64 rounded-sm" />
        </div>

        <Skeleton className="h-9 w-28 rounded-sm" />
      </div>

      <div className="rounded-sm border">
        <div className="border-b p-4">
          <Skeleton className="h-9 w-full rounded-sm" />
        </div>

        <div className="space-y-4 p-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-40 rounded-sm" />
              <Skeleton className="h-4 w-24 rounded-sm" />
              <Skeleton className="h-4 w-20 rounded-sm" />
              <Skeleton className="ml-auto h-8 w-8 rounded-sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
