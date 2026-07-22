import Link from "next/link";
import Image from "next/image";
import { Cat as CatIcon, Calendar, Weight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Cat, MedicalRecord } from "@/lib/types";
import { AddCatDialog } from "@/components/add-cat-dialog";
import { computeHealthStatus } from "@/lib/reminders";
import { getAllBreeds } from "@/lib/cat-api";

function calculateAge(birthday: string | null): string {
  if (!birthday) return "Unknown age";
  const birth = new Date(birthday);
  const now = new Date();
  const months =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());
  if (months < 12) return `${months} mo`;
  const years = Math.floor(months / 12);
  return `${years} yr${years > 1 ? "s" : ""}`;
}

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

export default async function MyCatsPage() {
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

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            My Cats
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Your cats
          </h1>
        </div>

        <AddCatDialog />
      </div>

      {!cats || cats.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CatIcon size={28} />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-foreground">
            No cats yet
          </h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Add your first cat to start tracking their health, vaccinations
            and daily care.
          </p>
          <AddCatDialog triggerLabel="Add your first cat" triggerClassName="mt-6" />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((cat: Cat) => {
            const status = computeHealthStatus(cat, (records as MedicalRecord[]) || [], breeds);

            return (
              <Link
                key={cat.id}
                href={`/cats/${cat.id}`}
                className="group overflow-hidden rounded-3xl bg-card shadow-sm transition-all duration-300 hover:shadow-lg"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                  {cat.photo_url ? (
                    <Image
                      src={cat.photo_url}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <CatIcon size={40} className="text-muted-foreground/40" />
                    </div>
                  )}

                  <span
                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${healthStyles[status]}`}
                  >
                    {healthLabels[status]}
                  </span>

                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-foreground">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {cat.breed || "Mixed breed"}
                  </p>

                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {calculateAge(cat.birthday)}
                    </span>
                    {cat.weight_kg && (
                      <span className="flex items-center gap-1.5">
                        <Weight size={14} />
                        {cat.weight_kg} kg
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}