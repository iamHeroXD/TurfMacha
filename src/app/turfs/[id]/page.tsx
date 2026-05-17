"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Clock, ChevronLeft, Heart, ChevronRight, CheckCircle2, Car, Wifi, Droplets, Zap, Coffee, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/booking/BookingModal";
import { Turf } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { formatPrice, formatTime, SPORTS_CONFIG } from "@/lib/utils";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const TurfMap = dynamic(() => import("@/components/map/TurfMap").then(m => ({ default: m.TurfMap })), {
  ssr: false,
  loading: () => <div className="h-60 rounded-xl bg-white/[0.04] animate-pulse" />,
});

const AMENITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Parking: Car, Wifi, Showers: Droplets, Floodlights: Zap, Cafeteria: Coffee, "First Aid": ShieldCheck,
};

export default function TurfDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user } = useAuthStore();
  const [turf, setTurf] = useState<Turf | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      const sb = createClient();
      const { data } = await sb.from("turfs").select("*").eq("id", id).single();
      setTurf(data as Turf);
      if (user) {
        const { data: fav } = await sb.from("favorites").select("id").eq("user_id", user.id).eq("turf_id", id).single();
        setIsFav(!!fav);
      }
      setLoading(false);
    })();
  }, [id, user]);

  const toggleFav = async () => {
    if (!user) { router.push("/login"); return; }
    const sb = createClient();
    if (isFav) await sb.from("favorites").delete().eq("user_id", user.id).eq("turf_id", id);
    else await sb.from("favorites").insert({ user_id: user.id, turf_id: id });
    setIsFav(!isFav);
  };

  const handleShare = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  if (loading) return (
    <div className="min-h-screen pt-14">
      <div className="h-56 md:h-80 bg-white/[0.04] animate-pulse" />
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <div className="h-6 bg-white/[0.06] rounded animate-pulse w-2/3" />
        <div className="h-4 bg-white/[0.04] rounded animate-pulse w-1/2" />
        <div className="grid grid-cols-3 gap-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-white/[0.04] rounded-xl animate-pulse" />)}</div>
      </div>
    </div>
  );

  if (!turf) return (
    <div className="min-h-screen pt-14 flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl mb-4">🏟️</p>
        <p className="text-white font-semibold mb-2">Turf not found</p>
        <Link href="/turfs"><Button variant="outline" size="sm">Browse Turfs</Button></Link>
      </div>
    </div>
  );

  const imgs = turf.images?.length ? turf.images : [
    `https://picsum.photos/seed/${turf.id}a/1200/600`,
    `https://picsum.photos/seed/${turf.id}b/1200/600`,
    `https://picsum.photos/seed/${turf.id}c/1200/600`,
  ];

  return (
    <div className="min-h-screen pt-14">
      {/* Image gallery */}
      <div className="relative h-52 md:h-80 bg-[#0e0e0e] overflow-hidden">
        <Image src={imgs[activeImg]} alt={turf.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

        <button onClick={() => router.back()} className="absolute top-4 left-4 p-1.5 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={toggleFav}
            className={cn("p-1.5 rounded-lg transition-colors", isFav ? "bg-red-500/20 text-red-400" : "bg-black/50 text-white hover:bg-black/70")}
          >
            <Heart className={cn("h-4 w-4", isFav && "fill-red-400")} />
          </button>
          <div className="relative">
            <button onClick={handleShare} className="p-1.5 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors">
              <ChevronRight className="h-4 w-4 rotate-45" />
            </button>
            {copied && <div className="absolute right-0 top-9 text-xs bg-[#222] text-white px-2 py-1 rounded-lg whitespace-nowrap border border-white/10">Copied!</div>}
          </div>
        </div>

        {imgs.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {imgs.map((_, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={cn("rounded-full transition-all", i === activeImg ? "bg-white w-5 h-1.5" : "bg-white/40 w-1.5 h-1.5")} />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left */}
          <div className="lg:col-span-2 space-y-8">

            {/* Header */}
            <div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {turf.sports.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-white/[0.06] text-white/70 border border-white/[0.07]">
                    {SPORTS_CONFIG[s].emoji} {SPORTS_CONFIG[s].label}
                  </span>
                ))}
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-white mb-2">{turf.name}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/50">
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 star-filled" />
                  <span className="text-white font-medium">{turf.rating?.toFixed(1) ?? "New"}</span>
                  {turf.total_reviews > 0 && <span>({turf.total_reviews})</span>}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {turf.city}, {turf.state}
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Clock,        label: "Hours",   val: `${formatTime(turf.operating_hours_start)} – ${formatTime(turf.operating_hours_end)}` },
                { icon: Users,        label: "Reviews", val: turf.total_reviews || 0 },
                { icon: CheckCircle2, label: "Status",  val: turf.is_active ? "Open" : "Closed", accent: turf.is_active },
              ].map(({ icon: Icon, label, val, accent }) => (
                <div key={label} className="p-4 rounded-xl border border-white/[0.07] bg-[#111111] text-center">
                  <Icon className="h-4 w-4 text-white/40 mx-auto mb-2" />
                  <p className="text-[10px] text-white/35 uppercase tracking-wider mb-1">{label}</p>
                  <p className={cn("text-xs font-semibold", accent ? "text-emerald-400" : "text-white")}>{val}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {turf.description && (
              <div>
                <h3 className="font-semibold text-white mb-3 text-sm">About</h3>
                <p className="text-sm text-white/50 leading-relaxed">{turf.description}</p>
              </div>
            )}

            {/* Amenities */}
            {turf.amenities?.length > 0 && (
              <div>
                <h3 className="font-semibold text-white mb-3 text-sm">Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {turf.amenities.map((a) => {
                    const Icon = AMENITY_ICONS[a] || CheckCircle2;
                    return (
                      <div key={a} className="flex items-center gap-2 p-3 rounded-lg border border-white/[0.07] bg-[#111111] text-sm text-white/60">
                        <Icon className="h-3.5 w-3.5 text-emerald-400 shrink-0" />{a}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Location */}
            <div>
              <h3 className="font-semibold text-white mb-3 text-sm">Location</h3>
              <div className="flex items-start gap-2 text-sm text-white/50 mb-4">
                <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                {turf.address}, {turf.city}, {turf.state}
              </div>
              {turf.latitude && turf.longitude && (
                <TurfMap selectedTurf={turf} center={[turf.latitude, turf.longitude]} zoom={15} className="h-60" />
              )}
            </div>

            {/* Photo strip */}
            {imgs.length > 1 && (
              <div>
                <h3 className="font-semibold text-white mb-3 text-sm">Photos</h3>
                <div className="grid grid-cols-3 gap-2">
                  {imgs.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={cn("relative h-20 rounded-lg overflow-hidden border-2 transition-all", activeImg === i ? "border-emerald-500" : "border-transparent opacity-60 hover:opacity-90")}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24 p-5 rounded-xl border border-white/[0.07] bg-[#111111] space-y-4">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">{formatPrice(turf.price_per_hour)}</span>
                <span className="text-white/40 text-sm">/ hour</span>
              </div>
              <div className="space-y-2 text-sm text-white/50">
                <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 shrink-0" />{formatTime(turf.operating_hours_start)} – {formatTime(turf.operating_hours_end)}</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />Instant confirmation</div>
                <div className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />Secure payment</div>
              </div>
              <Button
                className="w-full"
                disabled={!turf.is_active}
                onClick={() => user ? setBookingOpen(true) : router.push("/login")}
              >
                {turf.is_active ? "Book Now" : "Not Available"}
              </Button>
              {!user && turf.is_active && (
                <p className="text-xs text-white/30 text-center">
                  <Link href="/login" className="text-emerald-400 hover:underline">Sign in</Link> to book
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="lg:hidden fixed bottom-14 inset-x-0 z-40 bg-[#0e0e0e] border-t border-white/[0.07] px-4 py-3">
        <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
          <div>
            <span className="text-lg font-bold text-white">{formatPrice(turf.price_per_hour)}</span>
            <span className="text-white/40 text-xs ml-1">/ hr</span>
          </div>
          <Button
            className="flex-1 max-w-xs"
            disabled={!turf.is_active}
            onClick={() => user ? setBookingOpen(true) : router.push("/login")}
          >
            {turf.is_active ? "Book Now" : "Not Available"}
          </Button>
        </div>
      </div>

      {bookingOpen && <BookingModal turf={turf} open={bookingOpen} onClose={() => setBookingOpen(false)} />}
    </div>
  );
}
