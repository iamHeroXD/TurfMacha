"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Clock, Zap, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Turf } from "@/types";
import { formatPrice, formatDistance, SPORTS_CONFIG } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface TurfCardProps {
  turf: Turf;
  index?: number;
  showFavorite?: boolean;
}

export function TurfCard({ turf, index = 0, showFavorite = true }: TurfCardProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const primarySport = turf.sports[0];
  const sportConfig = SPORTS_CONFIG[primarySport];
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const toggleFav = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { router.push("/login"); return; }
    setFavLoading(true);
    try {
      const supabase = createClient();
      if (isFav) {
        await supabase.from("favorites").delete().eq("user_id", user.id).eq("turf_id", turf.id);
      } else {
        await supabase.from("favorites").insert({ user_id: user.id, turf_id: turf.id });
      }
      setIsFav(!isFav);
    } finally {
      setFavLoading(false);
    }
  };

  const ratingStars = turf.rating ? Math.round(turf.rating) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
      className="group"
    >
      <Link href={`/turfs/${turf.id}`} className="block">
        <div className="glass-card overflow-hidden transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-black/40 group-hover:border-white/15">

          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={turf.images?.[0] || `https://picsum.photos/seed/${turf.id}/800/400`}
              alt={turf.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

            {/* Sport badge + Availability */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <Badge className={`bg-gradient-to-r ${sportConfig.gradient} text-white border-0 text-xs shadow-lg`}>
                {sportConfig.emoji} {sportConfig.label}
              </Badge>
              {turf.is_active && (
                <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm border border-emerald-500/30 rounded-full px-2 py-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] text-emerald-400 font-medium">Open</span>
                </div>
              )}
            </div>

            {/* Favorite + Price */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="bg-black/50 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/10">
                <span className="text-emerald-400 font-bold text-sm">
                  {formatPrice(turf.price_per_hour)}
                </span>
                <span className="text-white/50 text-xs">/hr</span>
              </div>

              {showFavorite && (
                <button
                  onClick={toggleFav}
                  disabled={favLoading}
                  className={cn(
                    "p-1.5 rounded-xl backdrop-blur-sm border transition-all duration-200",
                    isFav
                      ? "bg-red-500/30 border-red-500/40 text-red-400"
                      : "bg-black/40 border-white/10 text-white/60 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10"
                  )}
                  aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart className={cn("h-4 w-4", isFav && "fill-red-400")} />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="font-semibold text-white text-[15px] leading-tight group-hover:text-emerald-400 transition-colors line-clamp-1">
                {turf.name}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                <Star className="h-3.5 w-3.5 star-filled" />
                <span className="text-white text-sm font-bold">
                  {turf.rating?.toFixed(1) || "—"}
                </span>
                {turf.total_reviews > 0 && (
                  <span className="text-white/35 text-xs">({turf.total_reviews})</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 text-white/50 text-xs mb-3">
              <MapPin className="h-3 w-3 shrink-0 text-white/30" />
              <span className="truncate">{turf.address}, {turf.city}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-[11px] text-white/40">
                <Clock className="h-3 w-3" />
                <span>{turf.operating_hours_start} – {turf.operating_hours_end}</span>
              </div>
              {turf.distance !== undefined ? (
                <span className="text-[11px] text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
                  {formatDistance(turf.distance)} away
                </span>
              ) : null}
            </div>

            {/* Extra sports */}
            {turf.sports.length > 1 && (
              <div className="flex gap-1 mt-3 flex-wrap">
                {turf.sports.slice(1, 3).map((sport) => (
                  <span key={sport} className="sport-badge text-[10px] py-0.5">
                    {SPORTS_CONFIG[sport].emoji} {SPORTS_CONFIG[sport].label}
                  </span>
                ))}
                {turf.sports.length > 3 && (
                  <span className="sport-badge text-[10px] py-0.5">+{turf.sports.length - 3}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
