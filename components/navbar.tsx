"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { AuthSection } from "@/components/auth-section";
import { AuthSectionMobile } from "@/components/auth-section-mobile";
import { ThemeToggle } from "@/components/theme-toggle";
import { useMagneticBar } from "@/hooks/use-magnetic-bar";

const navLinks = [
    { href: "/breeds", label: "Breeds" },
    { href: "/compare", label: "Compare" },
    { href: "/quiz", label: "Find Your Cat" },
    { href: "/community", label: "Community" },
];

export function Navbar() {
    const [open, setOpen] = useState(false);

    const { ref, offset } = useMagneticBar<HTMLDivElement>({
        marginX: 180,
        marginY: 250,
        strength: 0.15,
        maxOffset: 20,
    });

    return (
        <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
            <div
                ref={ref}
                style={{
                    transform: `translate(${offset.x}px, ${offset.y}px)`,
                    transition: "transform 0.15s ease-out",
                }}
                className="flex h-16 w-full max-w-6xl items-center justify-between gap-4 rounded-full border border-border bg-card/70 px-4 shadow-lg backdrop-blur-xl sm:px-6"
            >
                {/* Logo */}
                <Link href="/" className="flex shrink-0 items-center gap-2">
                    <div className="relative h-17 w-17 shrink-0">
                        <Image
                            src="/logo/logo-cat.png"
                            alt="CatHub logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="hidden text-xl font-extrabold tracking-tight text-foreground sm:inline">
                        Cat<span className="text-accent">Hub</span>
                    </span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-7 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop actions */}
                <div className="hidden items-center gap-2 md:flex">
                    <ThemeToggle />
                    <AuthSection />
                </div>

                {/* Mobile: theme toggle + menu */}
                <div className="flex items-center gap-1 md:hidden">
                    <ThemeToggle />
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger
                            render={
                                <Button variant="ghost" size="icon">
                                    <Menu size={22} />
                                </Button>
                            }
                        />
                        <SheetContent
                            side="right"
                            showCloseButton={false}
                            className="w-[85vw] max-w-sm border-none bg-linear-to-br from-popover to-secondary p-0 [clip-path:polygon(0%_0%,100%_0%,100%_100%,12%_100%)]"
                        >
                            <div className="flex h-full flex-col px-10 py-10">
                                <button
                                    onClick={() => setOpen(false)}
                                    className="ml-auto flex h-10 w-10 items-center justify-center rounded-full text-primary-foreground/80 transition-colors hover:bg-white/10 hover:text-primary-foreground"
                                    aria-label="Close menu"
                                >
                                    <X size={22} />
                                </button>

                                <nav key={open ? "nav-open" : "nav-closed"} className="mt-10 flex flex-col gap-7">
                                    {navLinks.map((link, i) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setOpen(false)}
                                            style={{ animationDelay: `${i * 60 + 100}ms` }}
                                            className="menu-item-in text-2xl font-bold text-foreground transition-opacity hover:opacity-80"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </nav>

                                <div
                                    key={open ? "footer-open" : "footer-closed"}
                                    style={{ animationDelay: `${navLinks.length * 60 + 150}ms` }}
                                    className="menu-item-in mt-10 border-t border-white/20 pt-8"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-foreground/70">
                                            Theme
                                        </span>
                                        <ThemeToggle />
                                    </div>
                                    <div className="mt-6">
                                        <AuthSectionMobile onClose={() => setOpen(false)} />
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}