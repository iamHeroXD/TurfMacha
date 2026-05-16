"use client";

import { motion } from "framer-motion";
import { Sport } from "@/types";
import { SPORTS_CONFIG } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface SportFilterProps {
  selected?: Sport;
  onSelect: (sport: Sport | undefined) => void;
}

const sports = Object.entries(SPORTS_CONFIG) as [Sport, (typeof SPORTS_CONFIG)[Sport]][];

export function SportFilter({ selected, onSelect }: SportFilterProps) {
  return (
    <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelect(undefined)}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0",
          !selected
            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
            : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
        )}
      >
        🏟️ All Sports
      </motion.button>

      {sports.map(([sport, config]) => (
        <motion.button
          key={sport}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(selected === sport ? undefined : sport)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0",
            selected === sport
              ? `bg-gradient-to-r ${config.gradient} text-white border-transparent shadow-lg`
              : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
          )}
        >
          {config.emoji} {config.label}
        </motion.button>
      ))}
    </div>
  );
}
