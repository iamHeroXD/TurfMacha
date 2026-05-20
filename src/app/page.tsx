"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  ArrowRight, CheckCircle2, Star, MapPin, ChevronRight,
  Map, Zap, CalendarCheck, ShieldCheck, Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TurfCard } from "@/components/turf/TurfCard";
import { TurfGridSkeleton } from "@/components/turf/TurfCardSkeleton";
import { SportFilter } from "@/components/turf/SportFilter";
import { SearchBar } from "@/components/turf/SearchBar";
import { PhoneMockup } from "@/components/home/PhoneMockup";
import { useTurfs } from "@/hooks/useTurfs";
import { useLocationStore } from "@/store/useLocationStore";
import { useFilterStore } from "@/store/useFilterStore";

/* ── Animation helpers ── */

const EASE = [0.16, 1, 0.3, 1] as const;

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Data ── */

const FEATURES = [
  {
    icon: Map,
    title: "Find Turfs Near You",
    desc: "Discover the best football and cricket turfs in your city with real-time availability and distance tracking.",
  },
  {
    icon: Zap,
    title: "Instant Booking",
    desc: "No more calling owners. Pick your slot, pay securely online, and get instant confirmation.",
  },
  {
    icon: CalendarCheck,
    title: "Manage Matches",
    desc: "Split payments with your squad, send invites, and keep track of all your upcoming games in one place.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Grounds",
    desc: "Every turf on TurfMacha is physically verified for quality, lighting, and amenities before listing.",
  },
];

const STEPS = [
  { icon: "🔍", n: 1, title: "Find a Turf",  desc: "Browse verified turfs in Trivandrum. Filter by location, price, and sport." },
  { icon: "📅", n: 2, title: "Pick a Slot",  desc: "Check real-time availability. Select your date and time — no calls needed." },
  { icon: "💳", n: 3, title: "Book & Pay",   desc: "Pay securely via UPI or card. Split the cost with your teammates instantly." },
  { icon: "⚽", n: 4, title: "Play",         desc: "Show up, show your confirmation, and start playing. Simple as that." },
];

const STATS = [
  { value: "500+", label: "Turfs listed"   },
  { value: "50K+", label: "Bookings made"  },
  { value: "4.8★", label: "Average rating" },
  { value: "24/7", label: "Online booking" },
];

const TESTIMONIALS = [
  {
    name: "Arjun Nair",
    role: "Football Captain · Technopark FC",
    avatar: "https://i.pravatar.cc/100?img=11",
    text: "We used to waste an hour every Friday calling 4-5 owners just to find a free slot. TurfMacha solved that completely. We book in 2 minutes now.",
    rating: 5,
  },
  {
    name: "Meera Pillai",
    role: "Badminton Player · Kowdiar",
    avatar: "https://i.pravatar.cc/100?img=47",
    text: "The instant confirmation is a game-changer. No more waiting for the owner to call back. And the turfs are exactly as described — no surprises.",
    rating: 5,
  },
  {
    name: "Rahul Dev",
    role: "Turf Owner · Green Arena",
    avatar: "https://i.pravatar.cc/100?img=12",
    text: "As an owner, I was sceptical. But TurfMacha filled my 8 PM slot every day of the week. The dashboard is clean and payments are instant.",
    rating: 5,
  },
];

