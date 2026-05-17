"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PWAUpdateBanner() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    // Listen for the service worker controller change — fires when a new SW
    // activates (skipWaiting triggers this). A controller change means the
    // page is now controlled by a newer service worker.
    const onControllerChange = () => {
      setUpdateAvailable(true);
    };

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      onControllerChange
    );

    // Also check if there's a waiting SW right now (e.g. user navigated back)
    navigator.serviceWorker.ready.then((registration) => {
      if (registration.waiting) {
        // There's already a SW waiting — post skipWaiting to activate it
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }

      // Listen for a new SW installing after page load
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) return;
        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            // New SW is installed and waiting — trigger skip
            newWorker.postMessage({ type: "SKIP_WAITING" });
          }
        });
      });
    });

    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange
      );
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleDismiss = () => {
    setUpdateAvailable(false);
  };

  return (
    <AnimatePresence>
      {updateAvailable && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-16 inset-x-0 z-[70] flex justify-center px-4"
        >
          <div className="bg-[#1a1a1a] border border-brand-400/25 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl max-w-sm w-full">
            <div className="w-8 h-8 rounded-lg bg-brand-400/10 border border-brand-400/20 flex items-center justify-center shrink-0">
              <RefreshCw className="h-4 w-4 text-brand-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">Update available</p>
              <p className="text-xs text-white/45">
                Refresh to get the latest version
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                size="sm"
                onClick={handleRefresh}
                className="h-7 text-xs px-3"
              >
                Refresh
              </Button>
              <button
                onClick={handleDismiss}
                className="p-1 text-white/35 hover:text-white/70 transition-colors rounded-md"
                aria-label="Dismiss update"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
