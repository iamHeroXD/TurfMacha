"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Clock, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Turf } from "@/types";
import { formatPrice, formatDistance, SPORTS_CONFIG } from "@/lib/utils";

interface TurfCardProps {
  turf: Turf;
  index?: number;
}

export function TurfCard({ turf, index = 0 }: TurfCardProps) {
  const primarySport = turf.sports[0];
  const sportConfig = SPORTS_CONFIG[primarySport];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link href={`/turfs/${turf.id}`} className="block group">
        <div className="glass-card overflow-hidden card-hover cursor-pointer">
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={turf.images?.[0] || `https://picsum.photos/seed/${turf.id}/800/400`}
              alt={turf.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Top badges */}
            <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
              <Badge className={`bg-gradient-to-r ${sportConfig.gradient} text-white border-0 text-xs`}>
                {sportConfig.emoji} {sportConfig.label}
              </Badge>
              {turf.is_active && (
                <div className="flex items-center gap-1 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-full px-2 py-0.5">
                  <Zap className="h-3 w-3 text-emerald-400 fill-emerald-400" />
                  <span className="text-xs text-emerald-400 font-medium">Available</span>
                </div>
              )}
            </div>

            {/* Price overlay */}
            <div className="absolute bottom-3 right-3">
              <div className="bg-black/60 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/10">
                <span className="text-emerald-400 font-bold text-sm">
                  {formatPrice(turf.price_per_hour)}
                </span>
                <span className="text-white/50 text-xs">/hr</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-white text-base leading-tight group-hover:text-emerald-400 transition-colors">
                {turf.name}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                <Star className="h-3.5 w-3.5 star-filled" />
                <span className="text-white text-sm font-semibold">{turf.rating?.toFixed(1) || "New"}</span>
                {turf.total_reviews > 0 && (
                  <span className="text-white/40 text-xs">({turf.total_reviews})</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 mt-1.5 text-white/50 text-xs">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{turf.address}, {turf.city}</span>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1 text-xs text-white/40">
                <Clock className="h-3 w-3" />
                <span>{turf.operating_hours_start} - {turf.operating_hours_end}</span>
              </div>

              {turf.distance !== undefined && (
                <span className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded-full">
                  {formatDistance(turf.distance)} away
                </span>
              )}
            </div>

            {/* Sports tags */}
            {turf.sports.length > 1 && (
              <div className="flex gap-1 mt-3 flex-wrap">
                {turf.sports.slice(0, 3).map((sport) => (
                  <span key={sport} className="sport-badge text-[10px]">
                    {SPORTS_CONFIG[sport].emoji} {SPORTS_CONFIG[sport].label}
                  </span>
                ))}
                {turf.sports.length > 3 && (
                  <span className="sport-badge text-[10px]">+{turf.sports.length - 3}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
