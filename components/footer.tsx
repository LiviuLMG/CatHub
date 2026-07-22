import Link from "next/link";
import { PawPrint } from "lucide-react";
import Image from "next/image";
import {
    SiInstagram,
} from "@icons-pack/react-simple-icons";

const footerLinks = {
    Product: [
        { label: "Breed Explorer", href: "/breeds" },
        { label: "Compare Breeds", href: "/compare" },
        { label: "Find Your Cat", href: "/quiz" },
        { label: "Community", href: "/community" },
    ],
    Company: [
        { label: "About", href: "/about" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "/contact" },
    ],
    Legal: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
    ],
};

export function Footer() {
    return (
        <footer className="relative z-10 border-t border-border bg-card">
            <div className="mx-auto max-w-7xl px-6 py-16">
                <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
                    {/* Brand column */}
                    <div>
                        <Link href="/" className="flex items-center gap-2">
                            <div className="relative h-35 w-35 shrink-0">
                                <Image
                                    src="/logo/logo-cat.png"
                                    alt="CatHub logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-xl font-extrabold tracking-tight text-foreground">
                                Cat<span className="text-accent">Hub</span>
                            </span>
                        </Link>
                        <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                            Your complete digital companion for a healthier and happier
                            cat.
                        </p>
                        <div className="mt-6 flex gap-3">

                            <a href="https://asociatiaramses.ro/" target="_blank" rel="noopener noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                                <PawPrint size={16} />
                            </a>

                            <a href="#"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                                <SiInstagram size={16} />
                            </a>

                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(footerLinks).map(([section, links]) => (
                        <div key={section}>
                            <h4 className="text-sm font-semibold text-foreground">
                                {section}
                            </h4>
                            <ul className="mt-4 flex flex-col gap-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} CatHub. All rights reserved.
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Made with care for cat owners everywhere.
                    </p>
                </div>
            </div>
        </footer>
    );
}