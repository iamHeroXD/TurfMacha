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
    let isMounted = true;

    const fetchOrCreateProfile = async (
      authUser: { id: string; email?: string; user_metadata?: Record<string, unknown> }
    ): Promise<User | null> => {
      try {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (data) return data as User;

        // Profile missing — auto-create from auth metadata (e.g. Google OAuth)
        const meta = authUser.user_metadata ?? {};
        const email = authUser.email ?? "";
        const { data: created } = await supabase
          .from("users")
          .upsert(
            {
              id: authUser.id,
              email,
              full_name:
                (meta.full_name as string) || email.split("@")[0] || "User",
              phone: (meta.phone as string) || null,
              // Never accept 'admin' from metadata — DB trigger enforces this too
              role:
                (meta.role as string) === "owner" ? "owner" : "user",
            },
            { onConflict: "id" }
          )
          .select()
          .single();

        return (created as User) ?? null;
      } catch {
        return null;
      }
    };

    const initAuth = async () => {
      try {
        // getUser() validates the session server-side, preventing stale JWT abuse
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

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
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      try {
        if (event === "SIGNED_OUT") {
          if (isMounted) setUser(null);
          return;
        }
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