export default function HomePage() {
  const { latitude, longitude } = useLocationStore();
  const { sport, setSport } = useFilterStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { turfs: nearby,  loading: nearbyLoading  } = useTurfs({ userLat: latitude, userLon: longitude, limit: 6 });
  const { turfs: popular, loading: popularLoading } = useTurfs({ sport, userLat: latitude, userLon: longitude, limit: 6 });

  return (
    <div className="min-h-screen bg-[#F4F1EB]">

      {/* ─────────────────────── HERO ─────────────────────── */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute -top-[15%] -right-[8%] w-[65%] h-[65%] rounded-full bg-[#A6D96A]/12 blur-[100px]" />
          <div className="absolute top-[50%] -left-[8%] w-[45%] h-[55%] rounded-full bg-[#0D4D36]/6 blur-[80px]" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-6 items-center">

            {/* Left column */}
            <div className="max-w-xl">

              {/* Pill badge */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05, ease: EASE }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D4D36]/10 text-[#0D4D36] font-semibold text-sm mb-7 border border-[#0D4D36]/20"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#A6D96A] animate-pulse shrink-0" />
                Live in Trivandrum &nbsp;·&nbsp; Kochi coming soon
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.14, ease: EASE }}
                className="text-5xl sm:text-6xl lg:text-[4.25rem] font-display font-extrabold text-[#0D4D36] leading-[1.07] tracking-tight mb-6"
              >
                Book turf.{" "}
                <br className="hidden sm:block" />
                <span className="text-[#A6D96A]">Skip the chaos.</span>
              </motion.h1>

              {/* Sub-heading */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.25, ease: EASE }}
                className="text-lg sm:text-xl text-[#111111]/65 mb-8 leading-relaxed max-w-lg"
              >
                Your ground. Your game. One tap away. Join thousands of players
                booking their favourite turfs instantly.{" "}
                <span className="font-display font-bold text-[#0D4D36]">കളിക്കാം!</span>
              </motion.p>

              {/* Search */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.32, ease: EASE }}
                className="mb-8"
              >
                <SearchBar placeholder="Search by turf, city, or sport…" />
              </motion.div>

              {/* Trust strip */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4, ease: EASE }}
                className="flex flex-wrap items-center gap-5 mb-9"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-2">
                    {[11,12,13,14].map((i) => (
                      <Image
                        key={i}
                        src={`https://i.pravatar.cc/100?img=${i}`}
                        alt=""
                        width={32} height={32}
                        className="w-8 h-8 rounded-full border-2 border-[#F4F1EB]"
                      />
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-sm font-bold text-[#0D4D36]">4.8</span>
                    </div>
                    <p className="text-xs text-[#5F5F5F]">50,000+ bookings</p>
                  </div>
                </div>
                <div className="w-px h-8 bg-[#0D4D36]/15 hidden sm:block" />
                <div className="flex items-center gap-1.5 text-sm font-medium text-[#111111]">
                  <CheckCircle2 className="w-4 h-4 text-[#A6D96A] shrink-0" />
                  500+ Turfs Verified
                </div>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.38, delay: 0.48, ease: EASE }}
                className="flex flex-wrap items-center gap-3"
              >
                <Link href="/turfs">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      size="lg"
                      className="gap-2 rounded-full bg-[#0D4D36] text-white shadow-xl shadow-[#0D4D36]/25 hover:bg-[#0D4D36]/90 px-7"
                    >
                      Explore Turfs <ArrowRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/for-owners">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full border-2 border-[#0D4D36]/20 text-[#0D4D36] hover:border-[#0D4D36]/40 hover:bg-[#0D4D36]/5 px-7"
                    >
                      List Your Turf
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </div>

            {/* Right column — Phone + floating card */}
            <div className="relative lg:ml-auto w-full max-w-[340px] sm:max-w-[380px] mx-auto lg:mx-0 lg:ml-auto flex justify-center">
              {/* Glow behind phone */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[110%] bg-gradient-to-tr from-[#A6D96A]/18 via-[#F4F1EB]/0 to-[#0D4D36]/8 rounded-full blur-[80px] -z-10" />

              <motion.div
                initial={{ opacity: 0, y: 32, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
              >
                <PhoneMockup />
              </motion.div>

              {/* Floating "Booking Confirmed" card */}
              <motion.div
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.85, duration: 0.45, type: "spring", stiffness: 200, damping: 22 }}
                className="absolute bottom-20 -left-2 sm:-left-10 bg-white p-3.5 rounded-2xl shadow-2xl border border-[#E7E2DA] z-20"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-[#0D4D36]/10 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-[#0D4D36]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#9E9284] font-medium">Booking Confirmed</p>
                    <p className="text-xs font-bold text-[#111111]">Kazhakootam Arena · 7 PM</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating rating card */}
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 1.0, duration: 0.45, type: "spring", stiffness: 200, damping: 22 }}
                className="absolute top-16 -right-2 sm:-right-8 bg-white p-3 rounded-2xl shadow-2xl border border-[#E7E2DA] z-20"
              >
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-[#9E9284] mt-0.5">500+ verified turfs</p>
              </motion.div>
            </div>
          </div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65, ease: EASE }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 pt-10 border-t border-[#0D4D36]/10"
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.07, duration: 0.35 }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl font-display font-extrabold text-[#0D4D36] tabular-nums">{s.value}</div>
                <div className="text-xs text-[#111111]/50 mt-1 font-medium">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────── FEATURES ─────────────────────── */}
      <section className="py-24 bg-white border-y border-[#E7E2DA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#0D4D36] mb-4">
              Everything you need for the perfect game
            </h2>
            <p className="text-lg text-[#111111]/60 leading-relaxed">
              We&apos;ve built the platform Kerala sports enthusiasts deserve.
              Less time organising, more time playing.
            </p>
          </FadeUp>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <FadeUp key={title} delay={i * 0.07}>
                <div className="bg-[#F4F1EB] rounded-3xl p-7 border border-[#E7E2DA] hover:border-[#A6D96A]/60 hover:shadow-lg hover:shadow-[#0D4D36]/5 transition-all duration-300 group h-full flex flex-col">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-5 group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <Icon className="w-5 h-5 text-[#0D4D36]" />
                  </div>
                  <h3 className="text-base font-display font-bold text-[#0D4D36] mb-2">{title}</h3>
                  <p className="text-[#111111]/60 leading-relaxed text-sm flex-1">{desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── HOW IT WORKS ─────────────────────── */}
      <section className="py-24 bg-[#F4F1EB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#0D4D36] mb-4">
              From zero to kickoff — in 4 steps
            </h2>
            <p className="text-lg text-[#111111]/60">
              No calls. No confusion. Just pick, pay, and play.
            </p>
          </FadeUp>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((s, i) => (
              <FadeUp key={s.n} delay={i * 0.1}>
                <div className="flex flex-col items-center text-center group">
                  <div className="relative w-20 h-20 bg-[#0D4D36] rounded-3xl flex items-center justify-center mb-5 shadow-xl shadow-[#0D4D36]/25 transform rotate-3 group-hover:-translate-y-2 group-hover:rotate-6 transition-all duration-300">
                    <div className="absolute -top-3 -right-3 w-7 h-7 bg-[#A6D96A] rounded-full flex items-center justify-center font-display font-bold text-[#0D4D36] border-[3px] border-[#F4F1EB] text-xs">
                      {s.n}
                    </div>
                    <span className="text-2xl">{s.icon}</span>
                  </div>
                  <h3 className="text-lg font-display font-bold text-[#111111] mb-2">{s.title}</h3>
                  <p className="text-[#111111]/55 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.3} className="text-center mt-12">
            <Link href="/how-it-works">
              <Button variant="outline" className="rounded-full border-2 border-[#0D4D36]/20 text-[#0D4D36] hover:border-[#0D4D36]/40 gap-1.5 px-6">
                Full guide <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ─────────────────────── NEARBY TURFS ─────────────────────── */}
      {mounted && (latitude || nearby.length > 0) && (
        <section className="py-24 bg-white border-y border-[#E7E2DA]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeUp className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-2xl font-display font-bold text-[#111111] flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#0D4D36]" /> Turfs Near You
                </h2>
                <p className="text-[#5F5F5F] mt-1 text-sm">Closest verified grounds to your location</p>
              </div>
              <Link href="/turfs" className="flex items-center gap-1 text-sm font-semibold text-[#0D4D36] hover:text-[#0D4D36]/70 transition-colors shrink-0 ml-4">
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </FadeUp>
            {nearbyLoading ? (
              <TurfGridSkeleton count={3} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {nearby.slice(0, 3).map((t, i) => <TurfCard key={t.id} turf={t} index={i} />)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─────────────────────── POPULAR TURFS ─────────────────────── */}
      <section className="py-24 bg-[#F4F1EB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-[#111111]">Popular Turfs</h2>
              <p className="text-[#5F5F5F] mt-1 text-sm">Top-rated by players in Trivandrum</p>
            </div>
            <Link href="/turfs" className="flex items-center gap-1 text-sm font-semibold text-[#0D4D36] hover:text-[#0D4D36]/70 transition-colors shrink-0 ml-4">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </FadeUp>

          <FadeUp delay={0.06} className="mb-8">
            <SportFilter selected={mounted ? sport : undefined} onSelect={setSport} />
          </FadeUp>

          {popularLoading ? (
            <TurfGridSkeleton />
          ) : popular.length === 0 ? (
            <FadeUp className="py-20 text-center">
              <p className="text-4xl mb-4">🏟️</p>
              <p className="text-[#5F5F5F]">No turfs found — try a different sport</p>
            </FadeUp>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {popular.map((t, i) => <TurfCard key={t.id} turf={t} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────── TESTIMONIALS ─────────────────────── */}
      <section className="py-24 bg-white border-y border-[#E7E2DA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#0D4D36] mb-4">
              Players &amp; owners love it
            </h2>
            <p className="text-[#111111]/60 text-lg">
              Don&apos;t take our word for it — hear from Trivandrum&apos;s sports community.
            </p>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.1}>
                <div className="bg-[#F4F1EB] rounded-3xl p-7 border border-[#E7E2DA] hover:border-[#A6D96A]/50 hover:shadow-lg hover:shadow-[#0D4D36]/5 transition-all duration-300 h-full flex flex-col">
                  {/* Quote icon */}
                  <Quote className="w-7 h-7 text-[#A6D96A] mb-4 shrink-0" />

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-[#111111]/75 leading-relaxed text-sm flex-1 mb-6">
                    &ldquo;{t.text}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-[#E7E2DA]">
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      width={40} height={40}
                      className="w-10 h-10 rounded-full border-2 border-[#E7E2DA] object-cover shrink-0"
                    />
                    <div>
                      <p className="text-sm font-bold text-[#111111]">{t.name}</p>
                      <p className="text-xs text-[#9E9284]">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── OWNERS CTA ─────────────────────── */}
      <section className="py-24 bg-[#0D4D36] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#A6D96A]/12 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            <FadeUp>
              <p className="text-[#A6D96A] text-xs font-bold uppercase tracking-[0.18em] mb-5">For Turf Owners</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-5 leading-tight">
                Grow your turf<br />business on autopilot.
              </h2>
              <p className="text-white/60 text-base leading-relaxed mb-9 max-w-lg">
                Join Trivandrum&apos;s largest sports community. Manage bookings, increase utilisation,
                and boost revenue — all in one clean dashboard.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/for-owners">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
                    <Button
                      size="lg"
                      className="rounded-full bg-[#A6D96A] text-[#0D4D36] font-bold hover:bg-[#BEE87A] shadow-xl shadow-black/20 gap-2 px-7"
                    >
                      Become a Partner <ArrowRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/signup?role=owner">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full border-2 border-white/20 text-white hover:bg-white/8 px-7"
                  >
                    Create Account
                  </Button>
                </Link>
              </div>
            </FadeUp>

            <FadeUp delay={0.12} className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { icon: "📈", title: "More Revenue",      desc: "Fill empty slots during off-peak hours — automatically." },
                { icon: "📋", title: "Smart Scheduling",  desc: "No double bookings. No WhatsApp chaos." },
                { icon: "👥", title: "Player Insights",   desc: "Understand peak times and your most loyal players." },
                { icon: "🔒", title: "Instant Payouts",   desc: "Get paid the moment a booking is confirmed." },
              ].map((b) => (
                <div key={b.title} className="bg-white/8 rounded-2xl p-5 border border-white/10 hover:bg-white/12 transition-colors">
                  <span className="text-2xl mb-3 block">{b.icon}</span>
                  <p className="font-display font-bold text-white text-sm mb-1.5">{b.title}</p>
                  <p className="text-white/50 text-xs leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ─────────────────────── FINAL CTA ─────────────────────── */}
      <section className="py-20 bg-[#F4F1EB]">
        <FadeUp className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-[#0D4D36] mb-4 leading-tight">
            Ready to hit the ground?
          </h2>
          <p className="text-[#111111]/60 text-lg mb-8 leading-relaxed">
            10,000+ players in Trivandrum already use TurfMacha. Your game is one tap away.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" className="rounded-full bg-[#0D4D36] text-white shadow-xl shadow-[#0D4D36]/25 gap-2 px-8">
                  Create Free Account <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </Link>
            <Link href="/turfs">
              <Button variant="outline" size="lg" className="rounded-full border-2 border-[#0D4D36]/20 text-[#0D4D36] hover:border-[#0D4D36]/40 px-8">
                Browse Turfs
              </Button>
            </Link>
          </div>
        </FadeUp>
      </section>

    </div>
  );
}
