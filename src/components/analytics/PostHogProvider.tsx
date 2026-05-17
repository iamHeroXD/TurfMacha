"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

// PostHog is loaded lazily — only activates when NEXT_PUBLIC_POSTHOG_KEY is set.
// Install: npm install posthog-js (already in package.json)
// Then set NEXT_PUBLIC_POSTHOG_KEY and NEXT_PUBLIC_POSTHOG_HOST in Vercel.

// Minimal interface — avoids importing posthog-js types at the module level
interface PostHogInstance {
  init(key: string, options: Record<string, unknown>): void;
  capture(event: string, props?: Record<string, unknown>): void;
  identify(id: string, props?: Record<string, unknown>): void;
  reset(): void;
}

declare global {
  interface Window {
    posthog?: PostHogInstance;
  }
}

let posthogLoaded = false;

async function ensurePostHog(): Promise<PostHogInstance | null> {
  if (typeof window === "undefined") return null;
  if (window.posthog) return window.posthog;
  if (posthogLoaded) return null; // Already tried, package not available
  posthogLoaded = true;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return null;

  try {
    // Dynamic import with indirect path to prevent webpack from erroring on
    // the static module graph when posthog-js is not yet installed
    const pkgName = ["posthog", "js"].join("-");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mod = await (Function("pkg", "return import(pkg)")(pkgName) as Promise<any>);
    const ph = (mod.default ?? mod) as PostHogInstance;
    ph.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com",
      capture_pageview: false,
      persistence: "localStorage+cookie",
      autocapture: true,
      // Mask all form inputs to prevent PII leakage
      session_recording: { maskAllInputs: true, blockAllMedia: false },
    });
    window.posthog = ph;
    return ph;
  } catch {
    // posthog-js not installed or failed — silently skip
    return null;
  }
}

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();

  // Load PostHog once on mount
  useEffect(() => {
    ensurePostHog();
  }, []);

  // Identify user
  useEffect(() => {
    const ph = window.posthog;
    if (!ph) return;
    if (user) {
      ph.identify(user.id, {
        email: user.email,
        name: user.full_name,
        role: user.role,
      });
    } else {
      ph.reset();
    }
  }, [user]);

  // Track page views
  useEffect(() => {
    const ph = window.posthog;
    if (!ph) return;
    const url = `${pathname}${searchParams.toString() ? `?${searchParams}` : ""}`;
    ph.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      {children}
    </>
  );
}

/** Track a custom analytics event */
export function trackEvent(
  event: string,
  props?: Record<string, unknown>
): void {
  if (typeof window !== "undefined" && window.posthog) {
    window.posthog.capture(event, props);
  }
}
