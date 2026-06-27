import type { CapacitorConfig } from "@capacitor/cli";

// ─────────────────────────────────────────────────────────────────────────────
// TurfMacha — Android (APK) wrapper.
//
// Strategy: "hosted backend". The Next.js app keeps running on Vercel (API
// routes, SSR, middleware, Supabase auth all intact). The native Android shell
// loads that live deployment inside a WebView via `server.url`, so the APK is a
// thin native container around the real app — no static export, no duplicated
// backend.
//
// To point the app at a different deployment (preview / self-hosted), set
// CAP_SERVER_URL before running `npx cap sync`, e.g.
//   CAP_SERVER_URL=https://staging.turfmacha.app npx cap sync
// ─────────────────────────────────────────────────────────────────────────────

const SERVER_URL =
  process.env.CAP_SERVER_URL ?? "https://turfmacha.vercel.app";

const config: CapacitorConfig = {
  appId: "app.turfmacha.android",
  appName: "TurfMacha",
  // Fallback assets bundled in the APK (a splash shown only if the remote
  // server is unreachable). The real UI comes from `server.url`.
  webDir: "www",
  server: {
    url: SERVER_URL,
    cleartext: false,
    androidScheme: "https",
  },
  android: {
    backgroundColor: "#F4F1EB",
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false, // hidden manually by NativeChrome once the app paints
      backgroundColor: "#F4F1EB",
      androidSplashResourceName: "splash",
      showSpinner: false,
    },
  },
};

export default config;
