"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Clock, Coins } from "lucide-react";
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.07, 0.28) }}
      whileHover={{ y: -4 }}
    >
      <Link href={`/turfs/${turf.id}`} className="block group">
        <div className="bg-white border border-[#E7E2DA] rounded-2xl overflow-hidden transition-all duration-200 group-hover:border-[#0D4D36]/20 group-hover:shadow-xl group-hover:shadow-[#0D4D36]/8">

          {/* Image */}
          <div className="relative h-48 overflow-hidden bg-[#F4F1EB]">
            <Image
              src={turf.images?.[0] || `https://picsum.photos/seed/${turf.id}/800/400`}
              alt={`${turf.name} turf in ${turf.city}`}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

            {/* Sport badge */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/92 text-[#111111] backdrop-blur-sm shadow-sm">
                {primary.emoji} {primary.label}
              </span>
              {turf.is_featured && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-black">
                  ★ Featured
                </span>
              )}
            </div>

            {/* Price */}
            <div className="absolute bottom-3 right-3">
              <span className="inline-flex items-baseline gap-0.5 px-2.5 py-1 rounded-full text-sm font-bold bg-white/92 text-[#111111] backdrop-blur-sm shadow-sm">
                {formatPrice(turf.price_per_hour)}
                <span className="text-[#5F5F5F] text-[10px] font-normal">/hr</span>
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="font-display font-bold text-[#111111] text-sm leading-snug group-hover:text-[#0D4D36] transition-colors duration-150 line-clamp-1">
                {turf.name}
              </h3>
              {turf.rating !== undefined && turf.rating !== null && (
                <div className="flex items-center gap-1 shrink-0 text-xs">
                  <Star className="h-3 w-3 star-filled shrink-0" />
                  <span className="text-[#111111] font-bold">{turf.rating.toFixed(1)}</span>
                  {turf.total_reviews > 0 && (
                    <span className="text-[#9E9284]">({turf.total_reviews})</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#9E9284] mb-3">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{turf.address}, {turf.city}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-[#9E9284]">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 shrink-0" />
                <span>{turf.operating_hours_start} – {turf.operating_hours_end}</span>
              </div>
              {turf.distance !== undefined && (
                <span>{formatDistance(turf.distance)} away</span>
              )}
            </div>

            {(turf.sports.length > 1 || (turf.rewards_enabled && (turf.coins_per_booking ?? 0) > 0)) && (
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E7E2DA] flex-wrap gap-1">
                {turf.sports.length > 1 && (
                  <div className="flex gap-1 flex-wrap">
                    {turf.sports.slice(1, 3).map((s) => (
                      <span key={s} className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] bg-[#F4F1EB] text-[#5F5F5F] border border-[#E7E2DA]">
                        {SPORTS_CONFIG[s].emoji} {SPORTS_CONFIG[s].label}
                      </span>
                    ))}
                  </div>
                )}
                {turf.rewards_enabled && (turf.coins_per_booking ?? 0) > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-[#0D4D36]/8 text-[#0D4D36] border border-[#0D4D36]/12 font-semibold">
                    <Coins className="h-2.5 w-2.5" /> +{turf.coins_per_booking} coins
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}