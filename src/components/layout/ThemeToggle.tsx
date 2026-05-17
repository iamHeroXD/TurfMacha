"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — only render after client mount
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-8 h-8" />;
  }

  const isDark = theme === "dark";

  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-1.5 rounded-lg transition-colors text-white/50 hover:text-white hover:bg-white/[0.06] dark:text-white/50 dark:hover:text-white dark:hover:bg-white/[0.06] light:text-slate-500 light:hover:text-slate-900 light:hover:bg-black/[0.06]"
      style={{
        color: isDark ? undefined : "rgba(15,23,42,0.5)",
      }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ rotate: -30, opacity: 0, scale: 0.8 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 30, opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.18 }}
          className="block"
        >
          {isDark ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
