"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight, MapPin, Zap, Shield, Clock, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TurfCard } from "@/components/turf/TurfCard";
import { TurfGridSkeleton } from "@/components/turf/TurfCardSkeleton";
import { SportFilter } from "@/components/turf/SportFilter";
import { SearchBar } from "@/components/turf/SearchBar";
import { useTurfs } from "@/hooks/useTurfs";
import { useLocationStore } from "@/store/useLocationStore";
import { useFilterStore } from "@/store/useFilterStore";

const SPORTS = [
  { emoji: "⚽", label: "Football",   sport: "football"   },
  { emoji: "🏏", label: "Cricket",    sport: "cricket"    },
  { emoji: "🏸", label: "Badminton",  sport: "badminton"  },
  { emoji: "🏀", label: "Basketball", sport: "basketball" },
  { emoji: "🏐", label: "Volleyball", sport: "volleyball" },
  { emoji: "🎾", label: "Tennis",     sport: "tennis"     },
];

const FEATURES = [
  { icon: Zap,    title: "Instant Booking", desc: "Reserve your slot in seconds. No calls, no waiting." },
  { icon: Shield, title: "Verified Venues", desc: "Every turf is quality-checked by our team."          },
  { icon: Clock,  title: "Always Open",     desc: "Book any time — morning, evening, or midnight."      },
  { icon: Star,   title: "Top Rated",       desc: "Reviewed by real players, not algorithms."           },
];

const STEPS = [
  { n: "01", title: "Search",  desc: "Find turfs by sport, city, or your current location." },
  { n: "02", title: "Pick",    desc: "Choose a date and an available time slot."            },
  { n: "03", title: "Play",    desc: "Book instantly and show up ready to play."            },
];

