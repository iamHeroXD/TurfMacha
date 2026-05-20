"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface Window { __pwaInstallPrompt?: BeforeInstallPromptEvent; }
}

export function PWAInstallBanner() {
  const [showBanner,  setShowBanner]  = useState(false);
  const [canInstall,  setCanInstall]  = useState(false);
  const [installing,  setInstalling]  = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("pwa-install-dismissed")) return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const handler = (e: Event) => {
      e.preventDefault();
      const prompt = e as BeforeInstallPromptEvent;
      window.__pwaInstallPrompt = prompt;
      setCanInstall(true);
      setTimeout(() => setShowBanner(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    const prompt = window.__pwaInstallPrompt;
    if (!prompt) return;
    setInstalling(true);
    try {
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === "accepted") {
        setShowBanner(false);
        window.__pwaInstallPrompt = undefined;
      }
    } finally {
      setInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  if (!canInstall) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="fixed bottom-24 md:bottom-6 left-4 right-4 z-[60] max-w-sm mx-auto"
        >
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-xl shadow-black/8">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border-2 border-gray-100">
              <Image src="/logoofturfmacha.png" alt="TurfMacha" width={48} height={48} className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-[#1F2937] text-sm">Install TurfMacha</p>
              <p className="text-[#6B7280] text-xs mt-0.5">Add to home screen — works offline</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                onClick={handleInstall}
                loading={installing}
                className="h-8 text-xs px-3 gap-1 rounded-xl bg-[#0B3D2E]"
              >
                <Download className="h-3 w-3" /> Install
              </Button>
              <button
                onClick={handleDismiss}
                className="p-1.5 text-[#9CA3AF] hover:text-[#6B7280] transition-colors rounded-lg hover:bg-[#FAF7F0]"
                aria-label="Dismiss"
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
