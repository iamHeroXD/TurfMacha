"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallBanner() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("pwa-install-dismissed")) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowBanner(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-24 md:bottom-6 left-4 right-4 z-[60] max-w-sm mx-auto"
        >
          <div className="bg-[#161616] border border-white/[0.1] rounded-2xl p-4 flex items-center gap-3 shadow-2xl">
            <div className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(16,185,129,0.35)]">
              <span className="text-black font-bold text-base">T</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm">Install TurfMacha</p>
              <p className="text-white/45 text-xs">Add to home screen for the best experience</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                size="sm"
                onClick={handleInstall}
                className="h-8 text-xs px-3 gap-1"
              >
                <Download className="h-3 w-3" /> Install
              </Button>
              <button
                onClick={handleDismiss}
                className="p-1.5 text-white/35 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
