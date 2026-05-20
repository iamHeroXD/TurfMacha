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
          "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap shrink-0 border-2 transition-all duration-150",
          !selected
            ? "bg-[#0D4D36] border-[#0D4D36] text-white shadow-md shadow-[#0D4D36]/20"
            : "bg-white border-[#E7E2DA] text-[#5F5F5F] hover:border-[#0D4D36]/30 hover:text-[#111111]"
        )}
      >
        All Sports
      </button>
      {sports.map(([sport, cfg]) => (
        <button
          key={sport}
          onClick={() => onSelect(selected === sport ? undefined : sport)}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap shrink-0 border-2 transition-all duration-150",
            selected === sport
              ? "bg-[#0D4D36] border-[#0D4D36] text-white shadow-md shadow-[#0D4D36]/20"
              : "bg-white border-[#E7E2DA] text-[#5F5F5F] hover:border-[#0D4D36]/30 hover:text-[#111111]"
          )}
        >
          {cfg.emoji} {cfg.label}
        </button>
      ))}
    </div>
  );
}