const STATS = [
  { value: "500+", label: "Turfs listed"   },
  { value: "50K+", label: "Bookings made"  },
  { value: "4.8★", label: "Average rating" },
  { value: "20+",  label: "Cities covered" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" } as const,
  transition: { duration: 0.4, delay },
});

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.07 } } },
  item: {
    hidden: { opacity: 0, y: 14 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.32 } },
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
    <div className="min-h-screen bg-[#F4F1EB]">

      {/* ── Hero ── */}
      <section className="pt-28 pb-24 px-4">
        <div className="max-w-2xl mx-auto text-center">

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#0D4D36] uppercase tracking-[0.18em] mb-6 px-3 py-1.5 rounded-full bg-[#0D4D36]/8 border border-[#0D4D36]/15"
          >
            Sports Turf Booking · Kerala &amp; Beyond
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="text-[2.75rem] sm:text-5xl md:text-[3.5rem] font-bold text-[#111111] leading-[1.08] tracking-tight"
          >
            Find &amp; book your<br />
            <span className="text-[#0D4D36]">perfect turf</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-5 text-[#5F5F5F] text-base md:text-lg max-w-lg mx-auto leading-relaxed"
          >
            Football, cricket, badminton &amp; more — bookable in seconds, near you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.38 }}
            className="mt-8 max-w-xl mx-auto"
          >
            <SearchBar placeholder="Search by turf, city, or sport…" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.46 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-5"
          >
            <Link href="/turfs" className="w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" className="gap-2 w-full rounded-2xl">
                  Explore Turfs <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </Link>
            <Link href="/signup?role=owner" className="w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Button variant="outline" size="lg" className="w-full rounded-2xl border-2 border-[#E7E2DA] hover:border-[#C4BAB0]">
                  List Your Turf
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-8 mt-14 pt-12 border-t border-[#E7E2DA]"
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.62 + i * 0.07, duration: 0.3 }}
                className="text-center"
              >
                <div className="text-2xl font-bold text-[#111111] tabular-nums">{s.value}</div>
                <div className="text-xs text-[#9E9284] mt-0.5 font-medium">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Browse by Sport ── */}
      <section className="py-20 px-4 bg-white border-y border-[#E7E2DA]">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="mb-10">
            <h2 className="text-2xl font-bold text-[#111111]">Browse by Sport</h2>
            <p className="text-[#5F5F5F] mt-1.5">Filter venues by your favourite game</p>
          </motion.div>
          <motion.div
            variants={stagger.container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-3 sm:grid-cols-6 gap-3"
          >
            {SPORTS.map((s) => (
              <motion.div key={s.sport} variants={stagger.item}>
                <Link
                  href={`/turfs?sport=${s.sport}`}
                  className="flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 border-[#E7E2DA] bg-[#F4F1EB] hover:border-[#0D4D36]/30 hover:bg-white transition-all duration-200 group"
                >
                  <motion.span
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    className="text-2xl"
                  >
                    {s.emoji}
                  </motion.span>
                  <span className="text-xs font-semibold text-[#5F5F5F] group-hover:text-[#0D4D36] transition-colors duration-150">
                    {s.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="mb-12">
            <h2 className="text-2xl font-bold text-[#111111]">How it works</h2>
            <p className="text-[#5F5F5F] mt-1.5">Booked in 3 simple steps</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STEPS.map((s, i) => (
              <motion.div key={s.n} {...fadeUp(i * 0.1)}>
                <div className="p-6 rounded-2xl border-2 border-[#E7E2DA] bg-white hover:border-[#C4BAB0] hover:shadow-md hover:shadow-black/5 transition-all duration-200">
                  <div className="w-10 h-10 rounded-2xl bg-[#0D4D36] flex items-center justify-center mb-5 shadow-sm">
                    <span className="text-white font-bold text-sm">{s.n}</span>
                  </div>
                  <h3 className="font-bold text-[#111111] text-base mb-2">{s.title}</h3>
                  <p className="text-sm text-[#5F5F5F] leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Nearby Turfs ── */}
      {mounted && (latitude || nearby.length > 0) && (
        <section className="py-20 px-4 bg-white border-y border-[#E7E2DA]">
          <div className="max-w-5xl mx-auto">
            <motion.div {...fadeUp()} className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-bold text-[#111111] flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#0D4D36]" /> Nearby Turfs
                </h2>
                <p className="text-[#5F5F5F] mt-1">Closest to your location</p>
              </div>
              <Link
                href="/turfs"
                className="flex items-center gap-1 text-sm font-semibold text-[#0D4D36] hover:text-[#0A3D2B] transition-colors"
              >
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
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#111111]">Popular Turfs</h2>
              <p className="text-[#5F5F5F] mt-1">Top-rated near you</p>
            </div>
            <Link
              href="/turfs"
              className="flex items-center gap-1 text-sm font-semibold text-[#0D4D36] hover:text-[#0A3D2B] transition-colors"
            >
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
              <p className="text-[#5F5F5F]">No turfs found — try a different sport</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {popular.map((t, i) => <TurfCard key={t.id} turf={t} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-4 bg-white border-y border-[#E7E2DA]">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="mb-12">
            <h2 className="text-2xl font-bold text-[#111111]">Why TurfMacha?</h2>
            <p className="text-[#5F5F5F] mt-1.5">Built for players, by sports enthusiasts</p>
          </motion.div>
          <motion.div
            variants={stagger.container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} variants={stagger.item}>
                <div className="p-5 rounded-2xl border-2 border-[#E7E2DA] bg-[#F4F1EB] h-full hover:border-[#C4BAB0] hover:bg-white transition-all duration-200 hover:shadow-md hover:shadow-black/5">
                  <div className="w-9 h-9 rounded-xl bg-[#0D4D36]/10 flex items-center justify-center mb-4">
                    <Icon className="h-4 w-4 text-[#0D4D36]" />
                  </div>
                  <h3 className="font-bold text-[#111111] text-sm mb-1.5">{title}</h3>
                  <p className="text-xs text-[#5F5F5F] leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Owner CTA ── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            {...fadeUp()}
            className="relative overflow-hidden rounded-3xl bg-[#0D4D36] p-8 md:p-12 text-center"
          >
            {/* Decorative circles */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />

            <div className="relative z-10">
              <p className="text-[#A6D96A] text-sm font-bold uppercase tracking-widest mb-4">For Turf Owners</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                List your turf on TurfMacha
              </h2>
              <p className="text-white/65 text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed">
                Reach thousands of players in your city. Manage bookings, track revenue, and grow your business — all in one place.
              </p>
              <Link href="/signup?role=owner">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
                  <Button
                    size="lg"
                    className="rounded-2xl bg-[#A6D96A] text-[#0D4D36] font-bold hover:bg-[#B8E088] shadow-lg"
                  >
                    Get started free <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
