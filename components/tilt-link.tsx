"use client";

import Link from "next/link";
import { useTilt } from "@/hooks/use-tilt";

interface TiltLinkProps {
    href: string;
    className?: string;
    children: React.ReactNode;
}

export function TiltLink({ href, className, children }: TiltLinkProps) {
    const { ref, style, onMouseMove, onMouseLeave } = useTilt<HTMLAnchorElement>();
    return (
        <Link
            href={href}
            ref={ref}
            style={style}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className={className}
        >
            {children}
        </Link>
    );
}