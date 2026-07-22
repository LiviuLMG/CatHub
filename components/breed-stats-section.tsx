"use client";

import { useInView } from "@/hooks/use-in-view";
import { AnimatedStatBar } from "@/components/animated-stat-bar";
import type { CatBreed } from "@/lib/cat-api";

interface StatItem {
  key: keyof CatBreed;
  label: string;
}

interface BreedStatsSectionProps {
  breed: CatBreed;
  statLabels: StatItem[];
}

export function BreedStatsSection({ breed, statLabels }: BreedStatsSectionProps) {
  const { ref, isInView } = useInView(0.2);

  return (
    <div
      ref={ref}
      className={`mt-16 transition-all duration-700 ease-out ${
        isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <h2 className="text-2xl font-bold text-foreground">
        Breed characteristics
      </h2>

      <div className="mt-6 grid gap-x-10 gap-y-5 md:grid-cols-2">
        {statLabels.map(({ key, label }, index) => (
          <AnimatedStatBar
            key={key}
            label={label}
            value={Number(breed[key]) || 0}
            active={isInView}
            delay={index * 100}
          />
        ))}
      </div>
    </div>
  );
}