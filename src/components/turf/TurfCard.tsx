"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Clock } from "lucide-react";
import { Turf } from "@/types";
import { formatPrice, formatDistance, SPORTS_CONFIG } from "@/lib/utils";

interface TurfCardProps {
  turf: Turf;
  index?: number;
}

export function TurfCard({ turf, index = 0 }: TurfCardProps) {
  const primary = SPORTS_CONFIG[turf.sports[0]];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.06, 0.3) }}
      whileHover={{ y: -3 }}
    >
      <Link href={`/turfs/${turf.id}`} className="block group">
        <div
          className="rounded-xl border border-white/[0.07] bg-[#111111] overflow-hidden"
          style={{ transition: "border-color 200ms ease, box-shadow 200ms ease" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.14)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(0,0,0,0.35)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
          }}
        >
          {/* Image */}
          <div className="relative h-44 overflow-hidden bg-[#0e0e0e]">
            <Image
              src={turf.images?.[0] || `https://picsum.photos/seed/${turf.id}/800/400`}
              alt={turf.name}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

            {/* Sport badge */}
            <div className="absolute top-2.5 left-2.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-black/55 text-white/90 border border-white/[0.09] backdrop-blur-[2px]">
                {primary.emoji} {primary.label}
              </span>
            </div>

            {/* Price */}
            <div className="absolute bottom-2.5 right-2.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-sm font-semibold bg-black/65 text-white border border-white/[0.09] backdrop-blur-[2px]">
                {formatPrice(turf.price_per_hour)}
                <span className="text-white/45 text-[11px] font-normal ml-0.5">/hr</span>
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="font-semibold text-white text-sm leading-snug group-hover:text-emerald-400 transition-colors duration-150 line-clamp-1">
                {turf.name}
              </h3>
              <div className="flex items-center gap-1 shrink-0 text-xs">
                <Star className="h-3 w-3 star-filled shrink-0" />
                <span className="text-white/75 font-medium">{turf.rating?.toFixed(1) ?? "—"}</span>
                {turf.total_reviews > 0 && (
                  <span className="text-white/30">({turf.total_reviews})</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-white/40 mb-3">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{turf.address}, {turf.city}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-white/30">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 shrink-0" />
                <span>{turf.operating_hours_start} – {turf.operating_hours_end}</span>
              </div>
              {turf.distance !== undefined && (
                <span>{formatDistance(turf.distance)} away</span>
              )}
            </div>

            {turf.sports.length > 1 && (
              <div className="flex gap-1 mt-3 flex-wrap">
                {turf.sports.slice(1, 3).map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-white/[0.04] text-white/45 border border-white/[0.05]"
                  >
                    {SPORTS_CONFIG[s].emoji} {SPORTS_CONFIG[s].label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
