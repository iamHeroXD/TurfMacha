"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { User } from "@/types";

export function useAuth() {
  const { user, loading, initialized, setUser, setLoading, setInitialized, setEmailVerified } =
    useAuthStore();

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    const fetchOrCreateProfile = async (
      authUser: { id: string; email?: string; email_confirmed_at?: string | null; user_metadata?: Record<string, unknown> }
    ): Promise<User | null> => {
      try {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (data) return data as User;

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
              role: (meta.role as string) === "owner" ? "owner" : "user",
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
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (authUser) {
          const profile = await fetchOrCreateProfile(authUser);
          if (isMounted) {
            setUser(profile);
            setEmailVerified(!!authUser.email_confirmed_at);
          }
        } else {
          if (isMounted) {
            setUser(null);
            setEmailVerified(false);
          }
        }
      } catch {
        if (isMounted) {
          setUser(null);
          setEmailVerified(false);
        }
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
        // Session expired or token error — clear user and let middleware redirect
        if (event === "SIGNED_OUT" || event === "TOKEN_REFRESHED" && !session) {
          if (isMounted) {
            setUser(null);
            setEmailVerified(false);
          }
          return;
        }

        if (session?.user) {
          const profile = await fetchOrCreateProfile(session.user);
          if (isMounted) {
            setUser(profile);
            setEmailVerified(!!session.user.email_confirmed_at);
          }
        } else {
          if (isMounted) {
            setUser(null);
            setEmailVerified(false);
          }
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
  }, [setUser, setLoading, setInitialized, setEmailVerified]);

  return { user, loading, initialized };
}
