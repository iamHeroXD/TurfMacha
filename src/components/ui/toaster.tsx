"use client";

import { useToast } from "@/hooks/useToast";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-24 md:bottom-6 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`
              flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl
              ${toast.variant === "destructive"
                ? "bg-red-500/10 border-red-500/30 text-red-300"
                : "bg-brand-400/10 border-brand-400/30 text-brand-300"
              }
            `}
          >
            <div className="flex-1">
              {toast.title && <p className="font-semibold text-sm">{toast.title}</p>}
              {toast.description && (
                <p className="text-xs opacity-80 mt-0.5">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="text-current opacity-60 hover:opacity-100 transition-opacity mt-0.5"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
