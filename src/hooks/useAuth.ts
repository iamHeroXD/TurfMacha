"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { User } from "@/types";

export function useAuth() {
  const { user, loading, initialized, setUser, setLoading, setInitialized } =
    useAuthStore();
  // Prevent concurrent profile fetches (e.g. rapid auth state changes)
  const fetchingRef = useRef(false);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    const fetchOrCreateProfile = async (
      authUser: { id: string; email?: string; user_metadata?: Record<string, unknown> }
    ): Promise<User | null> => {
      if (fetchingRef.current) return null;
      fetchingRef.current = true;
      try {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (data) return data as User;

        // Profile missing — auto-create from auth metadata
        const meta = authUser.user_metadata ?? {};
        const email = authUser.email ?? "";
        const { data: created } = await supabase
          .from("users")
          .upsert(
            {
              id: authUser.id,
              email,
              full_name: (meta.full_name as string) || email.split("@")[0] || "User",
              phone: (meta.phone as string) || null,
              role: (meta.role as string) || "user",
            },
            { onConflict: "id" }
          )
          .select()
          .single();

        return (created as User) ?? null;
      } finally {
        fetchingRef.current = false;
      }
    };

    const initAuth = async () => {
      try {
        // Use getUser() for server-validated auth (prevents stale JWT issues in PWA)
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (authUser) {
          const profile = await fetchOrCreateProfile(authUser);
          if (isMounted) setUser(profile);
        } else {
          if (isMounted) setUser(null);
        }
      } catch {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      try {
        if (session?.user) {
          const profile = await fetchOrCreateProfile(session.user);
          if (isMounted) setUser(profile);
        } else {
          if (isMounted) setUser(null);
        }
      } catch {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setLoading, setInitialized]);

  return { user, loading, initialized };
}
