import { Skeleton } from "@/components/ui/skeleton";

interface WorkspaceSkeletonProps {
  cards?: number;
  columns?: string;
}

export function WorkspaceSkeleton({ cards = 8, columns = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" }: WorkspaceSkeletonProps) {
  return (
    <div className="flex flex-1 flex-col overflow-auto animate-fade-in">
      {/* Header skeleton */}
      <div className="mx-4 mt-4 rounded-2xl p-5 glass-subtle">
        <Skeleton className="h-4 w-48 mb-3" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-xl" />
          <div>
            <Skeleton className="h-5 w-64 mb-1" />
            <Skeleton className="h-3.5 w-40" />
          </div>
        </div>
      </div>

      {/* Cards skeleton */}
      <div className={`grid ${columns} gap-4 p-8`}>
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className="rounded-2xl p-5 glass space-y-3">
            <div className="flex items-start justify-between">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
