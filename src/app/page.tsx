"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, MapPin, Star, Zap, Shield, Clock, TrendingUp,
  CheckCircle, Users, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TurfCard } from "@/components/turf/TurfCard";
import { TurfGridSkeleton } from "@/components/turf/TurfCardSkeleton";
import { SportFilter } from "@/components/turf/SportFilter";
import { SearchBar } from "@/components/turf/SearchBar";
import { useTurfs } from "@/hooks/useTurfs";
import { useLocationStore } from "@/store/useLocationStore";
import { useFilterStore } from "@/store/useFilterStore";

const SPORTS_CATEGORIES = [
  { emoji: "⚽", label: "Football", sport: "football", color: "from-emerald-500/20 to-green-500/10 border-emerald-500/20 hover:border-emerald-500/40" },
  { emoji: "🏏", label: "Cricket", sport: "cricket", color: "from-blue-500/20 to-cyan-500/10 border-blue-500/20 hover:border-blue-500/40" },
  { emoji: "🏸", label: "Badminton", sport: "badminton", color: "from-yellow-500/20 to-orange-500/10 border-yellow-500/20 hover:border-yellow-500/40" },
  { emoji: "🏀", label: "Basketball", sport: "basketball", color: "from-orange-500/20 to-red-500/10 border-orange-500/20 hover:border-orange-500/40" },
  { emoji: "🏐", label: "Volleyball", sport: "volleyball", color: "from-purple-500/20 to-pink-500/10 border-purple-500/20 hover:border-purple-500/40" },
  { emoji: "🎾", label: "Tennis", sport: "tennis", color: "from-lime-500/20 to-green-500/10 border-lime-500/20 hover:border-lime-500/40" },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Instant Booking",
    desc: "Reserve your slot in under 30 seconds. No calls, no waiting.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
  },
  {
    icon: Shield,
    title: "Secure & Verified",
    desc: "Every turf is verified. Payments are fully protected.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Clock,
    title: "Available 24/7",
    desc: "Book anytime, anywhere — day or night.",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Star,
    title: "Top-Rated Venues",
    desc: "Only the best venues, reviewed by real players.",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
];

