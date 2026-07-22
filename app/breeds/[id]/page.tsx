import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, MapPin, Cat } from "lucide-react";
import { getBreedById, getBreedImageUrl } from "@/lib/cat-api";
import { AnimatedStatBar } from "@/components/animated-stat-bar";
import { BreedStatsSection } from "@/components/breed-stats-section";

const statLabels: { key: keyof Awaited<ReturnType<typeof getBreedById>>; label: string }[] = [
  { key: "energy_level", label: "Energy" },
  { key: "affection_level", label: "Affection" },
  { key: "intelligence", label: "Intelligence" },
  { key: "child_friendly", label: "Child Friendly" },
  { key: "dog_friendly", label: "Dog Friendly" },
  { key: "social_needs", label: "Social Needs" },
  { key: "shedding_level", label: "Shedding" },
];

export default async function BreedDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let breed;
  try {
    breed = await getBreedById(id);
  } catch {
    notFound();
  }

  const imageUrl = getBreedImageUrl(breed);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href="/breeds"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to breeds
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Hero image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-muted shadow-lg">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={breed.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Cat size={64} className="text-muted-foreground/40" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {breed.name}
          </h1>

          <div className="mt-2 flex items-center gap-1.5 text-muted-foreground">
            <MapPin size={16} />
            <span className="text-sm">{breed.origin}</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {breed.temperament?.split(",").map((trait) => (
              <span
                key={trait}
                className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {trait.trim()}
              </span>
            ))}
          </div>

          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            {breed.description}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-5">
            <div>
              <p className="text-xs text-muted-foreground">Life span</p>
              <p className="text-sm font-semibold text-foreground">
                {breed.life_span} years
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Weight</p>
              <p className="text-sm font-semibold text-foreground">
                {breed.weight?.metric} kg
              </p>
            </div>
          </div>

          {breed.wikipedia_url && (

            <a href={breed.wikipedia_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              Read on Wikipedia
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      {/* Statistics */}
      <BreedStatsSection breed={breed} statLabels={statLabels} />
    </main>
  );
}