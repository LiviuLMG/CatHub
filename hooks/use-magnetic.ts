"use client";

import { useEffect, useRef, useState } from "react";

interface UseMagneticOptions {
  radius?: number;
  strength?: number;
  maxOffset?: number;
  enabled?: boolean;
}

export function useMagnetic<T extends HTMLElement>({
  radius = 100,
  strength = 0.3,
  maxOffset = 14,
  enabled = true,
}: UseMagneticOptions = {}) {
  const ref = useRef<T>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) {
      setOffset({ x: 0, y: 0 });
      return;
    }

    function handleMouseMove(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius) {
        const pullX = Math.max(-maxOffset, Math.min(maxOffset, dx * strength));
        const pullY = Math.max(-maxOffset, Math.min(maxOffset, dy * strength));
        setOffset({ x: pullX, y: pullY });
      } else {
        setOffset({ x: 0, y: 0 });
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [enabled, radius, strength, maxOffset]);

  return { ref, offset };
}