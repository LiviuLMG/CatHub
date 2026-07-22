"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, Bell, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthModal } from "@/components/auth-modal-provider";
import { useAuth } from "@/hooks/use-auth";
import { useTilt } from "@/hooks/use-tilt";
import { createClient } from "@/lib/supabase/client";
import { getUpcomingEvents, formatRelativeDate } from "@/lib/reminders";
import type { Cat, MedicalRecord } from "@/lib/types";
import { AddCatDialog } from "@/components/add-cat-dialog";

const DEFAULT_IMAGE = "/hero-cat.png";
const DEFAULT_NAME = "Luna";
const DEFAULT_WEIGHT_LABEL = "4.2 kg · Healthy";
const DEFAULT_REMINDER = "Vet visit at 2:00 PM";

const healthLabels: Record<Cat["health_status"], string> = {
  healthy: "Healthy",
  monitoring: "Monitoring",
  needs_attention: "Needs attention",
};

export function Hero() {
  const { openRegister } = useAuthModal();
  const { user } = useAuth();
  const { ref, style, onMouseMove, onMouseLeave } = useTilt<HTMLDivElement>(6);

  const [featuredCat, setFeaturedCat] = useState<Cat | null>(null);
  const [reminderText, setReminderText] = useState<string | null>(null);
  const [hasCats, setHasCats] = useState(false);

  useEffect(() => {
    // Logout sau nimeni logat: revenim instant la varianta default (Luna)
    if (!user) {
      setHasCats(false);
      setFeaturedCat(null);
      setReminderText(null);
      return;
    }

    let cancelled = false;

    async function loadFeaturedCat() {
      const supabase = createClient();
      const { data: cats } = await supabase.from("cats").select("*");

      if (cancelled) return;

      if (!cats || cats.length === 0) {
        setHasCats(false);
        setFeaturedCat(null);
        setReminderText(null);
        return;
      }

      setHasCats(true);
      const randomCat = cats[Math.floor(Math.random() * cats.length)] as Cat;
      setFeaturedCat(randomCat);

      const { data: records } = await supabase
        .from("medical_records")
        .select("*")
        .eq("cat_id", randomCat.id);

      if (cancelled) return;

      const upcoming = getUpcomingEvents(
        [randomCat],
        (records as MedicalRecord[]) || [],
        90
      );

      setReminderText(
        upcoming.length > 0
          ? `${upcoming[0].label} · ${formatRelativeDate(upcoming[0].date)}`
          : "No reminders yet"
      );
    }

    loadFeaturedCat();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const imageUrl = hasCats && featuredCat?.photo_url ? featuredCat.photo_url : DEFAULT_IMAGE;
  const displayName = hasCats && featuredCat ? featuredCat.name : DEFAULT_NAME;

  const weightLabel =
    hasCats && featuredCat
      ? featuredCat.weight_kg
        ? `${featuredCat.weight_kg} kg · ${healthLabels[featuredCat.health_status]}`
        : healthLabels[featuredCat.health_status]
      : DEFAULT_WEIGHT_LABEL;

  const reminderLabel = hasCats ? reminderText ?? "No reminders yet" : DEFAULT_REMINDER;

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
        {/* Text content */}
        <div className="flex flex-col gap-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-success" />
            Trusted by hundreds of cat owners
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Your complete digital companion for a{" "}
            <span className="text-primary">healthier</span> and{" "}
            <span className="text-secondary">happier</span> cat.
          </h1>

          <p className="max-w-lg text-lg text-muted-foreground">
            Track health, vaccinations, nutrition and daily care while
            discovering everything about your cat&apos;s breed, all in one
            beautifully simple place.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            {user ? (
              <AddCatDialog triggerLabel="Add Cat" triggerClassName="gap-2" />
            ) : (
              <Button size="lg" onClick={openRegister} className="gap-2">
                Get Started
                <ArrowRight size={18} data-icon="inline-end" />
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link href="/breeds" />}
              className="gap-2"
            >
              <Search size={18} data-icon="inline-start" />
              Explore Breeds
            </Button>
          </div>
        </div>

        {/* Hero image */}
        <div
          ref={ref}
          style={style}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          className="relative w-full max-w-md mx-auto"
        >
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl shadow-xl md:aspect-4/5">
            <Image
              src={imageUrl}
              alt={displayName}
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="absolute -top-4 -right-4 flex items-center gap-3 rounded-full bg-card px-4 py-3 shadow-lg md:-right-8">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Bell size={18} />
            </div>
            <span className="text-sm font-medium text-foreground">
              {reminderLabel}
            </span>
          </div>

          <div className="absolute -bottom-4 -left-4 flex items-center gap-3 rounded-full bg-card px-4 py-3 shadow-lg md:-left-8">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
              <HeartPulse size={18} />
            </div>
            <div className="leading-tight">
              <p className="text-xs text-muted-foreground">
                {displayName}&apos;s weight
              </p>
              <p className="text-sm font-semibold text-foreground">
                {weightLabel}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}