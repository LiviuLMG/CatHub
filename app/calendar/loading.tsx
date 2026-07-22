import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarLoading() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Skeleton className="h-9 w-40 animate-shimmer" />
      <Skeleton className="mt-3 h-5 w-64 animate-shimmer" />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        <Skeleton className="h-105 w-full animate-shimmer rounded-3xl" />
        <Skeleton className="h-105 w-full animate-shimmer rounded-3xl" />
      </div>
    </main>
  );
}