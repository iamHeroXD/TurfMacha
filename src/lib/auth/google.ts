import { Capacitor } from "@capacitor/core";
import { createClient } from "@/lib/supabase/client";

// Web OAuth client ID from Google Cloud. On Android this same ID is passed as the
// "server client ID" so Google returns an ID token Supabase can verify.
const GOOGLE_WEB_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "";

let socialInitialized = false;

/**
 * Sign in with Google.
 *
 * - **Native (Android APK):** uses the Capacitor Social Login plugin to perform a
 *   real native Google sign-in, then exchanges the returned ID token with Supabase
 *   via `signInWithIdToken`. Google blocks its OAuth flow inside plain WebViews, so
 *   this native path is required for the packaged app.
 * - **Web (browser/PWA):** falls back to Supabase's standard OAuth redirect.
 *
 * Returns `{ redirected: true }` on web (the page will navigate away) or
 * `{ redirected: false }` on native once a session is established — the caller
 * should then route the user into the app.
 */
export async function signInWithGoogle(): Promise<{ redirected: boolean }> {
  const supabase = createClient();

  // ── Web / PWA ──────────────────────────────────────────────────────────────
  if (!Capacitor.isNativePlatform()) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw new Error(error.message);
    return { redirected: true };
  }

  // ── Native (Android) ─────────────────────────────────────────────────────────
  if (!GOOGLE_WEB_CLIENT_ID) {
    throw new Error(
      "Google sign-in is not configured. Set NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID."
    );
  }

  // Lazy-import so the plugin is never bundled into / evaluated on the web build.
  const { SocialLogin } = await import("@capgo/capacitor-social-login");

  if (!socialInitialized) {
    await SocialLogin.initialize({
      google: { webClientId: GOOGLE_WEB_CLIENT_ID },
    });
    socialInitialized = true;
  }

  const result = await SocialLogin.login({
    provider: "google",
    options: { scopes: ["email", "profile"] },
  });

  // Plugin response shape: { provider, result: { idToken, ... } }
  const idToken =
    (result as { result?: { idToken?: string | null } })?.result?.idToken ?? null;

  if (!idToken) {
    throw new Error("Google did not return an ID token. Please try again.");
  }

  const { error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: idToken,
  });
  if (error) throw new Error(error.message);

  return { redirected: false };
}
