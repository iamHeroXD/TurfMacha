"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BrandMark } from "@/components/ui/BrandMark";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Native-app-style boot splash. While auth is initializing we cover the screen
 * with a branded splash, so the user never sees a half-rendered dashboard flash
 * before middleware/redirects settle. Once auth is resolved it fades out.
 */
export function SplashGate({ children }: { children: React.ReactNode }) {
  const initialized = useAuthStore((s) => s.initialized);

  return (
    <>
      {children}
      <AnimatePresence>
        {!initialized && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-0 z-[300] flex flex-col items-center justify-center gap-5 bg-[#F4F1EB]"
            style={{
              paddingTop: "env(safe-area-inset-top, 0px)",
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-4"
            >
              <BrandMark size={64} />
              <span className="font-display font-bold text-2xl text-[#0D4D36] tracking-tight">
                TurfMacha
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="h-7 w-7 rounded-full border-[3px] border-[#0D4D36]/15 border-t-[#0D4D36] animate-spin"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
