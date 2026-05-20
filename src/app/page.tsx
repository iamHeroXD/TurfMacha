"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ArrowRight, CheckCircle2, Star, MapPin, ChevronRight,
  Map, Zap, CalendarCheck, ShieldCheck,
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
    desc: "Every turf on TurfMacha is physically verified for quality, lighting, and amenities.",
  },
];

const STEPS = [
  { icon: "🔍", n: 1, title: "Find a Turf",  desc: "Browse verified turfs in Trivandrum. Filter by location, price, and sport." },
  { icon: "📅", n: 2, title: "Pick a Slot",  desc: "Check real-time availability. Select your date and time — no calls needed." },
  { icon: "📱", n: 3, title: "Book & Pay",   desc: "Pay securely through the app. Split the cost with your teammates instantly." },
  { icon: "⚽", n: 4, title: "Play",         desc: "Show up, show your confirmation, and start playing. Simple as that." },
];

const STATS = [
  { value: "500+", label: "Turfs listed"   },
  { value: "50K+", label: "Bookings made"  },
  { value: "4.8★", label: "Average rating" },
  { value: "20+",  label: "Cities covered" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" } as const,
  transition: { duration: 0.45, delay },
});

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.08 } } },
  item: {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.36 } },
  },
};

export default function HomePage() {
  const { latitude, longitude } = useLocationStore();
  const { sport, setSport } = useFilterStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { turfs: nearby,  loading: nearbyLoading  } = useTurfs({ userLat: latitude, userLon: longitude, limit: 6 });
  const { turfs: popular, loading: popularLoading } = useTurfs({ sport, userLat: latitude, userLon: longitude, limit: 6 });

  return (
    <div className="min-h-screen bg-[#FAF7F0]">

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-[#A3E635]/10 blur-3xl" />
          <div className="absolute top-[40%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#0B3D2E]/5 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* Left */}
            <div className="max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B3D2E]/10 text-[#0B3D2E] font-medium text-sm mb-6 border border-[#0B3D2E]/20"
              >
                <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-pulse" />
                Now live in Trivandrum · Coming soon: Kochi, Calicut
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.18 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold text-[#0B3D2E] leading-[1.08] mb-6"
              >
                Book turf. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B3D2E] to-[#166534]">
                  Skip the chaos.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="text-lg sm:text-xl text-[#1F2937]/70 mb-8 leading-relaxed max-w-lg"
              >
                Your ground. Your game. One tap away. Join thousands of players booking
                their favourite turfs instantly.{" "}
                <span className="font-display font-bold text-[#0B3D2E] ml-1">കളിക്കാം!</span>
              </motion.p>

              {/* Search */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.36 }}
                className="mb-8"
              >
                <SearchBar placeholder="Search by turf, city, or sport…" />
              </motion.div>

              {/* Trust strip */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.44 }}
                className="flex flex-wrap items-center gap-6 mb-10"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[11,12,13,14].map((i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={i}
                        src={`https://i.pravatar.cc/100?img=${i}`}
                        alt="User"
                        className="w-8 h-8 rounded-full border-2 border-[#FAF7F0]"
                      />
                    ))}
                  </div>
                  <div className="text-sm font-medium text-[#1F2937]">
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="ml-1 text-[#0B3D2E] font-bold">4.8</span>
                    </div>
                    50k+ bookings
                  </div>
                </div>
                <div className="hidden sm:block w-px h-8 bg-[#0B3D2E]/20" />
                <div className="flex items-center gap-2 text-sm font-medium text-[#1F2937]">
                  <CheckCircle2 className="w-5 h-5 text-[#A3E635]" />
                  500+ Turfs Verified
                </div>
              </motion.div>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.38, delay: 0.52 }}
                className="flex flex-wrap items-center gap-3"
              >
                <Link href="/turfs">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      size="lg"
                      className="gap-2 rounded-full bg-[#0B3D2E] text-white shadow-lg shadow-[#0B3D2E]/25 hover:bg-[#0B3D2E]/90"
                    >
                      Explore Turfs <ArrowRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/signup?role=owner">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full border-2 border-[#0B3D2E]/20 text-[#0B3D2E] hover:border-[#0B3D2E]/40 hover:bg-[#0B3D2E]/5"
                    >
                      List Your Turf
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </div>

            {/* Right — Phone mockup */}
            <div className="relative lg:ml-auto w-full max-w-md mx-auto lg:max-w-none flex justify-center">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#A3E635]/15 to-[#0B3D2E]/5 rounded-full blur-3xl -z-10" />
              <PhoneMockup />
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="absolute bottom-16 -left-4 sm:-left-12 bg-white p-3.5 rounded-2xl shadow-xl border border-gray-100"
                style={{ animation: "none" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-medium">Booking Confirmed</p>
                    <p className="text-xs font-bold text-gray-900">Kazhakootam Arena · 7 PM</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-10 mt-16 pt-12 border-t border-[#0B3D2E]/10"
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.72 + i * 0.07, duration: 0.3 }}
                className="text-center"
              >
                <div className="text-2xl font-display font-extrabold text-[#0B3D2E] tabular-nums">{s.value}</div>
                <div className="text-xs text-[#1F2937]/50 mt-0.5 font-medium">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 bg-white border-y border-[#0B3D2E]/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <motion.h2 {...fadeUp()} className="text-3xl md:text-4xl font-display font-bold text-[#0B3D2E] mb-4">
              Everything you need for the perfect game
            </motion.h2>
            <motion.p {...fadeUp(0.08)} className="text-lg text-[#1F2937]/65">
              We&apos;ve built the ultimate platform for sports enthusiasts in Kerala.
              Less time organising, more time playing.
            </motion.p>
          </div>
          <motion.div
            variants={stagger.container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} variants={stagger.item}>
                <div className="bg-[#FAF7F0]/60 rounded-3xl p-7 border border-[#0B3D2E]/6 hover:border-[#A3E635]/50 transition-colors group h-full">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-[#0B3D2E]" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-[#0B3D2E] mb-3">{title}</h3>
                  <p className="text-[#1F2937]/65 leading-relaxed text-sm">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 bg-[#FAF7F0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.h2 {...fadeUp()} className="text-3xl md:text-4xl font-display font-bold text-[#0B3D2E] mb-4">
              How TurfMacha Works
            </motion.h2>
            <motion.p {...fadeUp(0.08)} className="text-lg text-[#1F2937]/65">
              From finding a ground to kicking off — seamless, every time.
            </motion.p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((s, i) => (
              <motion.div key={s.n} {...fadeUp(i * 0.09)} className="flex flex-col items-center text-center group">
                <div className="relative w-20 h-20 bg-[#0B3D2E] rounded-3xl flex items-center justify-center mb-5 shadow-xl shadow-[#0B3D2E]/20 transform group-hover:-translate-y-2 transition-transform duration-300 rotate-3 group-hover:rotate-6">
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#A3E635] rounded-full flex items-center justify-center font-display font-bold text-[#0B3D2E] border-4 border-white text-sm">
                    {s.n}
                  </div>
                  <span className="text-2xl">{s.icon}</span>
                </div>
                <h3 className="text-xl font-display font-bold text-[#1F2937] mb-2">{s.title}</h3>
                <p className="text-[#1F2937]/60 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.div {...fadeUp(0.3)} className="text-center mt-12">
            <Link href="/how-it-works">
              <Button variant="outline" className="rounded-full border-2 border-[#0B3D2E]/20 text-[#0B3D2E] hover:border-[#0B3D2E]/40 gap-1">
                See full guide <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Nearby Turfs ── */}
      {mounted && (latitude || nearby.length > 0) && (
        <section className="py-20 bg-white border-y border-[#0B3D2E]/8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp()} className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-display font-bold text-[#1F2937] flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#0B3D2E]" /> Nearby Turfs
                </h2>
                <p className="text-[#1F2937]/55 mt-1 text-sm">Closest to your location</p>
              </div>
              <Link href="/turfs" className="flex items-center gap-1 text-sm font-semibold text-[#0B3D2E] hover:text-[#0B3D2E]/70 transition-colors">
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>
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

      {/* ── Popular Turfs ── */}
      <section className="py-20 bg-[#FAF7F0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-[#1F2937]">Popular Turfs</h2>
              <p className="text-[#1F2937]/55 mt-1 text-sm">Top-rated near you</p>
            </div>
            <Link href="/turfs" className="flex items-center gap-1 text-sm font-semibold text-[#0B3D2E] hover:text-[#0B3D2E]/70 transition-colors">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>
          <motion.div {...fadeUp(0.06)} className="mb-8">
            <SportFilter selected={mounted ? sport : undefined} onSelect={setSport} />
          </motion.div>
          {popularLoading ? (
            <TurfGridSkeleton />
          ) : popular.length === 0 ? (
            <motion.div {...fadeUp()} className="py-20 text-center">
              <p className="text-4xl mb-4">🏟️</p>
              <p className="text-[#1F2937]/55">No turfs found — try a different sport</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {popular.map((t, i) => <TurfCard key={t.id} turf={t} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── For Owners CTA ── */}
      <section className="py-20 bg-[#0B3D2E] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#A3E635]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#166534]/50 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp()}>
              <p className="text-[#A3E635] text-sm font-bold uppercase tracking-widest mb-4">For Turf Owners</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 leading-tight">
                Grow your turf business on autopilot.
              </h2>
              <p className="text-white/65 text-base leading-relaxed mb-8">
                Join Trivandrum&apos;s largest sports community. Manage bookings, increase utilisation, and boost your revenue — all in one place.
              </p>
              <Link href="/for-owners">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
                  <Button
                    size="lg"
                    className="rounded-full bg-[#A3E635] text-[#0B3D2E] font-bold hover:bg-[#B8E872] shadow-lg gap-2"
                  >
                    Become a Partner <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
            <motion.div {...fadeUp(0.1)} className="hidden lg:grid grid-cols-2 gap-3">
              {[
                { icon: "📈", title: "Increase Revenue", desc: "Fill empty slots during off-peak hours" },
                { icon: "📋", title: "Smart Scheduling", desc: "No double bookings, no WhatsApp chaos" },
                { icon: "👥", title: "Customer Insights", desc: "Understand peak times and loyal players" },
                { icon: "🔒", title: "Secure Payments",  desc: "Get paid instantly, reduce no-shows" },
              ].map((b) => (
                <div key={b.title} className="bg-white/8 rounded-2xl p-5 border border-white/10">
                  <div className="text-2xl mb-3">{b.icon}</div>
                  <p className="font-display font-bold text-white text-sm mb-1">{b.title}</p>
                  <p className="text-white/55 text-xs leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
