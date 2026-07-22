"use client";

import { useRef, useState } from "react";

export function useTilt<T extends HTMLElement = HTMLElement>(maxTilt = 8) {
  const ref = useRef<T>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    transform: "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)",
    transition: "transform 0.4s ease-out",
  });

  function onMouseMove(e: React.MouseEvent<T>) {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setStyle({
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`,
      transition: "transform 0.1s ease-out",
    });
  }

  function onMouseLeave() {
    setStyle({
      transform: "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)",
      transition: "transform 0.4s ease-out",
    });
  }

  return { ref, style, onMouseMove, onMouseLeave };
}