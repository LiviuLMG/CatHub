import { getAllBreeds } from "@/lib/cat-api";
import { CompareBreeds } from "@/components/compare-breeds";

export default async function ComparePage() {
  const breeds = await getAllBreeds();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Compare
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Compare two breeds
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          See how two breeds stack up side by side — temperament, energy,
          and everything in between.
        </p>
      </div>

      <CompareBreeds breeds={breeds} />
    </main>
  );
}