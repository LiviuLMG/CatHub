import Link from "next/link";
import Image from "next/image";
import {
    Plus,
    Search,
    GitCompare,
    Cat as CatIcon,
    HeartPulse,
    AlertCircle,
    Bell,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { AddCatDialog } from "@/components/add-cat-dialog";
import type { Cat, MedicalRecord } from "@/lib/types";
import { getUpcomingEvents, formatRelativeDate, computeHealthStatus } from "@/lib/reminders";
import { getAllBreeds } from "@/lib/cat-api";

const healthStyles: Record<Cat["health_status"], string> = {
    healthy: "bg-success/15 text-success",
    monitoring: "bg-accent/15 text-accent",
    needs_attention: "bg-destructive/15 text-destructive",
};

const healthLabels: Record<Cat["health_status"], string> = {
    healthy: "Healthy",
    monitoring: "Monitoring",
    needs_attention: "Needs attention",
};

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: cats } = await supabase
        .from("cats")
        .select("*")
        .eq("owner_id", user?.id)
        .order("created_at", { ascending: false });

    const { data: records } = await supabase.from("medical_records").select("*");
    const breeds = await getAllBreeds();

    const displayName =
        user?.user_metadata?.full_name?.split(" ")[0] ||
        user?.email?.split("@")[0] ||
        "there";

    const catsWithStatus = (cats as Cat[] | null)?.map((cat) => ({
        ...cat,
        computedStatus: computeHealthStatus(cat, (records as MedicalRecord[]) || [], breeds),
    })) ?? [];

    const totalCats = catsWithStatus.length;
    const healthyCats = catsWithStatus.filter((c) => c.computedStatus === "healthy").length;
    const needsAttention = catsWithStatus.filter((c) => c.computedStatus === "needs_attention").length;

    const avgWeight =
        cats && cats.length > 0
            ? (
                cats.reduce((sum, c) => sum + (c.weight_kg || 0), 0) /
                cats.filter((c) => c.weight_kg).length
            ).toFixed(1)
            : null;

    const upcomingEvents = getUpcomingEvents(
        (cats as Cat[]) || [],
        (records as MedicalRecord[]) || [],
        30
    ).slice(0, 4);

    const quickActions = [
        { href: "/breeds", label: "Explore breeds", icon: Search },
        { href: "/compare", label: "Compare breeds", icon: GitCompare },
    ];

    return (
        <main className="mx-auto max-w-7xl px-6 py-12">
            {/* Greeting */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    Welcome back, {displayName}
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Here&apos;s what&apos;s happening with your cats today.
                </p>
            </div>

            {/* Quick stats */}
            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <CatIcon size={16} />
                        <span className="text-xs font-medium">Total cats</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-foreground">{totalCats}</p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <HeartPulse size={16} />
                        <span className="text-xs font-medium">Healthy</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-success">{healthyCats}</p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <AlertCircle size={16} />
                        <span className="text-xs font-medium">Needs attention</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-destructive">
                        {needsAttention}
                    </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-xs font-medium">Average weight</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-foreground">
                        {avgWeight ? `${avgWeight} kg` : "—"}
                    </p>
                </div>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-3">
                {/* Your cats */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-foreground">Your cats</h2>
                        {totalCats > 0 && (
                            <Link
                                href="/cats"
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                View all
                            </Link>
                        )}
                    </div>

                    {totalCats === 0 ? (
                        <div className="mt-4 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card py-16 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <CatIcon size={24} />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-foreground">
                                No cats yet
                            </h3>
                            <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
                                Add your first cat to see them here.
                            </p>
                            <Button className="mt-5" nativeButton={false} render={<Link href="/cats/new" />}>
                                Add your first cat
                            </Button>
                        </div>
                    ) : (
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            {catsWithStatus.slice(0, 4).map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={`/cats/${cat.id}`}
                                    className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-md"
                                >
                                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                                        {cat.photo_url ? (
                                            <Image
                                                src={cat.photo_url}
                                                alt={cat.name}
                                                fill
                                                sizes="64px"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <CatIcon size={20} className="text-muted-foreground/40" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-foreground">
                                            {cat.name}
                                        </p>
                                        <p className="truncate text-xs text-muted-foreground">
                                            {cat.breed || "Mixed breed"}
                                        </p>
                                    </div>

                                    <span
                                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${healthStyles[cat.computedStatus]}`}
                                    >
                                        {healthLabels[cat.computedStatus]}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar: quick actions + reminders */}
                <div className="flex flex-col gap-6">
                    <div className="rounded-2xl border border-border bg-card p-5">
                        <h2 className="text-sm font-semibold text-foreground">
                            Quick actions
                        </h2>
                        <div className="mt-3 flex flex-col gap-2">
                            <AddCatDialog
                                triggerLabel="Add a cat"
                                triggerClassName="w-full justify-start gap-3 bg-transparent px-3 py-2.5 text-sm font-medium text-foreground shadow-none hover:bg-muted hover:shadow-none"
                            />
                            {quickActions.map((action) => (
                                <Link
                                    key={action.href}
                                    href={action.href}
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                >
                                    <action.icon size={16} className="text-primary" />
                                    {action.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-5">
                        <div className="flex items-center gap-2">
                            <Bell size={16} className="text-muted-foreground" />
                            <h2 className="text-sm font-semibold text-foreground">Reminders</h2>
                        </div>

                        {upcomingEvents.length === 0 ? (
                            <p className="mt-3 text-sm text-muted-foreground">
                                Nothing due in the next 30 days. You&apos;re all caught up!
                            </p>
                        ) : (
                            <div className="mt-3 flex flex-col gap-3">
                                {upcomingEvents.map((event) => (
                                    <Link
                                        key={event.id}
                                        href={`/cats/${event.catId}`}
                                        className="block rounded-xl px-2 py-1.5 -mx-2 transition-colors hover:bg-muted"
                                    >
                                        <p className="text-sm font-medium text-foreground">{event.label}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {event.catName} · {formatRelativeDate(event.date)}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}