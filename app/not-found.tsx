import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 py-16 text-center">
      <svg
        width="240"
        height="200"
        viewBox="0 0 240 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-4"
      >
        {/* Ground shadow */}
        <ellipse cx="120" cy="178" rx="70" ry="8" fill="var(--color-border)" />

        {/* Cat body */}
        <ellipse cx="120" cy="140" rx="42" ry="34" fill="var(--color-muted-foreground)" opacity="0.15" />
        <ellipse cx="120" cy="140" rx="42" ry="34" fill="var(--color-secondary)" opacity="0.25" />

        {/* Tail */}
        <path
          d="M158 150 Q 195 145 190 105"
          stroke="var(--color-secondary)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />

        {/* Head */}
        <circle cx="120" cy="95" r="38" fill="var(--color-secondary)" opacity="0.5" />

        {/* Ears */}
        <path d="M92 70 L84 40 L112 62 Z" fill="var(--color-secondary)" opacity="0.5" />
        <path d="M148 70 L156 40 L128 62 Z" fill="var(--color-secondary)" opacity="0.5" />
        <path d="M95 66 L91 50 L106 60 Z" fill="var(--color-primary)" opacity="0.4" />
        <path d="M145 66 L149 50 L134 60 Z" fill="var(--color-primary)" opacity="0.4" />

        {/* Confused eyes */}
        <circle cx="106" cy="92" r="4.5" fill="var(--color-foreground)" />
        <circle cx="134" cy="92" r="4.5" fill="var(--color-foreground)" />

        {/* Nose + mouth */}
        <path d="M117 102 L123 102 L120 107 Z" fill="var(--color-foreground)" opacity="0.6" />
        <path
          d="M120 107 Q 114 113 108 110 M120 107 Q 126 113 132 110"
          stroke="var(--color-foreground)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />

        {/* Whiskers */}
        <path d="M85 98 L60 94 M85 104 L60 106 M155 98 L180 94 M155 104 L180 106"
          stroke="var(--color-foreground)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.3"
        />

        {/* Question marks floating */}
        <text x="55" y="55" fontSize="24" fontWeight="700" fill="var(--color-accent)">?</text>
        <text x="175" y="45" fontSize="18" fontWeight="700" fill="var(--color-primary)" opacity="0.7">?</text>
      </svg>

      <p className="text-sm font-semibold uppercase tracking-wide text-primary">
        404
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        Looks like this cat wandered off
      </h1>
      <p className="mt-3 max-w-sm text-muted-foreground">
        We couldn&apos;t find the page you were looking for. It might have
        been moved, renamed, or maybe it&apos;s just hiding under the couch.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" nativeButton={false} render={<Link href="/" />} className="gap-2">
          <Home size={18} />
          Back to home
        </Button>
        <Button
          size="lg"
          variant="outline"
          nativeButton={false}
          render={<Link href="/breeds" />}
          className="gap-2"
        >
          <Search size={18} />
          Explore breeds
        </Button>
      </div>
    </main>
  );
}