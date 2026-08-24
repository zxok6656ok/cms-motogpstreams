import { SkeletonCard } from "./components/skeleton";

const Loading = () => {
  return (
    <div className="mx-auto max-w-6xl px-2  py-2">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
};

export default Loading;
