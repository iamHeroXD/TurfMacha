"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, MapIcon, GridIcon } from "lucide-react";
import { useState } from "react";
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

const TurfMap = dynamic(() => import("@/components/map/TurfMap").then(m => ({ default: m.TurfMap })), {
  ssr: false,
  loading: () => <div className="h-[400px] glass-card animate-pulse rounded-2xl" />,
});

function TurfsContent() {
  const searchParams = useSearchParams();
  const { latitude, longitude } = useLocationStore();
  const { sport, searchQuery, setSport, setSearchQuery } = useFilterStore();
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [sortBy, setSortBy] = useState("distance");

  // Sync sport from URL
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

  return (
    <div className="min-h-screen pt-20 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0a0a1a] to-transparent pt-8 pb-6 px-4 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl font-bold text-white">
              {sport ? `${sport.charAt(0).toUpperCase() + sport.slice(1)} Turfs` : "All Turfs"}
              {turfs.length > 0 && (
                <span className="text-white/40 text-base font-normal ml-2">
                  ({turfs.length} found)
                </span>
              )}
            </h1>
          </motion.div>

          <SearchBar />

          {/* Sport filter */}
          <SportFilter selected={sport} onSelect={setSport} />

          {/* Sort & View controls */}
          <div className="flex items-center justify-between gap-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 h-9 text-xs">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Nearest First</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon-sm"
                onClick={() => setViewMode("grid")}
              >
                <GridIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "map" ? "secondary" : "ghost"}
                size="icon-sm"
                onClick={() => setViewMode("map")}
              >
                <MapIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {viewMode === "map" && (latitude || turfs.length > 0) ? (
          <div className="mb-8">
            <TurfMap
              turfs={sortedTurfs}
              center={latitude && longitude ? [latitude, longitude] : [12.9716, 77.5946]}
              className="h-[500px]"
            />
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <TurfGridSkeleton />
              ) : (
                sortedTurfs.map((turf, i) => (
                  <TurfCard key={turf.id} turf={turf} index={i} />
                ))
              )}
            </div>
          </div>
        ) : (
          <>
            {loading ? (
              <TurfGridSkeleton />
            ) : sortedTurfs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24"
              >
                <div className="text-6xl mb-4">🏟️</div>
                <h3 className="text-xl font-semibold text-white">No turfs found</h3>
                <p className="text-white/40 mt-2 text-sm">
                  Try adjusting your filters or search in a different area
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => {
                    setSport(undefined);
                    setSearchQuery(undefined);
                  }}
                >
                  Clear filters
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedTurfs.map((turf, i) => (
                  <TurfCard key={turf.id} turf={turf} index={i} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function TurfsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-20 px-4"><TurfGridSkeleton /></div>}>
      <TurfsContent />
    </Suspense>
  );
}
