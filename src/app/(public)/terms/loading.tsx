import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Skeleton
        className="
          h-96 w-full
          rounded-none
          border-4 border-black
          bg-neutral-200
          shadow-[8px_8px_0_#000]
        "
      />
    </main>
  );
};

export default Loading;