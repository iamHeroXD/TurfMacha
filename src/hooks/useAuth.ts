"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { User } from "@/types";

export function useAuth() {
  const { user, loading, initialized, setUser, setLoading, setInitialized } =
    useAuthStore();

  useEffect(() => {
    const supabase = createClient();

    const fetchOrCreateProfile = async (
      authUser: { id: string; email?: string; user_metadata?: Record<string, unknown> }
    ): Promise<User | null> => {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (data) return data as User;

      // Profile missing — auto-create from auth metadata (trigger race condition or legacy account)
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
    };

    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const profile = await fetchOrCreateProfile(session.user);
          setUser(profile);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session?.user) {
          const profile = await fetchOrCreateProfile(session.user);
          setUser(profile);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading, setInitialized]);

  return { user, loading, initialized };
}
