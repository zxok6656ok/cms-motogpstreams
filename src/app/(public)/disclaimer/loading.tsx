import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Skeleton className="h-96 w-full rounded-sm" />
    </main>
  );
};

export default Loading;
