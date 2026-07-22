"use client";

import { useEffect, useState } from "react";

interface AnimatedStatBarProps {
  label: string;
  value: number;
  max?: number;
  delay?: number;
  active?: boolean;
}

export function AnimatedStatBar({
  label,
  value,
  max = 5,
  delay = 0,
  active = true,
}: AnimatedStatBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!active) {
      setWidth(0);
      return;
    }
    const timeout = setTimeout(() => {
      setWidth((value / max) * 100);
    }, delay);
    return () => clearTimeout(timeout);
  }, [active, value, max, delay]);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm text-muted-foreground">
          {value}/{max}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}