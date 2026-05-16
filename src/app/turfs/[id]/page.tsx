"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star, MapPin, Clock, ChevronLeft, Heart, Share2,
  CheckCircle2, Phone, Wifi, Car, Droplets, Zap, Coffee, ShieldCheck
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

const TurfMap = dynamic(() => import("@/components/map/TurfMap").then(m => ({ default: m.TurfMap })), {
  ssr: false,
  loading: () => <div className="h-[300px] glass-card animate-pulse rounded-2xl" />,
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

  useEffect(() => {
    const fetchTurf = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("turfs")
          .select("*")
          .eq("id", id)
          .single();
        setTurf(data as Turf);

        if (user) {
          const { data: fav } = await supabase
            .from("favorites")
            .select("id")
            .eq("user_id", user.id)
            .eq("turf_id", id)
            .single();
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

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-72 w-full rounded-2xl" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!turf) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏟️</div>
          <h2 className="text-xl font-bold text-white">Turf not found</h2>
          <Link href="/turfs"><Button className="mt-4">Browse Turfs</Button></Link>
        </div>
      </div>
    );
  }

  const images = turf.images?.length
    ? turf.images
    : [`https://picsum.photos/seed/${turf.id}a/1200/600`, `https://picsum.photos/seed/${turf.id}b/1200/600`, `https://picsum.photos/seed/${turf.id}c/1200/600`];

  return (
    <div className="min-h-screen pt-16">
      {/* Image Gallery */}
      <div className="relative h-72 md:h-96">
        <Image
          src={images[activeImage]}
          alt={turf.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-transparent to-transparent" />

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-20 left-4 p-2 glass rounded-xl text-white hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Action buttons */}
        <div className="absolute top-20 right-4 flex gap-2">
          <button
            onClick={toggleFavorite}
            className={`p-2 rounded-xl transition-all ${
              isFavorite ? "bg-red-500/30 text-red-400" : "glass text-white hover:bg-white/20"
            }`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-400" : ""}`} />
          </button>
          <button className="p-2 glass rounded-xl text-white hover:bg-white/20 transition-colors">
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === activeImage ? "bg-white w-6" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">{turf.name}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 star-filled" />
                      <span className="text-white font-semibold">{turf.rating?.toFixed(1) || "New"}</span>
                      {turf.total_reviews > 0 && (
                        <span className="text-white/40 text-sm">({turf.total_reviews} reviews)</span>
                      )}
                    </div>
                    <span className="text-white/20">•</span>
                    <div className="flex items-center gap-1 text-white/50 text-sm">
                      <MapPin className="h-3.5 w-3.5" />
                      {turf.city}, {turf.state}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-emerald-400">{formatPrice(turf.price_per_hour)}</span>
                  <span className="text-white/40 text-sm">/hr</span>
                </div>
              </div>
            </motion.div>

            {/* Sports */}
            <div className="flex flex-wrap gap-2">
              {turf.sports.map((sport) => (
                <Badge key={sport} className={`bg-gradient-to-r ${SPORTS_CONFIG[sport].gradient} text-white border-0`}>
                  {SPORTS_CONFIG[sport].emoji} {SPORTS_CONFIG[sport].label}
                </Badge>
              ))}
            </div>

            {/* Quick info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="glass-card p-4 text-center">
                <Clock className="h-5 w-5 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs text-white/50">Hours</p>
                <p className="text-sm font-semibold text-white mt-0.5">
                  {formatTime(turf.operating_hours_start)} - {formatTime(turf.operating_hours_end)}
                </p>
              </div>
              <div className="glass-card p-4 text-center">
                <Star className="h-5 w-5 text-yellow-400 mx-auto mb-2" />
                <p className="text-xs text-white/50">Rating</p>
                <p className="text-sm font-semibold text-white mt-0.5">{turf.rating?.toFixed(1) || "New"}</p>
              </div>
              <div className="glass-card p-4 text-center col-span-2 sm:col-span-1">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs text-white/50">Status</p>
                <p className="text-sm font-semibold text-emerald-400 mt-0.5">
                  {turf.is_active ? "Open for Booking" : "Closed"}
                </p>
              </div>
            </div>

            {/* Description */}
            {turf.description && (
              <div>
                <h3 className="font-semibold text-white mb-3">About this Turf</h3>
                <p className="text-white/60 text-sm leading-relaxed">{turf.description}</p>
              </div>
            )}

            {/* Amenities */}
            {turf.amenities?.length > 0 && (
              <div>
                <h3 className="font-semibold text-white mb-3">Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {turf.amenities.map((amenity) => {
                    const Icon = AMENITY_ICONS[amenity] || CheckCircle2;
                    return (
                      <div key={amenity} className="flex items-center gap-2 text-sm text-white/70">
                        <Icon className="h-4 w-4 text-emerald-400 shrink-0" />
                        {amenity}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Address */}
            <div>
              <h3 className="font-semibold text-white mb-3">Location</h3>
              <div className="flex items-start gap-2 text-white/60 text-sm mb-4">
                <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{turf.address}, {turf.city}, {turf.state}</span>
              </div>
              <TurfMap
                selectedTurf={turf}
                center={[turf.latitude, turf.longitude]}
                zoom={15}
                className="h-[300px]"
              />
            </div>

            {/* Thumbnail gallery */}
            {images.length > 1 && (
              <div>
                <h3 className="font-semibold text-white mb-3">Photos</h3>
                <div className="grid grid-cols-3 gap-3">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`relative h-24 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === i ? "border-emerald-500" : "border-transparent"
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="glass-card p-6 space-y-4">
                <div>
                  <span className="text-3xl font-bold text-emerald-400">{formatPrice(turf.price_per_hour)}</span>
                  <span className="text-white/40 text-sm"> / hour</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-white/60">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(turf.operating_hours_start)} – {formatTime(turf.operating_hours_end)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Instant confirmation</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>Secure booking</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  disabled={!turf.is_active}
                  onClick={() => {
                    if (!user) router.push("/login");
                    else setBookingOpen(true);
                  }}
                >
                  {turf.is_active ? "Book Now" : "Not Available"}
                </Button>

                {!user && (
                  <p className="text-xs text-white/40 text-center">
                    <Link href="/login" className="text-emerald-400 hover:underline">Sign in</Link> to book this turf
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {bookingOpen && (
        <BookingModal
          turf={turf}
          open={bookingOpen}
          onClose={() => setBookingOpen(false)}
        />
      )}
    </div>
  );
}
