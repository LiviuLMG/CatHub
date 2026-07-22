import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Weight,
  Palette,
  Fingerprint,
  Cat as CatIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAllBreeds } from "@/lib/cat-api";
import { computeHealthStatus } from "@/lib/reminders";
import { EditCatDialog } from "@/components/edit-cat-dialog";
import { DeleteCatButton } from "@/components/delete-cat-button";
import { MedicalTimeline } from "@/components/medical-timeline";
import type { Cat, MedicalRecord } from "@/lib/types";

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

function calculateAge(birthday: string | null): string {
  if (!birthday) return "Unknown";
  const birth = new Date(birthday);
  const now = new Date();
  const months =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""}`;
  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? "s" : ""}`;
}

export default async function CatProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: cat } = await supabase
    .from("cats")
    .select("*")
    .eq("id", id)
    .single();

  if (!cat) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwner = user?.id === cat.owner_id;

  const { data: medicalRecords } = await supabase
    .from("medical_records")
    .select("*")
    .eq("cat_id", id);

  const breeds = await getAllBreeds();
  const status = computeHealthStatus(
    cat as Cat,
    (medicalRecords as MedicalRecord[]) || [],
    breeds
  );

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href="/cats"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to my cats
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Photo */}
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-muted shadow-lg">
          {cat.photo_url ? (
            <Image
              src={cat.photo_url}
              alt={cat.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <CatIcon size={64} className="text-muted-foreground/40" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                {cat.name}
              </h1>
              <p className="mt-1 text-muted-foreground">
                {cat.breed || "Mixed breed"}
              </p>
            </div>

            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${healthStyles[status]}`}
            >
              {healthLabels[status]}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2.5">
              <Calendar size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Age</p>
                <p className="text-sm font-semibold text-foreground">
                  {calculateAge(cat.birthday)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Weight size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Weight</p>
                <p className="text-sm font-semibold text-foreground">
                  {cat.weight_kg ? `${cat.weight_kg} kg` : "Not set"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Palette size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Color</p>
                <p className="text-sm font-semibold text-foreground">
                  {cat.color || "Not set"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Fingerprint size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Gender</p>
                <p className="text-sm font-semibold capitalize text-foreground">
                  {cat.gender || "Not set"}
                </p>
              </div>
            </div>
          </div>

          {cat.notes && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-foreground">Notes</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {cat.notes}
              </p>
            </div>
          )}

          {isOwner && (
            <div className="mt-8 flex gap-3">
              <EditCatDialog cat={cat as Cat} />
              <DeleteCatButton catId={cat.id} photoUrl={cat.photo_url} />
            </div>
          )}
        </div>
      </div>

      {isOwner && (
        <div className="mt-16">
          <MedicalTimeline
            catId={cat.id}
            records={(medicalRecords as MedicalRecord[]) || []}
          />
        </div>
      )}
    </main>
  );
}