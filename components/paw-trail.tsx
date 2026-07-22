"use client";

import { useEffect, useRef, useState } from "react";

interface Paw {
  id: number;
  x: number;
  y: number;
  rotation: number;
  flip: boolean;
}

let pawCounter = 0;

export function PawTrail() {
  const [paws, setPaws] = useState<Paw[]>([]);
  const lastSpawn = useRef(0);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      const now = Date.now();
      if (now - lastSpawn.current < 220) return; // throttling, o urmă la ~220ms
      lastSpawn.current = now;

      const id = pawCounter++;
      const newPaw: Paw = {
        id,
        x: e.clientX,
        y: e.clientY,
        rotation: Math.random() * 40 - 20,
        flip: id % 2 === 0,
      };

      setPaws((prev) => [...prev, newPaw]);

      setTimeout(() => {
        setPaws((prev) => prev.filter((p) => p.id !== id));
      }, 900);
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-20 hidden lg:block">
      {paws.map((paw) => (
        <svg
          key={paw.id}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="var(--color-accent)"
          className="paw-fade absolute"
          style={{
            left: paw.x - 9,
            top: paw.y - 9,
            transform: `rotate(${paw.rotation}deg) scaleX(${paw.flip ? -1 : 1})`,
          }}
        >
          <circle cx="12" cy="16" r="5" />
          <circle cx="5" cy="8" r="2.4" />
          <circle cx="10.5" cy="4" r="2.4" />
          <circle cx="16.5" cy="5" r="2.4" />
        </svg>
      ))}
    </div>
  );
}