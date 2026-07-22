import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <Skeleton className="h-9 w-72 animate-shimmer" />
      <Skeleton className="mt-3 h-5 w-56 animate-shimmer" />

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5">
            <Skeleton className="h-4 w-20 animate-shimmer" />
            <Skeleton className="mt-3 h-7 w-10 animate-shimmer" />
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Skeleton className="h-6 w-32 animate-shimmer" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
                <Skeleton className="h-16 w-16 shrink-0 animate-shimmer rounded-xl" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 animate-shimmer" />
                  <Skeleton className="mt-2 h-3 w-16 animate-shimmer" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <Skeleton className="h-4 w-24 animate-shimmer" />
            <div className="mt-3 flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full animate-shimmer rounded-xl" />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <Skeleton className="h-4 w-20 animate-shimmer" />
            <Skeleton className="mt-3 h-4 w-full animate-shimmer" />
          </div>
        </div>
      </div>
    </main>
  );
}