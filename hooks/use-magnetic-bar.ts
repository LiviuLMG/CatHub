"use client";

import { useEffect, useRef, useState } from "react";

interface UseMagneticBarOptions {
  marginX?: number;
  marginY?: number;
  strength?: number;
  maxOffset?: number;
}

export function useMagneticBar<T extends HTMLElement>({
  marginX = 180,
  marginY = 180,
  strength = 0.15,
  maxOffset = 20,
}: UseMagneticBarOptions = {}) {
  const ref = useRef<T>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const left = rect.left - marginX;
      const right = rect.right + marginX;
      const top = rect.top - marginY;
      const bottom = rect.bottom + marginY;

      const insideZone =
        e.clientX >= left &&
        e.clientX <= right &&
        e.clientY >= top &&
        e.clientY <= bottom;

      if (insideZone) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;

        const pullX = Math.max(-maxOffset, Math.min(maxOffset, dx * strength));
        const pullY = Math.max(-maxOffset, Math.min(maxOffset, dy * strength));
        setOffset({ x: pullX, y: pullY });
      } else {
        setOffset({ x: 0, y: 0 });
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [marginX, marginY, strength, maxOffset]);

  return { ref, offset };
}