"use client";

import { useCountUp } from "@/hooks/use-count-up";

interface AnimatedStatProps {
  target: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

export function AnimatedStat({
  target,
  decimals = 0,
  prefix = "",
  suffix = "",
}: AnimatedStatProps) {
  const value = useCountUp(target);

  const formatted = decimals > 0
    ? value.toFixed(decimals)
    : Math.round(value).toLocaleString("en-US");

  return (
    <span className="text-3xl font-bold text-foreground md:text-4xl">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}