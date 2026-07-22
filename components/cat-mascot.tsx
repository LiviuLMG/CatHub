"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

interface FloatingHeart {
  id: number;
}

let heartCounter = 0;

export function CatMascot() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  function spawnHeart() {
    const id = heartCounter++;
    setHearts((prev) => [...prev, { id }]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== id));
    }, 1200);
  }

  return (
    <div
      className="fixed bottom-4 left-4 z-30 hidden cursor-pointer select-none lg:block"
      onMouseEnter={() => setIsPlaying(true)}
      onMouseLeave={() => setIsPlaying(false)}
      onClick={spawnHeart}
    >
      <div className="relative">
        {/* Floating hearts */}
        {hearts.map((heart) => (
          <Heart
            key={heart.id}
            size={16}
            className="heart-float pointer-events-none absolute fill-destructive text-destructive"
            style={{ left: 50, top: 25 }}
          />
        ))}

        <svg
          width="110"
          height="90"
          viewBox="0 0 110 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Yarn ball */}
          <g
            style={{
              transformOrigin: "88px 72px",
              transform: isPlaying ? "rotate(35deg) translateX(-4px)" : "rotate(0deg)",
              transition: "transform 0.4s ease-out",
            }}
          >
            <circle cx="88" cy="72" r="12" className="fill-accent transition-colors duration-300" />
            <path
              d="M78 68 Q88 60 98 68 M78 76 Q88 84 98 76 M76 72 Q88 65 100 72"
              className="stroke-accent-foreground transition-colors duration-300"
              strokeWidth="1"
              strokeOpacity="0.35"
              fill="none"
            />
          </g>

          {/* Tail */}
          <path
            d="M20 55 Q2 50 4 32"
            className={`stroke-foreground transition-colors duration-300 ${
              isPlaying ? "cat-tail-wag-fast" : "cat-tail-wag"
            }`}
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Body */}
          <ellipse cx="45" cy="60" rx="30" ry="18" className="fill-foreground transition-colors duration-300" />

          {/* Head */}
          <circle cx="55" cy="38" r="20" className="fill-foreground transition-colors duration-300" />

          {/* Ears */}
          <path d="M40 26 L34 8 L52 22 Z" className="fill-foreground transition-colors duration-300" />
          <path d="M68 24 L76 7 L58 20 Z" className="fill-foreground transition-colors duration-300" />
          <path d="M41 22 L38 13 L48 20 Z" className="fill-accent transition-colors duration-300" />
          <path d="M66 21 L70 12 L60 18 Z" className="fill-accent transition-colors duration-300" />

          {/* Front paws reaching (only visible while playing) */}
          <ellipse
            cx="70"
            cy="62"
            rx="7"
            ry="5"
            className="fill-foreground"
            style={{
              transformOrigin: "70px 62px",
              transform: isPlaying ? "translate(8px, 4px) rotate(15deg)" : "translate(0, 0)",
              transition: "transform 0.35s ease-out, fill 0.3s ease",
            }}
          />

          {/* Eyes */}
          <ellipse cx="49" cy="37" rx="2.6" ry="3.2" className="fill-background cat-blink transition-colors duration-300" />
          <ellipse cx="61" cy="37" rx="2.6" ry="3.2" className="fill-background cat-blink transition-colors duration-300" />

          {/* Nose */}
          <path d="M53 43 L57 43 L55 46 Z" className="fill-accent transition-colors duration-300" />

          {/* Whiskers */}
          <path
            d="M35 40 L20 38 M35 44 L20 45 M75 40 L90 38 M75 44 L90 45"
            className="stroke-background transition-colors duration-300"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </div>
    </div>
  );
}