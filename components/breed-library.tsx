"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Cat as CatIcon } from "lucide-react";
import { TiltLink } from "@/components/tilt-link";
import { type CatBreed, getBreedImageUrl } from "@/lib/cat-api";

const ROTATE_INTERVAL = 8000;

function pickRandom(breeds: CatBreed[], count: number): CatBreed[] {
  const shuffled = [...breeds].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

interface BreedLibraryProps {
  breeds: CatBreed[];
}

export function BreedLibrary({ breeds }: BreedLibraryProps) {
  const [displayed, setDisplayed] = useState<CatBreed[]>([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (breeds.length === 0) return;
    setDisplayed(pickRandom(breeds, 4));

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setDisplayed(pickRandom(breeds, 4));
        setVisible(true);
      }, 300);
    }, ROTATE_INTERVAL);

    return () => clearInterval(interval);
  }, [breeds]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Breed Library
          </p>
          <h2 className="mt-5 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Get to know your cat&apos;s breed
          </h2>
        </div>

        <Link
          href="/breeds"
          className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          Explore all breeds
          <ArrowRight size={16} />
        </Link>
      </div>

      <div
        className={`mt-12 grid gap-6 transition-opacity duration-300 sm:grid-cols-2 lg:grid-cols-4 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        {displayed.map((breed) => {
          const imageUrl = getBreedImageUrl(breed);

          return (
            <TiltLink
              key={breed.id}
              href={`/breeds/${breed.id}`}
              className="group overflow-hidden rounded-3xl bg-card shadow-sm transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-muted">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={breed.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <CatIcon size={40} className="text-muted-foreground/40" />
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold text-foreground">
                  {breed.name}
                </h3>
                <p className="text-sm text-muted-foreground">{breed.origin}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {breed.temperament
                    ?.split(",")
                    .slice(0, 2)
                    .map((trait) => (
                      <span
                        key={trait}
                        className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {trait.trim()}
                      </span>
                    ))}
                </div>
              </div>
            </TiltLink>
          );
        })}
      </div>
    </section>
  );
}