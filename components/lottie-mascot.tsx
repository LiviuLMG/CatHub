"use client";

import { useEffect, useRef, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const ANIMATIONS = [
  "/lottie/cat-1.lottie",
  "/lottie/cat-2.lottie",
  "/lottie/cat-3.lottie",
];

const VISIBLE_DURATION = 14000; // cât stă vizibilă o animație
const HIDDEN_DURATION = 10000; // pauza dintre animații

export function LottieMascot() {
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const lastIndex = useRef<number | null>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    function pickNext() {
      let index = Math.floor(Math.random() * ANIMATIONS.length);
      // evită să repete aceeași animație de două ori la rând
      if (ANIMATIONS.length > 1) {
        while (index === lastIndex.current) {
          index = Math.floor(Math.random() * ANIMATIONS.length);
        }
      }
      lastIndex.current = index;
      return ANIMATIONS[index];
    }

    function showCycle() {
      setCurrentSrc(pickNext());
      setVisible(true);

      timeoutId = setTimeout(() => {
        setVisible(false);
        timeoutId = setTimeout(showCycle, HIDDEN_DURATION);
      }, VISIBLE_DURATION);
    }

    // primă apariție, cu o mică întârziere de la load
    timeoutId = setTimeout(showCycle, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div
      style={{
        transform: visible ? "translateY(0)" : "translateY(100px)",
        opacity: visible ? 1 : 0,
        transition: visible
          ? "transform 0.4s ease-out, opacity 0.4s ease-out"
          : "transform 0.4s ease-in, opacity 0.3s ease-in",
        pointerEvents: "none",
      }}
      className="fixed -bottom-5 right-30 z-40 hidden h-40 w-40 sm:block"
    >
      {currentSrc && (
        <DotLottieReact src={currentSrc} loop autoplay className="h-full w-full" />
      )}
    </div>
  );
}