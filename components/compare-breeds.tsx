"use client";

import { useEffect, useMemo, useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import Image from "next/image";
import { ArrowLeftRight, Cat } from "lucide-react";
import { type CatBreed, getBreedImageUrl } from "@/lib/cat-api";
import { TiltLink } from "./tilt-link";

const statLabels: { key: keyof CatBreed; label: string }[] = [
  { key: "energy_level", label: "Energy" },
  { key: "affection_level", label: "Affection" },
  { key: "intelligence", label: "Intelligence" },
  { key: "child_friendly", label: "Child Friendly" },
  { key: "dog_friendly", label: "Dog Friendly" },
  { key: "social_needs", label: "Social Needs" },
  { key: "shedding_level", label: "Shedding" },
];

interface CompareBreedsProps {
  breeds: CatBreed[];
}

export function CompareBreeds({ breeds }: CompareBreedsProps) {
  const [breedAId, setBreedAId] = useState(breeds[0]?.id ?? "");
  const [breedBId, setBreedBId] = useState(breeds[1]?.id ?? "");

  const breedA = useMemo(
    () => breeds.find((b) => b.id === breedAId),
    [breeds, breedAId]
  );
  const breedB = useMemo(
    () => breeds.find((b) => b.id === breedBId),
    [breeds, breedBId]
  );


  const { ref: statsRef, isInView } = useInView(0.2);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isInView) {
      setMounted(false);
      return;
    }
    setMounted(false);
    const timeout = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timeout);
  }, [isInView, breedAId, breedBId]);


  function swap() {
    setBreedAId(breedBId);
    setBreedBId(breedAId);
  }

  return (
    <div>
      {/* Selectors */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <select
          value={breedAId}
          onChange={(e) => setBreedAId(e.target.value)}
          className="h-11 w-full max-w-xs rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:w-64"
        >
          {breeds.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <button
          onClick={swap}
          aria-label="Swap breeds"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeftRight size={18} />
        </button>

        <select
          value={breedBId}
          onChange={(e) => setBreedBId(e.target.value)}
          className="h-11 w-full max-w-xs rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:w-64"
        >
          {breeds.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {breedA && breedB && (
        <div className="mt-12">
          {/* Images + names */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {[breedA, breedB].map((breed) => {
              const imageUrl = getBreedImageUrl(breed);
              return (
                <TiltLink
                  key={breed.id}
                  href={`/breeds/${breed.id}`}
                  className="group flex flex-col items-center text-center"
                >
                  <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-3xl bg-muted shadow-lg transition-shadow duration-300 group-hover:shadow-xl">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={breed.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 320px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Cat size={40} className="text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                    {breed.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">{breed.origin}</p>
                </TiltLink>
              );
            })}
          </div>
            
          {/* Quick facts */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6">
            {[breedA, breedB].map((breed) => (
              <div
                key={breed.id}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Life span</span>
                  <span className="font-medium text-foreground">
                    {breed.life_span} yrs
                  </span>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">Weight</span>
                  <span className="font-medium text-foreground">
                    {breed.weight?.metric} kg
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Stats comparison */}
          <div
            ref={statsRef}
            className={`mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8 transition-all duration-700 ease-out ${isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
          >
            <div className="mb-6 flex items-center justify-between text-sm font-semibold">
              <span className="text-primary">{breedA.name}</span>
              <span className="text-secondary">{breedB.name}</span>
            </div>

            <div className="flex flex-col gap-5">
              {statLabels.map(({ key, label }, index) => {
                const valueA = Number(breedA[key]) || 0;
                const valueB = Number(breedB[key]) || 0;
                return (
                  <div key={key}>
                    <p className="mb-1.5 text-center text-xs font-medium text-muted-foreground">
                      {label}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex h-2 flex-1 justify-end overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                          style={{
                            width: mounted ? `${(valueA / 5) * 100}%` : "0%",
                            transitionDelay: `${index * 60}ms`,
                          }}
                        />
                      </div>
                      <span className="w-5 shrink-0 text-center text-[10px] text-muted-foreground">
                        vs
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-secondary transition-all duration-700 ease-out"
                          style={{
                            width: mounted ? `${(valueB / 5) * 100}%` : "0%",
                            transitionDelay: `${index * 60}ms`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}