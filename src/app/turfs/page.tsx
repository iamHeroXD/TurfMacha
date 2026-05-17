"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense, useState } from "react";
import { LayoutGrid, Map, X, SlidersHorizontal } from "lucide-react";
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
  loading: () => <div className="h-[420px] rounded-xl bg-white/[0.04] animate-pulse" />,
});

function TurfsContent() {
  const params = useSearchParams();
  const { latitude, longitude } = useLocationStore();
  const { sport, searchQuery, setSport, setSearchQuery } = useFilterStore();
  const [view, setView] = useState<"grid" | "map">("grid");
  const [sort, setSort] = useState("distance");

  useEffect(() => {
    const s = params.get("sport") as Sport;
    if (s) setSport(s);
  }, [params, setSport]);

  const { turfs, loading } = useTurfs({ sport, userLat: latitude, userLon: longitude, searchQuery });

  const sorted = [...turfs].sort((a, b) => {
    if (sort === "price_asc") return a.price_per_hour - b.price_per_hour;
    if (sort === "price_desc") return b.price_per_hour - a.price_per_hour;
    if (sort === "rating") return (b.rating || 0) - (a.rating || 0);
    return (a.distance || 0) - (b.distance || 0);
  });

  const hasFilters = !!(sport || searchQuery);

  return (
    <div className="min-h-screen pt-14">
      {/* Sticky filter bar */}
      <div className="sticky top-14 z-30 bg-[#0a0a0a] border-b border-white/[0.07]">
        <div className="max-w-6xl mx-auto px-4 py-3 space-y-3">

          {/* Row 1: title + view toggle */}
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-base font-semibold text-white truncate">
                {sport ? `${sport[0].toUpperCase()}${sport.slice(1)} Turfs` : "All Turfs"}
                {!loading && turfs.length > 0 && (
                  <span className="text-white/30 text-sm font-normal ml-2">({turfs.length})</span>
                )}
              </h1>
            </div>
            <div className="flex items-center gap-1 bg-white/[0.04] rounded-lg border border-white/[0.07] p-0.5 shrink-0">
              {([["grid", LayoutGrid], ["map", Map]] as const).map(([v, Icon]) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    view === v ? "bg-white/[0.09] text-white" : "text-white/35 hover:text-white/60"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: search */}
          <SearchBar />

          {/* Row 3: sport filter */}
          <SportFilter selected={sport} onSelect={setSport} />

          {/* Row 4: sort + clear */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {hasFilters && (
                <button
                  onClick={() => { setSport(undefined); setSearchQuery(undefined); }}
                  className="flex items-center gap-1 text-xs text-white/50 hover:text-white transition-colors border border-white/[0.07] rounded-lg px-2.5 py-1.5 hover:border-white/[0.14]"
                >
                  <X className="h-3 w-3" /> Clear
                </button>
              )}
            </div>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-40 h-8 text-xs">
                <SlidersHorizontal className="h-3 w-3 mr-1.5 text-white/30" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Nearest first</SelectItem>
                <SelectItem value="rating">Highest rated</SelectItem>
                <SelectItem value="price_asc">Price: low–high</SelectItem>
                <SelectItem value="price_desc">Price: high–low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {view === "map" ? (
          <>
            <TurfMap
              turfs={sorted}
              center={latitude && longitude ? [latitude, longitude] : [12.9716, 77.5946]}
              className="h-[420px] mb-6"
            />
            {loading ? <TurfGridSkeleton /> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sorted.map((t, i) => <TurfCard key={t.id} turf={t} index={i} />)}
              </div>
            )}
          </>
        ) : loading ? (
          <TurfGridSkeleton />
        ) : sorted.length === 0 ? (
          <div className="py-28 text-center">
            <p className="text-4xl mb-4">🏟️</p>
            <p className="font-medium text-white/60 mb-1">No turfs found</p>
            <p className="text-sm text-white/30 mb-6">Try adjusting your search or filters</p>
            {hasFilters && (
              <Button variant="outline" size="sm" onClick={() => { setSport(undefined); setSearchQuery(undefined); }}>
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map((t, i) => <TurfCard key={t.id} turf={t} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TurfsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-14">
        <div className="sticky top-14 z-30 bg-[#0a0a0a] border-b border-white/[0.07] h-36" />
        <div className="max-w-6xl mx-auto px-4 py-6"><TurfGridSkeleton /></div>
      </div>
    }>
      <TurfsContent />
    </Suspense>
  );
}