const STATS = [
  { value: "500+", label: "Turfs Listed" },
  { value: "50K+", label: "Bookings Made" },
  { value: "4.8★", label: "Avg Rating" },
  { value: "20+", label: "Cities" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Find a Turf", desc: "Search by sport, location, or availability near you." },
  { step: "02", title: "Pick a Slot", desc: "Choose your preferred date and time from live availability." },
  { step: "03", title: "Book & Play", desc: "Confirm your booking instantly and show up ready to play." },
];

export default function HomePage() {
  const { latitude, longitude } = useLocationStore();
  const { sport, setSport } = useFilterStore();

  const { turfs: nearbyTurfs, loading: nearbyLoading } = useTurfs({
    userLat: latitude,
    userLon: longitude,
    limit: 6,
  });

  const { turfs: popularTurfs, loading: popularLoading } = useTurfs({
    sport,
    userLat: latitude,
    userLon: longitude,
    limit: 6,
  });

  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ─── Hero ─── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-[#070714]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_80%,rgba(139,92,246,0.07),transparent)]" />

        {/* Animated blobs */}
        <div className="absolute top-24 left-8 w-80 h-80 bg-emerald-500/8 rounded-full blur-[80px] animate-float" />
        <div className="absolute bottom-24 right-8 w-96 h-96 bg-purple-500/8 rounded-full blur-[100px] animate-float" style={{ animationDelay: "1.5s" }} />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm font-medium mb-8"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live turf availability near you
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold text-white leading-[1.05] tracking-tight">
              Find &{" "}
              <span className="gradient-text">Book</span>
              <br />
              <span className="text-white/90">Your Turf</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
              Premium sports turfs for football, cricket, badminton & more.
              <br className="hidden sm:block" />
              Instant booking. No hassle. Just play.
            </p>

            {/* Search bar */}
            <div className="mt-10 max-w-2xl mx-auto">
              <SearchBar placeholder="Search turfs, cities, sports..." className="text-left" />
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <Link href="/turfs">
                <Button size="lg" className="gap-2 shadow-lg shadow-emerald-500/25 px-8">
                  Explore Turfs <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/signup?role=owner">
                <Button variant="outline" size="lg" className="px-8">
                  List Your Turf
                </Button>
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mt-14">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-white/40 text-xs mt-0.5 tracking-wide">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          <div className="w-5 h-8 rounded-full border border-white/15 flex items-start justify-center pt-1.5">
            <div className="w-0.5 h-2.5 rounded-full bg-white/30" />
          </div>
        </motion.div>
      </section>

      {/* ─── Sport Categories ─── */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="mb-10 text-center">
            <h2 className="section-title text-3xl">Browse by Sport</h2>
            <p className="section-subtitle mt-2">Find courts for your favourite game</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {SPORTS_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.sport}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              >
                <Link
                  href={`/turfs?sport=${cat.sport}`}
                  className={`flex flex-col items-center gap-3 p-5 rounded-2xl border bg-gradient-to-br ${cat.color} transition-all duration-300 hover:scale-[1.04] hover:shadow-xl hover:shadow-black/30 cursor-pointer group`}
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{cat.emoji}</span>
                  <span className="text-sm font-semibold text-white/90">{cat.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white">How It Works</h2>
          <p className="text-white/50 mt-2">Book a turf in 3 simple steps</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="hidden sm:block absolute top-8 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {HOW_IT_WORKS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card p-6 text-center relative"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-400 font-bold text-lg">{step.step}</span>
              </div>
              <h3 className="font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Nearby Turfs ─── */}
      {(latitude || nearbyTurfs.length > 0) && (
        <section className="py-10 px-4 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="section-title flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-emerald-400" />
                  Nearby Turfs
                </h2>
                <p className="section-subtitle">Sports venues closest to you</p>
              </div>
              <Link href="/turfs" className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors group">
                View all <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {nearbyLoading ? (
              <TurfGridSkeleton count={3} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {nearbyTurfs.slice(0, 3).map((turf, i) => (
                  <TurfCard key={turf.id} turf={turf} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        </section>
      )}

      {/* ─── Popular Turfs ─── */}
      <section className="py-10 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-title flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-yellow-400" />
                Popular Turfs
              </h2>
              <p className="section-subtitle">Top-rated venues in your area</p>
            </div>
            <Link href="/turfs" className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors group">
              View all <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="mb-6">
            <SportFilter selected={sport} onSelect={setSport} />
          </div>

          {popularLoading ? (
            <TurfGridSkeleton />
          ) : popularTurfs.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🏟️</div>
              <p className="text-white/60 font-medium">No turfs found</p>
              <p className="text-white/30 text-sm mt-1">Try a different sport or city</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {popularTurfs.map((turf, i) => (
                <TurfCard key={turf.id} turf={turf} index={i} />
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* ─── Features ─── */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">Why Choose TurfBook?</h2>
          <p className="text-white/50 mt-3 max-w-lg mx-auto">The smarter, faster way to book your next sports session</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 group hover:scale-[1.02] transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-2xl ${feat.bg} border flex items-center justify-center mb-4`}>
                  <Icon className={`h-6 w-6 ${feat.color}`} />
                </div>
                <h3 className="font-semibold text-white mb-2">{feat.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─── Owner CTA ─── */}
      <section className="py-20 px-4 pb-32 md:pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl border border-white/10"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-purple-500/10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08),transparent_70%)]" />

          <div className="relative z-10 p-10 md:p-16 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8 border border-white/10 text-white/60 text-sm mb-6">
              <Users className="h-4 w-4" />
              Join 500+ turf owners
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Own a Sports Turf?
            </h2>
            <p className="text-white/50 max-w-lg mx-auto leading-relaxed mb-10">
              List your venue on TurfBook and start receiving bookings today.
              Manage everything — slots, pricing, bookings — from one place.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              {["Free to list", "Real-time bookings", "Secure payments", "Analytics dashboard"].map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-sm text-white/60">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup?role=owner">
                <Button size="lg" className="gap-2 shadow-lg shadow-emerald-500/25">
                  List Your Turf <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/turfs">
                <Button variant="outline" size="lg">
                  Explore as Player
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
