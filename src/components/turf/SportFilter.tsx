"use client";

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
    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
      <button
        onClick={() => onSelect(undefined)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 border transition-colors duration-150",
          !selected
            ? "bg-white/[0.08] border-white/[0.12] text-white"
            : "bg-transparent border-white/[0.07] text-white/50 hover:text-white hover:border-white/[0.12]"
        )}
      >
        All Sports
      </button>
      {sports.map(([sport, cfg]) => (
        <button
          key={sport}
          onClick={() => onSelect(selected === sport ? undefined : sport)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 border transition-colors duration-150",
            selected === sport
              ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
              : "bg-transparent border-white/[0.07] text-white/50 hover:text-white hover:border-white/[0.12]"
          )}
        >
          {cfg.emoji} {cfg.label}
        </button>
      ))}
    </div>
  );
}
