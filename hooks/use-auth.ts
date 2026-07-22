"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { syncProfile } from "@/lib/sync-profile";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const lastSynced = useRef<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    function maybeSyncProfile(fullName: string | null, avatarUrl: string | null) {
      const signature = `${fullName ?? ""}|${avatarUrl ?? ""}`;
      if (lastSynced.current === signature) return;
      lastSynced.current = signature;
      syncProfile(fullName, avatarUrl);
    }

    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const fullName = user.user_metadata?.full_name || null;
        const avatarUrl = user.user_metadata?.avatar_url || null;

        setUser({
          id: user.id,
          email: user.email || "",
          full_name: fullName,
          avatar_url: avatarUrl,
        });
        maybeSyncProfile(fullName, avatarUrl);
      }
      setLoading(false);
    }

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const fullName = session.user.user_metadata?.full_name || null;
        const avatarUrl = session.user.user_metadata?.avatar_url || null;

        setUser({
          id: session.user.id,
          email: session.user.email || "",
          full_name: fullName,
          avatar_url: avatarUrl,
        });
        maybeSyncProfile(fullName, avatarUrl);
      } else {
        setUser(null);
        lastSynced.current = null;
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  }

  return { user, loading, logout };
}