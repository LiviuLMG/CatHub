"use client";

import { useInView } from "@/hooks/use-in-view";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: isInView ? `${delay}ms` : "0ms" }}
      className={`transition-all duration-700 ease-out ${
        isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}