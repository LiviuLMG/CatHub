import { getAllBreeds } from "@/lib/cat-api";
import { BreedExplorer } from "@/components/breed-explorer";

export default async function BreedsPage() {
  const breeds = await getAllBreeds();

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Breed Library
        </p>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Explore every breed
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Search and filter through {breeds.length} cat breeds to find
          detailed profiles on temperament, care and characteristics.
        </p>
      </div>

      <BreedExplorer breeds={breeds} />
    </main>
  );
}