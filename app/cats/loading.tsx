import { Skeleton } from "@/components/ui/skeleton";

export default function CatsLoading() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Skeleton className="h-4 w-24 animate-shimmer" />
          <Skeleton className="mt-3 h-10 w-48 animate-shimmer" />
        </div>
        <Skeleton className="h-11 w-32 animate-shimmer rounded-xl" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-3xl bg-card shadow-sm">
            <Skeleton className="aspect-4/3 w-full animate-shimmer rounded-none" />
            <div className="p-5">
              <Skeleton className="h-5 w-2/3 animate-shimmer" />
              <Skeleton className="mt-2 h-4 w-1/2 animate-shimmer" />
              <div className="mt-4 flex gap-4">
                <Skeleton className="h-4 w-16 animate-shimmer" />
                <Skeleton className="h-4 w-16 animate-shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}