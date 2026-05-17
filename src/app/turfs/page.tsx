"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, MapIcon, LayoutGrid, X, ChevronDown } from "lucide-react";
import { TurfCard } from "@/components/turf/TurfCard";
import { TurfGridSkeleton } from "@/components/turf/TurfCardSkeleton";
import { SportFilter } from "@/components/turf/SportFilter";
import { SearchBar } from "@/components/turf/SearchBar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTurfs } from "@/hooks/useTurfs";
import { useLocationStore } from "@/store/useLocationStore";
import { useFilterStore } from "@/store/useFilterStore";
import { Sport } from "@/types";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const TurfMap = dynamic(() => import("@/components/map/TurfMap").then(m => ({ default: m.TurfMap })), {
  ssr: false,
  loading: () => <div className="h-[450px] glass-card animate-pulse rounded-2xl" />,
});

const SORT_OPTIONS = [
  { value: "distance", label: "Nearest First" },
  { value: "rating", label: "Highest Rated" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

function TurfsContent() {
  const searchParams = useSearchParams();
  const { latitude, longitude } = useLocationStore();
  const { sport, searchQuery, setSport, setSearchQuery } = useFilterStore();
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [sortBy, setSortBy] = useState("distance");

  useEffect(() => {
    const urlSport = searchParams.get("sport") as Sport;
    if (urlSport) setSport(urlSport);
  }, [searchParams, setSport]);

  const { turfs, loading } = useTurfs({
    sport,
    userLat: latitude,
    userLon: longitude,
    searchQuery,
  });

  const sortedTurfs = [...turfs].sort((a, b) => {
    switch (sortBy) {
      case "price_asc": return a.price_per_hour - b.price_per_hour;
      case "price_desc": return b.price_per_hour - a.price_per_hour;
      case "rating": return (b.rating || 0) - (a.rating || 0);
      default: return (a.distance || 0) - (b.distance || 0);
    }
  });

  const hasActiveFilters = !!(sport || searchQuery);

  const clearFilters = () => {
    setSport(undefined);
    setSearchQuery(undefined);
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Sticky header */}
      <div className="sticky top-16 z-30 bg-[#0a0a1a]/95 backdrop-blur-xl border-b border-white/8 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
          {/* Title row */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white">
                {sport ? `${sport.charAt(0).toUpperCase() + sport.slice(1)} Turfs` : "All Turfs"}
                {!loading && turfs.length > 0 && (
                  <span className="text-white/35 text-sm font-normal ml-2">
                    {turfs.length} found
                  </span>
                )}
              </h1>
            </div>

            {/* View toggle */}
            <div className="flex items-center bg-white/5 rounded-xl border border-white/10 p-1 shrink-0">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 rounded-lg transition-all duration-200",
                  viewMode === "grid" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={cn(
                  "p-1.5 rounded-lg transition-all duration-200",
                  viewMode === "map" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
                )}
              >
                <MapIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <SearchBar />

          {/* Sport filter */}
          <SportFilter selected={sport} onSelect={setSport} />

          {/* Sort + Active filters */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-medium hover:bg-emerald-500/25 transition-colors"
                >
                  <X className="h-3 w-3" />
                  Clear filters
                </motion.button>
              )}
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44 h-9 text-xs shrink-0">
                <SlidersHorizontal className="h-3.5 w-3.5 mr-1 text-white/40" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {viewMode === "map" ? (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TurfMap
                turfs={sortedTurfs}
                center={latitude && longitude ? [latitude, longitude] : [12.9716, 77.5946]}
                className="h-[450px] mb-8"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {loading ? (
                  <TurfGridSkeleton />
                ) : (
                  sortedTurfs.map((turf, i) => (
                    <TurfCard key={turf.id} turf={turf} index={i} />
                  ))
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {loading ? (
                <TurfGridSkeleton />
              ) : sortedTurfs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-32"
                >
                  <div className="text-7xl mb-5">🏟️</div>
                  <h3 className="text-xl font-semibold text-white mb-2">No turfs found</h3>
                  <p className="text-white/40 text-sm max-w-xs mx-auto">
                    Try adjusting your filters or search in a different area
                  </p>
                  {hasActiveFilters && (
                    <Button variant="outline" className="mt-6" onClick={clearFilters}>
                      Clear all filters
                    </Button>
                  )}
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {sortedTurfs.map((turf, i) => (
                    <TurfCard key={turf.id} turf={turf} index={i} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function TurfsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-16">
        <div className="sticky top-16 z-30 bg-[#0a0a1a]/95 backdrop-blur-xl border-b border-white/8 h-40" />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <TurfGridSkeleton />
        </div>
      </div>
    }>
      <TurfsContent />
    </Suspense>
  );
}
