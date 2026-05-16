"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useFilterStore } from "@/store/useFilterStore";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export function SearchBar({ className, placeholder = "Search turfs, cities..." }: SearchBarProps) {
  const { searchQuery, setSearchQuery } = useFilterStore();
  const [value, setValue] = useState(searchQuery || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(value || undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [value, setSearchQuery]);

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 pl-11 pr-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 text-sm"
      />
      {value && (
        <button
          onClick={() => {
            setValue("");
            setSearchQuery(undefined);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
