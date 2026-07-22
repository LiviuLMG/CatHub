"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

const MAGNET_RADIUS = 380;
const MAGNET_STRENGTH = 0.5;
const MAX_OFFSET = 15;

export function ScrollToTop() {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [visible, setVisible] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    // Show/hide pe baza scroll-ului
    useEffect(() => {
        function handleScroll() {
            setVisible(window.scrollY > 400);
        }
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Efect magnetic, activ doar când butonul e vizibil
    useEffect(() => {
        if (!visible) {
            setOffset({ x: 0, y: 0 });
            return;
        }

        function handleMouseMove(e: MouseEvent) {
            const el = buttonRef.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < MAGNET_RADIUS) {
                const pullX = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, dx * MAGNET_STRENGTH));
                const pullY = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, dy * MAGNET_STRENGTH));
                setOffset({ x: pullX, y: pullY });
            } else {
                setOffset({ x: 0, y: 0 });
            }
        }

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [visible]);

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <button
            ref={buttonRef}
            onClick={scrollToTop}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            aria-label="Back to top"
            style={{
                transform: visible
                    ? `translate(${offset.x}px, ${offset.y}px) translateY(0)`
                    : "translateY(100px)",
                opacity: visible ? 1 : 0,
                transition: visible
                    ? "transform 0.15s ease-out, opacity 0.4s ease-out, background-color 0.3s, color 0.3s, box-shadow 0.3s"
                    : "transform 0.4s ease-in, opacity 0.3s ease-in, background-color 0.3s, color 0.3s, box-shadow 0.3s",
                boxShadow: hovered
                    ? "0 0 35px 6px rgba(255, 255, 255, 0.55)"
                    : "0 0 30px 4px color-mix(in srgb, var(--color-accent) 55%, transparent)",
                pointerEvents: visible ? "auto" : "none",
            }}
            className="fixed bottom-7 right-10 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-accent text-accent-foreground hover:bg-white hover:text-accent"
        >
            <ArrowUp size={22} />
        </button>
    );
}