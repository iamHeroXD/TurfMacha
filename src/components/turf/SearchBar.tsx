"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useFilterStore } from "@/store/useFilterStore";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export function SearchBar({ className, placeholder = "Search turfs, cities…" }: SearchBarProps) {
  const { searchQuery, setSearchQuery } = useFilterStore();
  const [value, setValue] = useState(searchQuery || "");

  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(value || undefined), 300);
    return () => clearTimeout(t);
  }, [value, setSearchQuery]);

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 pl-10 pr-9 rounded-lg border border-white/[0.09] bg-white/[0.04] text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/40 transition-colors"
      />
      {value && (
        <button
          onClick={() => { setValue(""); setSearchQuery(undefined); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-white/30 hover:text-white/70 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
