import Link from "next/link";
import Image from "next/image";
import {
    Heart
} from "lucide-react";
import { Reveal } from "@/components/reveal";

export default function AboutPage() {
    return (
        <main className="mx-auto max-w-7xl px-6 py-16">
            {/* Header */}
            <div className="mb-16">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                    About CatHub
                </p>
                <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                    Built for cat owners, by a cat lover
                </h1>
                <p className="mt-4 max-w-xl text-lg text-muted-foreground">
                    CatHub is a digital companion designed to bring every part of a
                    cat&apos;s life: health, breed knowledge and daily care, into
                    one simple, beautiful place.
                </p>
            </div>

            {/* Mission */}
            <Reveal>
                <div className="grid gap-8 md:grid-cols-2 md:items-center">
                    <div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Heart size={22} />
                        </div>
                        <h2 className="mt-5 text-2xl font-bold text-foreground">
                            Our mission
                        </h2>
                        <p className="mt-3 leading-relaxed text-muted-foreground">
                            Caring for a cat means juggling vet visits, vaccination
                            schedules, feeding habits and a hundred small details that are
                            easy to forget. CatHub&apos;s mission is to bring all of that
                            together: a health passport, a calendar and a breed
                            encyclopedia in one place, so owners can spend less time
                            organizing and more time with their cats.
                        </p>
                    </div>
                    <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted shadow-lg">
                        <Image
                            src="/hero-cat.png"
                            alt="A cat cared for with CatHub"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </Reveal>
        </main>
    );
}