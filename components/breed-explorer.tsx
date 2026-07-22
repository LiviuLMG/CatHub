"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { type CatBreed, getBreedImageUrl } from "@/lib/cat-api";
import { Search, Cat } from "lucide-react";
import { TiltLink } from "@/components/tilt-link";

interface BreedExplorerProps {
    breeds: CatBreed[];
}

export function BreedExplorer({ breeds }: BreedExplorerProps) {
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        if (!query.trim()) return breeds;
        const q = query.toLowerCase();
        return breeds.filter(
            (b) =>
                b.name.toLowerCase().includes(q) ||
                b.origin?.toLowerCase().includes(q) ||
                b.temperament?.toLowerCase().includes(q)
        );
    }, [breeds, query]);

    return (
        <div>
            <div className="relative mb-10 max-w-md">
                <Search
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                    placeholder="Search by name, origin or temperament..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-11 pl-10"
                />
            </div>

            <p className="mb-6 text-sm text-muted-foreground">
                {filtered.length} breed{filtered.length !== 1 && "s"} found
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((breed) => (
                    <TiltLink
                        key={breed.id}
                        href={`/breeds/${breed.id}`}
                        className="group relative aspect-square overflow-hidden rounded-3xl bg-card shadow-sm transition-shadow hover:shadow-lg"
                    >
                        {getBreedImageUrl(breed) ? (
                            <Image
                                src={getBreedImageUrl(breed)!}
                                alt={breed.name}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-muted">
                                <Cat size={40} className="text-muted-foreground/40" />
                            </div>
                        )}

                        {/* Overlay gradient + text */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />

                        <div className="absolute inset-x-0 bottom-0 p-5">
                            <h3 className="text-lg font-semibold text-white">{breed.name}</h3>
                            <p className="text-sm text-white/80">{breed.origin}</p>

                            <div className="mt-2 flex flex-wrap gap-2">
                                {breed.temperament
                                    ?.split(",")
                                    .slice(0, 2)
                                    .map((trait) => (
                                        <span
                                            key={trait}
                                            className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
                                        >
                                            {trait.trim()}
                                        </span>
                                    ))}
                            </div>
                        </div>
                    </TiltLink>
                ))}
            </div>
        </div>
    );
}