"use client";

import { useEffect, useRef, useState } from "react";

interface DialogFloatOptions {
  maxTilt?: number;
  maxOffset?: number;
  strength?: number;
  marginX?: number;
  marginY?: number;
}

export function useDialogFloat<T extends HTMLElement>({
  maxTilt = 5,
  maxOffset = 30,
  strength = 0.1,
  marginX = 200,
  marginY = 200,
}: DialogFloatOptions = {}) {
  const ref = useRef<T>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, x: 0, y: 0 });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const insideZone =
        e.clientX >= rect.left - marginX &&
        e.clientX <= rect.right + marginX &&
        e.clientY >= rect.top - marginY &&
        e.clientY <= rect.bottom + marginY;

      if (!insideZone) {
        setTransform({ rotateX: 0, rotateY: 0, x: 0, y: 0 });
        return;
      }

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      // Tilt: proporțional cu poziția normalizată în interiorul dialogului (clamp -1..1)
      const normX = Math.max(-1, Math.min(1, dx / (rect.width / 2)));
      const normY = Math.max(-1, Math.min(1, dy / (rect.height / 2)));

      // Magnet: proporțional cu distanța reală, plafonat
      const x = Math.max(-maxOffset, Math.min(maxOffset, dx * strength));
      const y = Math.max(-maxOffset, Math.min(maxOffset, dy * strength));

      setTransform({
        rotateX: -normY * maxTilt,
        rotateY: normX * maxTilt,
        x,
        y,
      });
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [maxTilt, maxOffset, strength, marginX, marginY]);

  const style: React.CSSProperties = {
    transform: `translate(${transform.x}px, ${transform.y}px) perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
    transition: "transform 0.15s ease-out",
  };

  return { ref, style };
}