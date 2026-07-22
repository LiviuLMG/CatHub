import { createClient } from "@/lib/supabase/server";
import { CommunityCatCard } from "@/components/community-cat-card";
import type { Cat, Profile } from "@/lib/types";

export default async function CommunityPage() {
  const supabase = await createClient();

  const { data: cats } = await supabase
    .from("cats")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  const ownerIds = [...new Set((cats || []).map((c) => c.owner_id))];

  const { data: profiles } =
    ownerIds.length > 0
      ? await supabase.from("profiles").select("*").in("id", ownerIds)
      : { data: [] as Profile[] };

  const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Community
        </p>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Cats of CatHub
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Meet the cats shared publicly by owners across the community.
        </p>
      </div>

      {!cats || cats.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card py-24 text-center">
          <p className="text-muted-foreground">
            No public cats yet. Be the first to share yours!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(cats as Cat[]).map((cat) => (
            <CommunityCatCard
              key={cat.id}
              cat={cat}
              ownerName={profileMap.get(cat.owner_id)?.full_name || "A cat lover"}
            />
          ))}
        </div>
      )}
    </main>
  );
}