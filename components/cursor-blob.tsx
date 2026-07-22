"use client";

import { useEffect, useRef } from "react";

export function CursorBlob() {
    const blobRef = useRef<HTMLDivElement>(null);
    const target = useRef({ x: 0, y: 0 });
    const current = useRef({ x: 0, y: 0 });
    const frame = useRef<number | null>(null);

    useEffect(() => {
        // Poziție inițială: centrul ecranului, ca să nu sară de undeva ciudat la primul render
        target.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        current.current = { ...target.current };

        function handleMouseMove(e: MouseEvent) {
            target.current = { x: e.clientX, y: e.clientY };
        }

        function animate() {
            // Lerp (linear interpolation) — se apropie treptat de țintă, nu instant
            current.current.x += (target.current.x - current.current.x) * 0.08;
            current.current.y += (target.current.y - current.current.y) * 0.08;

            if (blobRef.current) {
                blobRef.current.style.transform = `translate(${current.current.x}px, ${current.current.y}px) translate(-50%, -50%)`;
            }

            frame.current = requestAnimationFrame(animate);
        }

        window.addEventListener("mousemove", handleMouseMove);
        frame.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (frame.current) cancelAnimationFrame(frame.current);
        };
    }, []);

    return (
        <div
            ref={blobRef}
            className="pointer-events-none fixed left-0 top-0 z-0 hidden h-[420px] w-[420px] rounded-full opacity-5 blur-3xl lg:block"
            style={{
                background:
                    "radial-gradient(circle, var(--color-secondary) 30%, transparent 700%)",
            }}
        />
    );
}