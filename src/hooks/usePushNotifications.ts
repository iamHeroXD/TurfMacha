"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";

export type PushPermission = "default" | "granted" | "denied" | "unsupported";

export function usePushNotifications() {
  const { user } = useAuthStore();
  const [permission, setPermission] = useState<PushPermission>("default");
  const [requesting, setRequesting] = useState(false);
  const [tokenRegistered, setTokenRegistered] = useState(false);

  // Check current permission state on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) {
      setPermission("unsupported");
      return;
    }
    setPermission(Notification.permission as PushPermission);
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!user || requesting) return false;
    setRequesting(true);

    try {
      const { requestNotificationPermission } = await import("@/lib/firebase/client");
      const token = await requestNotificationPermission();

      if (!token) {
        setPermission("denied");
        return false;
      }

      setPermission("granted");

      // Store token in Supabase
      const supabase = createClient();
      await supabase
        .from("push_tokens")
        .upsert(
          { user_id: user.id, token, platform: "web", updated_at: new Date().toISOString() },
          { onConflict: "token" }
        );

      setTokenRegistered(true);
      return true;
    } catch (err) {
      console.error("[push] Permission request failed:", err);
      return false;
    } finally {
      setRequesting(false);
    }
  }, [user, requesting]);

  const revokePermission = useCallback(async () => {
    if (!user) return;
    // Remove stored tokens for this user from the device
    // (can't programmatically revoke browser permission — user must do that manually)
    const supabase = createClient();
    await supabase.from("push_tokens").delete().eq("user_id", user.id);
    setTokenRegistered(false);
  }, [user]);

  return {
    permission,
    requesting,
    tokenRegistered,
    requestPermission,
    revokePermission,
    isSupported: permission !== "unsupported",
    isGranted: permission === "granted",
  };
}
