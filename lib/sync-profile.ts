import { createClient } from "@/lib/supabase/client";

export async function syncProfile(fullName: string | null, avatarUrl: string | null) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("profiles").upsert({
    id: user.id,
    full_name: fullName,
    avatar_url: avatarUrl,
    updated_at: new Date().toISOString(),
  });
}