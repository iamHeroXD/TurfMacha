"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star, MapPin, Clock, ChevronLeft, Heart, CheckCircle2,
  Car, Wifi, Droplets, Zap, Coffee, ShieldCheck, Users, Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/booking/BookingModal";
import { Turf } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { formatPrice, formatTime, SPORTS_CONFIG } from "@/lib/utils";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const TurfMap = dynamic(
  () => import("@/components/map/TurfMap").then((m) => ({ default: m.TurfMap })),
  {
    ssr: false,
    loading: () => <div className="h-60 rounded-2xl bg-[#FAF7F0] animate-pulse" />,
  }
);

const AMENITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Parking: Car, Wifi, Showers: Droplets, Floodlights: Zap, Cafeteria: Coffee,
  "First Aid": ShieldCheck,
};

function parseDate(dateStr: string): Date {
  return new Date(dateStr.includes("T") ? dateStr : `${dateStr}T12:00:00`);
}

export default function TurfDetailPage() {
  const { id } = useParams() as { id: string };
  const router  = useRouter();
  const { user } = useAuthStore();

  const [turf,        setTurf]        = useState<Turf | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [isFav,       setIsFav]       = useState(false);
  const [activeImg,   setActiveImg]   = useState(0);
  const [copied,      setCopied]      = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const sb = createClient();
        const { data, error: fetchErr } = await sb
          .from("turfs").select("*").eq("id", id).single();
        if (fetchErr || !data) { setError(true); setLoading(false); return; }
        setTurf(data as Turf);

        if (user) {
          const { data: fav } = await sb
            .from("favorites").select("id")
            .eq("user_id", user.id).eq("turf_id", id)
            .maybeSingle();
          setIsFav(!!fav);
        }
      } catch { setError(true); }
      finally  { setLoading(false); }
    })();
  }, [id, user]);

  const toggleFav = async () => {
    if (!user) { router.push("/login"); return; }
    const sb = createClient();
    if (isFav) await sb.from("favorites").delete().eq("user_id", user.id).eq("turf_id", id);
    else        await sb.from("favorites").insert({ user_id: user.id, turf_id: id });
    setIsFav(!isFav);
  };

  const handleShare = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { /* clipboard unavailable */ }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FAF7F0] pt-14">
      <div className="h-56 md:h-80 bg-gray-200 animate-pulse" />
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <div className="h-7 bg-gray-200 rounded-xl animate-pulse w-2/3" />
        <div className="h-4 bg-gray-100 rounded-xl animate-pulse w-1/2" />
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );

  if (error || !turf) return (
    <div className="min-h-screen bg-[#FAF7F0] pt-14 flex items-center justify-center">
      <div className="text-center px-4">
        <p className="text-5xl mb-4">🏟️</p>
        <h1 className="font-display font-bold text-xl text-[#1F2937] mb-2">Turf not found</h1>
        <p className="text-[#6B7280] text-sm mb-5">
          {error ? "Could not load this turf. Please check your connection." : "This turf doesn't exist or was removed."}
        </p>
        <div className="flex gap-3 justify-center">
          {error && <Button variant="outline" onClick={() => window.location.reload()} className="rounded-xl">Retry</Button>}
          <Link href="/turfs"><Button className="rounded-xl">Browse Turfs</Button></Link>
        </div>
      </div>
    </div>
  );

  const imgs = turf.images?.length ? turf.images : [
    `https://picsum.photos/seed/${turf.id}a/1200/600`,
    `https://picsum.photos/seed/${turf.id}b/1200/600`,
    `https://picsum.photos/seed/${turf.id}c/1200/600`,
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F0] pt-14">

      {/* Hero image gallery */}
      <div className="relative h-56 md:h-[380px] overflow-hidden bg-gray-100">
        <Image
          src={imgs[activeImg]}
          alt={turf.name}
          fill
          className="object-cover"
          priority
          placeholder="empty"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 p-2 rounded-xl bg-white/90 backdrop-blur-sm text-[#1F2937] hover:bg-white transition-colors shadow-sm"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={toggleFav}
            aria-label={isFav ? "Remove from favourites" : "Add to favourites"}
            className={cn(
              "p-2 rounded-xl backdrop-blur-sm transition-colors shadow-sm",
              isFav ? "bg-red-500 text-white" : "bg-white/90 text-[#1F2937] hover:bg-white"
            )}
          >
            <Heart className={cn("h-4 w-4", isFav && "fill-white")} />
          </button>
          <div className="relative">
            <button
              onClick={handleShare}
              aria-label="Share turf"
              className="p-2 rounded-xl bg-white/90 backdrop-blur-sm text-[#1F2937] hover:bg-white transition-colors shadow-sm"
            >
              <Share2 className="h-4 w-4" />
            </button>
            {copied && (
              <div className="absolute right-0 top-10 text-xs bg-[#1F2937] text-white px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                Link copied!
              </div>
            )}
          </div>
        </div>

        {/* Dot indicator */}
        {imgs.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {imgs.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                aria-label={`View image ${i + 1}`}
                className={cn(
                  "rounded-full transition-all",
                  i === activeImg ? "bg-white w-5 h-1.5" : "bg-white/50 w-1.5 h-1.5"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Title + meta */}
            <div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {turf.sports.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0B3D2E]/8 text-[#0B3D2E] border border-[#0B3D2E]/15"
                  >
                    {SPORTS_CONFIG[s].emoji} {SPORTS_CONFIG[s].label}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-[#1F2937] mb-2">
                {turf.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B7280]">
                {turf.rating !== null && turf.rating !== undefined && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 star-filled" />
                    <span className="font-semibold text-[#1F2937]">{turf.rating.toFixed(1)}</span>
                    {turf.total_reviews > 0 && (
                      <span>({turf.total_reviews} reviews)</span>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[#0B3D2E]" />
                  {turf.city}, {turf.state}
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  icon: Clock,
                  label: "Hours",
                  val: `${formatTime(turf.operating_hours_start)} – ${formatTime(turf.operating_hours_end)}`,
                  accent: false,
                },
                {
                  icon: Users,
                  label: "Reviews",
                  val: String(turf.total_reviews || 0),
                  accent: false,
                },
                {
                  icon: CheckCircle2,
                  label: "Status",
                  val: turf.is_active ? "Open" : "Closed",
                  accent: turf.is_active,
                },
              ].map(({ icon: Icon, label, val, accent }) => (
                <div key={label} className="p-4 rounded-2xl border-2 border-gray-100 bg-white text-center hover:border-[#0B3D2E]/15 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF7F0] flex items-center justify-center mx-auto mb-2">
                    <Icon className={cn("h-4 w-4", accent ? "text-[#0B3D2E]" : "text-[#9CA3AF]")} />
                  </div>
                  <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider mb-1">{label}</p>
                  <p className={cn("text-xs font-bold truncate", accent ? "text-[#0B3D2E]" : "text-[#1F2937]")}>
                    {val}
                  </p>
                </div>
              ))}
            </div>

            {/* Description */}
            {turf.description && (
              <div className="bg-white rounded-2xl border-2 border-gray-100 p-5">
                <h3 className="font-display font-bold text-[#1F2937] mb-3">About</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{turf.description}</p>
              </div>
            )}

            {/* Amenities */}
            {turf.amenities?.length > 0 && (
              <div>
                <h3 className="font-display font-bold text-[#1F2937] mb-4">Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {turf.amenities.map((a) => {
                    const Icon = AMENITY_ICONS[a] || CheckCircle2;
                    return (
                      <div
                        key={a}
                        className="flex items-center gap-2 p-3 rounded-xl border border-gray-100 bg-white text-sm text-[#6B7280]"
                      >
                        <Icon className="h-4 w-4 text-[#0B3D2E] shrink-0" />
                        {a}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Location */}
            <div>
              <h3 className="font-display font-bold text-[#1F2937] mb-3">Location</h3>
              <div className="flex items-start gap-2 text-sm text-[#6B7280] mb-4">
                <MapPin className="h-4 w-4 text-[#0B3D2E] shrink-0 mt-0.5" />
                {turf.address}, {turf.city}, {turf.state}
              </div>
              {turf.latitude && turf.longitude && (
                <TurfMap
                  selectedTurf={turf}
                  center={[turf.latitude, turf.longitude]}
                  zoom={15}
                  className="h-60 rounded-2xl"
                />
              )}
            </div>

            {/* Photo strip */}
            {imgs.length > 1 && (
              <div>
                <h3 className="font-display font-bold text-[#1F2937] mb-3">Photos</h3>
                <div className="grid grid-cols-3 gap-2">
                  {imgs.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      aria-label={`View photo ${i + 1}`}
                      className={cn(
                        "relative h-20 rounded-xl overflow-hidden border-2 transition-all",
                        activeImg === i
                          ? "border-[#0B3D2E] ring-2 ring-[#0B3D2E]/20"
                          : "border-gray-100 opacity-70 hover:opacity-100"
                      )}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — desktop booking widget */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-white rounded-2xl border-2 border-gray-100 p-6 space-y-5 shadow-sm">
              <div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-display font-extrabold text-[#1F2937]">
                    {formatPrice(turf.price_per_hour)}
                  </span>
                  <span className="text-[#9CA3AF] text-sm">/ hour</span>
                </div>
                {turf.rating !== null && turf.rating !== undefined && (
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-3.5 w-3.5 star-filled" />
                    <span className="font-semibold text-[#1F2937]">{turf.rating.toFixed(1)}</span>
                    {turf.total_reviews > 0 && (
                      <span className="text-[#9CA3AF]">· {turf.total_reviews} reviews</span>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2.5 text-sm text-[#6B7280] bg-[#FAF7F0] rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-[#0B3D2E] shrink-0" />
                  {formatTime(turf.operating_hours_start)} – {formatTime(turf.operating_hours_end)}
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#0B3D2E] shrink-0" />
                  Instant confirmation
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#0B3D2E] shrink-0" />
                  Secure payment · Free cancellation
                </div>
              </div>

              <Button
                className="w-full rounded-xl bg-[#0B3D2E] text-white"
                disabled={!turf.is_active}
                onClick={() => user ? setBookingOpen(true) : router.push("/login")}
              >
                {turf.is_active ? "Book Now" : "Not Available"}
              </Button>
              {!user && turf.is_active && (
                <p className="text-xs text-[#9CA3AF] text-center">
                  <Link href="/login" className="text-[#0B3D2E] font-semibold hover:underline">
                    Sign in
                  </Link>{" "}
                  to book this turf
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom booking bar */}
      <div className="lg:hidden fixed bottom-14 inset-x-0 z-40 bg-white/97 border-t border-gray-100 px-4 py-3 supports-[backdrop-filter]:backdrop-blur-md">
        <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
          <div>
            <span className="text-lg font-display font-extrabold text-[#1F2937]">
              {formatPrice(turf.price_per_hour)}
            </span>
            <span className="text-[#9CA3AF] text-xs ml-1">/ hr</span>
          </div>
          <Button
            className="flex-1 max-w-xs rounded-xl bg-[#0B3D2E] text-white"
            disabled={!turf.is_active}
            onClick={() => user ? setBookingOpen(true) : router.push("/login")}
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
