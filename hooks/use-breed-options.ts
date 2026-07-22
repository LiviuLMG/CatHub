"use client";

import { useEffect, useState } from "react";

let cachedBreedNames: string[] | null = null;

export function useBreedOptions() {
  const [breeds, setBreeds] = useState<string[]>(cachedBreedNames ?? []);
  const [loading, setLoading] = useState(!cachedBreedNames);

  useEffect(() => {
    if (cachedBreedNames) return;

    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/breeds");
        const data = await res.json();
        const names = (data as { name: string }[])
          .map((b) => b.name)
          .sort((a, b) => a.localeCompare(b));
        if (!cancelled) {
          cachedBreedNames = names;
          setBreeds(names);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { breeds, loading };
}