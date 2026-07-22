import { AnimatedStat } from "@/components/animated-stat";

const stats = [
  { target: 100, suffix: "+", label: "Cats managed" },
  { target: 70, suffix: "+", label: "Breeds documented" },
  { target: 4.9, decimals: 1, label: "User reviews" },
  { target: 98, suffix: "%", label: "Owners tracking health" },
];

export function Stats() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-5">
      <div className="grid grid-cols-2 gap-8 rounded-4xl border border-border bg-card px-8 py-10 shadow-lg md:grid-cols-4 md:px-12">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-1 text-center"
          >
            <AnimatedStat
              target={stat.target}
              decimals={stat.decimals}
              suffix={stat.suffix}
            />
            <span className="text-sm text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}