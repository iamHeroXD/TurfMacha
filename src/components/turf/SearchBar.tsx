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
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9284] pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 pl-11 pr-10 rounded-2xl border-2 border-[#E7E2DA] bg-white text-[#111111] text-sm placeholder:text-[#9E9284] focus:outline-none focus:border-[#0D4D36]/40 focus:ring-4 focus:ring-[#0D4D36]/8 transition-all duration-150 shadow-sm"
      />
      {value && (
        <button
          onClick={() => { setValue(""); setSearchQuery(undefined); }}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#9E9284] hover:text-[#5F5F5F] transition-colors rounded-full hover:bg-[#F4F1EB]"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
