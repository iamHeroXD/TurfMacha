"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";

/**
 * Native-only shell setup (no-op on web). Themes the Android status bar to match
 * the cream UI and hides the boot splash once the WebView has painted. Everything
 * is guarded + dynamically imported so the web bundle never touches native APIs.
 */
export function NativeChrome() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    (async () => {
      try {
        const { StatusBar, Style } = await import("@capacitor/status-bar");
        // Dark icons on the light cream background; don't draw under the bar.
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: "#F4F1EB" });
        await StatusBar.setOverlaysWebView({ overlay: false });
      } catch {
        /* status bar plugin unavailable — ignore */
      }

      try {
        const { SplashScreen } = await import("@capacitor/splash-screen");
        await SplashScreen.hide();
      } catch {
        /* splash plugin unavailable — ignore */
      }
    })();
  }, []);

  return null;
}
