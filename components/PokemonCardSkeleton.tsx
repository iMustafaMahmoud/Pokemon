interface PokemonCardSkeletonProps {
  count?: number;
}

export default function PokemonCardSkeleton({
  count = 1,
}: PokemonCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-md shadow-md border border-gray-200 overflow-hidden animate-pulse"
        >
          <div className="h-48 bg-gray-200"></div>
          <div className="p-4 h-32 flex flex-col items-center justify-center">
            <div className="h-5 w-30 bg-gray-200 rounded mb-2"></div>
            <div className="h-5 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </>
  );
}
