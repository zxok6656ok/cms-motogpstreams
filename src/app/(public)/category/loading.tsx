
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <main className="mx-auto w-full  px-4 py-8 sm:py-10">
      <Skeleton className="h-96 w-full rounded-xl bg-muted" />
    </main>
  );
};

export default Loading;
