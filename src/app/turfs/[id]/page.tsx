"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, MapPin, Clock, ChevronLeft, Heart, Share2,
  CheckCircle2, Wifi, Car, Droplets, Zap, Coffee, ShieldCheck,
  ChevronRight, Users, Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingModal } from "@/components/booking/BookingModal";
import { Turf } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { formatPrice, formatTime, SPORTS_CONFIG } from "@/lib/utils";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const TurfMap = dynamic(() => import("@/components/map/TurfMap").then(m => ({ default: m.TurfMap })), {
  ssr: false,
  loading: () => <div className="h-[280px] glass-card animate-pulse rounded-2xl" />,
});

const AMENITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Parking": Car,
  "Wifi": Wifi,
  "Showers": Droplets,
  "Floodlights": Zap,
  "Cafeteria": Coffee,
  "First Aid": ShieldCheck,
};

export default function TurfDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user } = useAuthStore();

  const [turf, setTurf] = useState<Turf | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [shareMsg, setShareMsg] = useState("");

  useEffect(() => {
    const fetchTurf = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.from("turfs").select("*").eq("id", id).single();
        setTurf(data as Turf);
        if (user) {
          const { data: fav } = await supabase
            .from("favorites").select("id").eq("user_id", user.id).eq("turf_id", id).single();
          setIsFavorite(!!fav);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTurf();
  }, [id, user]);

  const toggleFavorite = async () => {
    if (!user) { router.push("/login"); return; }
    const supabase = createClient();
    if (isFavorite) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("turf_id", id);
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, turf_id: id });
    }
    setIsFavorite(!isFavorite);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: turf?.name, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareMsg("Link copied!");
        setTimeout(() => setShareMsg(""), 2000);
      }
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16">
        <Skeleton className="h-72 md:h-[420px] w-full rounded-none" />
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
          </div>
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!turf) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏟️</div>
          <h2 className="text-xl font-bold text-white mb-2">Turf not found</h2>
          <p className="text-white/50 text-sm mb-6">This turf may have been removed or doesn&apos;t exist.</p>
          <Link href="/turfs"><Button>Browse Turfs</Button></Link>
        </div>
      </div>
    );
  }

  const images = turf.images?.length
    ? turf.images
    : [
        `https://picsum.photos/seed/${turf.id}a/1200/600`,
        `https://picsum.photos/seed/${turf.id}b/1200/600`,
        `https://picsum.photos/seed/${turf.id}c/1200/600`,
      ];

  return (
    <div className="min-h-screen pt-16">
      {/* Image Gallery */}
      <div className="relative h-64 md:h-[420px] overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
          >
            <Image
              src={images[activeImage]}
              alt={turf.name}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-black/10 to-black/30" />

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 p-2 glass rounded-xl text-white hover:bg-white/15 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={toggleFavorite}
            className={cn(
              "p-2 rounded-xl backdrop-blur-sm border transition-all",
              isFavorite
                ? "bg-red-500/30 border-red-500/40 text-red-400"
                : "glass text-white hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
            )}
          >
            <Heart className={cn("h-5 w-5", isFavorite && "fill-red-400")} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 glass rounded-xl text-white hover:bg-white/15 transition-colors relative"
          >
            <Share2 className="h-5 w-5" />
            {shareMsg && (
              <div className="absolute right-0 top-10 bg-black/80 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                {shareMsg}
              </div>
            )}
          </button>
        </div>

        {/* Image nav arrows (desktop) */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveImage((p) => (p - 1 + images.length) % images.length)}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 p-2 glass rounded-xl text-white hover:bg-white/15 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setActiveImage((p) => (p + 1) % images.length)}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 p-2 glass rounded-xl text-white hover:bg-white/15 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={cn(
                  "rounded-full transition-all duration-300",
                  i === activeImage ? "bg-white w-6 h-2" : "bg-white/40 w-2 h-2"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-7">

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-wrap gap-2 mb-3">
                {turf.sports.map((sport) => (
                  <Badge key={sport} className={`bg-gradient-to-r ${SPORTS_CONFIG[sport].gradient} text-white border-0 text-xs`}>
                    {SPORTS_CONFIG[sport].emoji} {SPORTS_CONFIG[sport].label}
                  </Badge>
                ))}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">{turf.name}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 star-filled" />
                  <span className="text-white font-semibold">{turf.rating?.toFixed(1) || "New"}</span>
                  {turf.total_reviews > 0 && (
                    <span className="text-white/40">({turf.total_reviews} reviews)</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-white/50">
                  <MapPin className="h-4 w-4 text-white/30" />
                  {turf.address}, {turf.city}, {turf.state}
                </div>
              </div>
            </motion.div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="glass-card p-4 text-center">
                <Clock className="h-5 w-5 text-emerald-400 mx-auto mb-1.5" />
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Hours</p>
                <p className="text-xs font-semibold text-white">
                  {formatTime(turf.operating_hours_start)} – {formatTime(turf.operating_hours_end)}
                </p>
              </div>
              <div className="glass-card p-4 text-center">
                <Users className="h-5 w-5 text-blue-400 mx-auto mb-1.5" />
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Reviews</p>
                <p className="text-xs font-semibold text-white">{turf.total_reviews || 0}</p>
              </div>
              <div className="glass-card p-4 text-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mx-auto mb-1.5" />
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Status</p>
                <p className={cn("text-xs font-semibold", turf.is_active ? "text-emerald-400" : "text-red-400")}>
                  {turf.is_active ? "Open" : "Closed"}
                </p>
              </div>
            </div>

            {/* Description */}
            {turf.description && (
              <div className="glass-card p-5">
                <h3 className="font-semibold text-white mb-3">About this Turf</h3>
                <p className="text-white/55 text-sm leading-relaxed">{turf.description}</p>
              </div>
            )}

            {/* Amenities */}
            {turf.amenities?.length > 0 && (
              <div>
                <h3 className="font-semibold text-white mb-4">Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {turf.amenities.map((amenity) => {
                    const Icon = AMENITY_ICONS[amenity] || CheckCircle2;
                    return (
                      <div key={amenity} className="flex items-center gap-2.5 glass-card px-3 py-2.5 text-sm text-white/70">
                        <Icon className="h-4 w-4 text-emerald-400 shrink-0" />
                        {amenity}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Location */}
            <div>
              <h3 className="font-semibold text-white mb-4">Location</h3>
              <div className="flex items-start gap-2 text-white/55 text-sm mb-4">
                <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{turf.address}, {turf.city}, {turf.state}</span>
              </div>
              {turf.latitude && turf.longitude && (
                <TurfMap
                  selectedTurf={turf}
                  center={[turf.latitude, turf.longitude]}
                  zoom={15}
                  className="h-[280px]"
                />
              )}
            </div>

            {/* Photo gallery */}
            {images.length > 1 && (
              <div>
                <h3 className="font-semibold text-white mb-4">Photos</h3>
                <div className="grid grid-cols-3 gap-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={cn(
                        "relative h-24 rounded-xl overflow-hidden border-2 transition-all duration-200",
                        activeImage === i
                          ? "border-emerald-500 shadow-lg shadow-emerald-500/30 scale-[0.98]"
                          : "border-transparent opacity-70 hover:opacity-100 hover:border-white/20"
                      )}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Booking sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="glass-card p-6">
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold text-emerald-400">{formatPrice(turf.price_per_hour)}</span>
                  <span className="text-white/40 text-sm">/ hour</span>
                </div>

                <div className="space-y-2.5 mb-5">
                  <div className="flex items-center gap-2 text-sm text-white/55">
                    <Clock className="h-4 w-4 text-white/30 shrink-0" />
                    <span>{formatTime(turf.operating_hours_start)} – {formatTime(turf.operating_hours_end)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/55">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Instant confirmation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/55">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Secure payment</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/55">
                    <Calendar className="h-4 w-4 text-white/30 shrink-0" />
                    <span>Book up to 7 days ahead</span>
                  </div>
                </div>

                <Button
                  className="w-full shadow-lg shadow-emerald-500/20"
                  size="lg"
                  disabled={!turf.is_active}
                  onClick={() => {
                    if (!user) router.push("/login");
                    else setBookingOpen(true);
                  }}
                >
                  {turf.is_active ? "Book Now" : "Not Available"}
                </Button>

                {!user && turf.is_active && (
                  <p className="text-xs text-white/35 text-center mt-3">
                    <Link href="/login" className="text-emerald-400 hover:underline">Sign in</Link> to book
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky booking bar */}
      <div className="lg:hidden fixed bottom-20 left-0 right-0 z-40 px-4 pb-2">
        <div className="glass-strong rounded-2xl p-4 flex items-center justify-between gap-4 shadow-2xl shadow-black/60">
          <div>
            <span className="text-xl font-bold text-emerald-400">{formatPrice(turf.price_per_hour)}</span>
            <span className="text-white/40 text-xs ml-1">/ hr</span>
          </div>
          <Button
            className="flex-1 shadow-lg shadow-emerald-500/25"
            disabled={!turf.is_active}
            onClick={() => {
              if (!user) router.push("/login");
              else setBookingOpen(true);
            }}
          >
            {turf.is_active ? "Book Now" : "Not Available"}
          </Button>
        </div>
      </div>

      {bookingOpen && (
        <BookingModal turf={turf} open={bookingOpen} onClose={() => setBookingOpen(false)} />
      )}
    </div>
  );
}
