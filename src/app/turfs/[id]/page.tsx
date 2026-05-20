"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star, MapPin, Clock, ChevronLeft, Heart, CheckCircle2,
  Car, Wifi, Droplets, Zap, Coffee, ShieldCheck, Users, Share2,
  MessageSquare, Send,
} from "lucide-react";
import { Review } from "@/types";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/useToast";
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
    loading: () => <div className="h-60 rounded-2xl bg-[#F4F1EB] animate-pulse" />,
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

  // Reviews state
  const [reviews,       setReviews]      = useState<(Review & { user?: { full_name: string } })[]>([]);
  const [reviewRating,  setReviewRating] = useState(5);
  const [reviewComment, setReviewComment]= useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hasBooking,    setHasBooking]   = useState(false);
  const [hasReviewed,   setHasReviewed]  = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const sb = createClient();
        const { data, error: fetchErr } = await sb
          .from("turfs").select("*").eq("id", id).single();
        if (fetchErr || !data) { setError(true); setLoading(false); return; }
        setTurf(data as Turf);

        // Fetch reviews
        const { data: revData } = await sb
          .from("reviews")
          .select("*, user:users(full_name)")
          .eq("turf_id", id)
          .order("created_at", { ascending: false })
          .limit(20);
        setReviews((revData as (Review & { user?: { full_name: string } })[]) || []);

        if (user) {
          const [favRes, bookingRes, myReviewRes] = await Promise.all([
            sb.from("favorites").select("id").eq("user_id", user.id).eq("turf_id", id).maybeSingle(),
            sb.from("bookings").select("id").eq("user_id", user.id).eq("turf_id", id).eq("status", "confirmed").limit(1),
            sb.from("reviews").select("id").eq("user_id", user.id).eq("turf_id", id).maybeSingle(),
          ]);
          setIsFav(!!favRes.data);
          setHasBooking((bookingRes.data?.length ?? 0) > 0);
          setHasReviewed(!!myReviewRes.data);
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

  const submitReview = async () => {
    if (!user || !reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      const sb = createClient();
      const { data, error: revErr } = await sb
        .from("reviews")
        .insert({ user_id: user.id, turf_id: id, rating: reviewRating, comment: reviewComment.trim() })
        .select("*, user:users(full_name)").single();
      if (revErr) throw revErr;
      setReviews((prev) => [data as (Review & { user?: { full_name: string } }), ...prev]);
      setHasReviewed(true);
      setReviewComment("");
      toast({ title: "Review submitted!", description: "Thanks for sharing your experience." });
    } catch {
      toast({ title: "Failed to submit review", variant: "destructive" });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleShare = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { /* clipboard unavailable */ }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F4F1EB] pt-14">
      <div className="h-56 md:h-80 bg-gray-200 animate-pulse" />
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <div className="h-7 bg-gray-200 rounded-xl animate-pulse w-2/3" />
        <div className="h-4 bg-[#F4F1EB] rounded-xl animate-pulse w-1/2" />
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-[#F4F1EB] rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );

  if (error || !turf) return (
    <div className="min-h-screen bg-[#F4F1EB] pt-14 flex items-center justify-center">
      <div className="text-center px-4">
        <p className="text-5xl mb-4">🏟️</p>
        <h1 className="font-display font-bold text-xl text-[#111111] mb-2">Turf not found</h1>
        <p className="text-[#5F5F5F] text-sm mb-5">
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
    <div className="min-h-screen bg-[#F4F1EB] pt-14">

      {/* Hero image gallery */}
      <div className="relative h-56 md:h-[380px] overflow-hidden bg-[#F4F1EB]">
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
          className="absolute top-4 left-4 p-2 rounded-xl bg-white/90 backdrop-blur-sm text-[#111111] hover:bg-white transition-colors shadow-sm"
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
              isFav ? "bg-red-500 text-white" : "bg-white/90 text-[#111111] hover:bg-white"
            )}
          >
            <Heart className={cn("h-4 w-4", isFav && "fill-white")} />
          </button>
          <div className="relative">
            <button
              onClick={handleShare}
              aria-label="Share turf"
              className="p-2 rounded-xl bg-white/90 backdrop-blur-sm text-[#111111] hover:bg-white transition-colors shadow-sm"
            >
              <Share2 className="h-4 w-4" />
            </button>
            {copied && (
              <div className="absolute right-0 top-10 text-xs bg-[#111111] text-white px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
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
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0D4D36]/8 text-[#0D4D36] border border-[#0D4D36]/15"
                  >
                    {SPORTS_CONFIG[s].emoji} {SPORTS_CONFIG[s].label}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-[#111111] mb-2">
                {turf.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#5F5F5F]">
                {turf.rating !== null && turf.rating !== undefined && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 star-filled" />
                    <span className="font-semibold text-[#111111]">{turf.rating.toFixed(1)}</span>
                    {turf.total_reviews > 0 && (
                      <span>({turf.total_reviews} reviews)</span>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[#0D4D36]" />
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
                <div key={label} className="p-4 rounded-2xl border-2 border-[#E7E2DA] bg-white text-center hover:border-[#0D4D36]/15 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-[#F4F1EB] flex items-center justify-center mx-auto mb-2">
                    <Icon className={cn("h-4 w-4", accent ? "text-[#0D4D36]" : "text-[#9E9284]")} />
                  </div>
                  <p className="text-[10px] text-[#9E9284] uppercase tracking-wider mb-1">{label}</p>
                  <p className={cn("text-xs font-bold truncate", accent ? "text-[#0D4D36]" : "text-[#111111]")}>
                    {val}
                  </p>
                </div>
              ))}
            </div>

            {/* Description */}
            {turf.description && (
              <div className="bg-white rounded-2xl border-2 border-[#E7E2DA] p-5">
                <h3 className="font-display font-bold text-[#111111] mb-3">About</h3>
                <p className="text-sm text-[#5F5F5F] leading-relaxed">{turf.description}</p>
              </div>
            )}

            {/* Amenities */}
            {turf.amenities?.length > 0 && (
              <div>
                <h3 className="font-display font-bold text-[#111111] mb-4">Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {turf.amenities.map((a) => {
                    const Icon = AMENITY_ICONS[a] || CheckCircle2;
                    return (
                      <div
                        key={a}
                        className="flex items-center gap-2 p-3 rounded-xl border border-[#E7E2DA] bg-white text-sm text-[#5F5F5F]"
                      >
                        <Icon className="h-4 w-4 text-[#0D4D36] shrink-0" />
                        {a}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Location */}
            <div>
              <h3 className="font-display font-bold text-[#111111] mb-3">Location</h3>
              <div className="flex items-start gap-2 text-sm text-[#5F5F5F] mb-4">
                <MapPin className="h-4 w-4 text-[#0D4D36] shrink-0 mt-0.5" />
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
                <h3 className="font-display font-bold text-[#111111] mb-3">Photos</h3>
                <div className="grid grid-cols-3 gap-2">
                  {imgs.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      aria-label={`View photo ${i + 1}`}
                      className={cn(
                        "relative h-20 rounded-xl overflow-hidden border-2 transition-all",
                        activeImg === i
                          ? "border-[#0D4D36] ring-2 ring-[#0D4D36]/20"
                          : "border-[#E7E2DA] opacity-70 hover:opacity-100"
                      )}
                    >
                      <Image src={img} alt="" fill className="object-cover" sizes="(max-width: 640px) 33vw, 200px" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-[#111111] flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-[#0D4D36]" />
                  Reviews {reviews.length > 0 && <span className="text-[#9E9284] font-normal text-sm">({reviews.length})</span>}
                </h3>
              </div>

              {/* Write review */}
              {user && hasBooking && !hasReviewed && (
                <div className="bg-[#F4F1EB] rounded-2xl border border-[#E7E2DA] p-4 mb-5">
                  <p className="text-xs font-semibold text-[#0D4D36] mb-3">Rate your experience</p>
                  {/* Star selector */}
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                        className="transition-transform hover:scale-110"
                      >
                        <Star className={cn("h-6 w-6 transition-colors", star <= reviewRating ? "fill-yellow-400 text-yellow-400" : "text-[#E7E2DA]")} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience at this turf…"
                    rows={3}
                    className="w-full bg-white border border-[#E7E2DA] rounded-xl px-4 py-3 text-sm text-[#111111] placeholder:text-[#9E9284] outline-none focus:ring-2 focus:ring-[#A6D96A]/60 focus:border-[#A6D96A] resize-none transition-all"
                  />
                  <Button
                    size="sm"
                    onClick={submitReview}
                    loading={submittingReview}
                    disabled={!reviewComment.trim()}
                    className="mt-3 gap-1.5 rounded-xl bg-[#0D4D36]"
                  >
                    <Send className="h-3.5 w-3.5" /> Submit Review
                  </Button>
                </div>
              )}

              {/* Reviews list */}
              {reviews.length === 0 ? (
                <div className="py-10 text-center rounded-2xl border border-dashed border-[#E7E2DA]">
                  <MessageSquare className="h-8 w-8 text-[#C4BAB0] mx-auto mb-2" />
                  <p className="text-sm text-[#5F5F5F]">No reviews yet</p>
                  <p className="text-xs text-[#9E9284] mt-0.5">Be the first to rate this turf</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="bg-white rounded-2xl border border-[#E7E2DA] p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback className="text-xs bg-[#0D4D36]/8 text-[#0D4D36] font-semibold">
                              {getInitials(rev.user?.full_name || "?")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold text-[#111111]">{rev.user?.full_name || "Player"}</p>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className={cn("h-3 w-3", s <= rev.rating ? "fill-yellow-400 text-yellow-400" : "text-[#E7E2DA]")} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-[#9E9284] shrink-0">
                          {new Date(rev.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <p className="text-sm text-[#5F5F5F] leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar — desktop booking widget */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-white rounded-2xl border-2 border-[#E7E2DA] p-6 space-y-5 shadow-sm">
              <div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-display font-extrabold text-[#111111]">
                    {formatPrice(turf.price_per_hour)}
                  </span>
                  <span className="text-[#9E9284] text-sm">/ hour</span>
                </div>
                {turf.rating !== null && turf.rating !== undefined && (
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-3.5 w-3.5 star-filled" />
                    <span className="font-semibold text-[#111111]">{turf.rating.toFixed(1)}</span>
                    {turf.total_reviews > 0 && (
                      <span className="text-[#9E9284]">· {turf.total_reviews} reviews</span>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2.5 text-sm text-[#5F5F5F] bg-[#F4F1EB] rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-[#0D4D36] shrink-0" />
                  {formatTime(turf.operating_hours_start)} – {formatTime(turf.operating_hours_end)}
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#0D4D36] shrink-0" />
                  Instant confirmation
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#0D4D36] shrink-0" />
                  Secure payment · Free cancellation
                </div>
              </div>

              <Button
                className="w-full rounded-xl bg-[#0D4D36] text-white"
                disabled={!turf.is_active}
                onClick={() => user ? setBookingOpen(true) : router.push("/login")}
              >
                {turf.is_active ? "Book Now" : "Not Available"}
              </Button>
              {!user && turf.is_active && (
                <p className="text-xs text-[#9E9284] text-center">
                  <Link href="/login" className="text-[#0D4D36] font-semibold hover:underline">
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
      <div className="lg:hidden fixed bottom-14 inset-x-0 z-40 bg-white/97 border-t border-[#E7E2DA] px-4 py-3 supports-[backdrop-filter]:backdrop-blur-md">
        <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
          <div>
            <span className="text-lg font-display font-extrabold text-[#111111]">
              {formatPrice(turf.price_per_hour)}
            </span>
            <span className="text-[#9E9284] text-xs ml-1">/ hr</span>
          </div>
          <Button
            className="flex-1 max-w-xs rounded-xl bg-[#0D4D36] text-white"
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