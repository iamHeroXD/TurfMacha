"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
  { icon: Zap,    title: "Instant Booking", desc: "Reserve a slot in seconds. No phone calls." },
  { icon: Shield, title: "Verified Venues", desc: "Every turf is quality-checked by our team." },
  { icon: Clock,  title: "Always Open",     desc: "Book any time, any day of the week."        },
  { icon: Star,   title: "Top Rated",       desc: "Reviewed by real players, not bots."        },
];

const STEPS = [
  { n: "1", title: "Search", desc: "Find turfs by sport, city, or distance."        },
  { n: "2", title: "Pick",   desc: "Choose a date and an available time slot."      },
  { n: "3", title: "Play",   desc: "Book instantly and show up ready to play."      },
];

const STATS = [
  { value: "500+", label: "Turfs"      },
  { value: "50K+", label: "Bookings"   },
  { value: "4.8",  label: "Avg rating" },
  { value: "20+",  label: "Cities"     },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" } as const,
  transition: { duration: 0.32, delay },
});

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.07 } } },
  item: {
    hidden: { opacity: 0, y: 12 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.28 } },
  },
};

function Divider() {
  return <div className="border-t border-white/[0.06]" />;
}

export default function HomePage() {
  const { latitude, longitude } = useLocationStore();
  const { sport, setSport } = useFilterStore();

  const { turfs: nearby,  loading: nearbyLoading  } = useTurfs({ userLat: latitude, userLon: longitude, limit: 6 });
  const { turfs: popular, loading: popularLoading } = useTurfs({ sport, userLat: latitude, userLon: longitude, limit: 6 });

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="pt-28 pb-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-xs font-semibold text-brand-400 uppercase tracking-[0.15em] mb-5"
          >
            Sports Turf Booking
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="text-4xl sm:text-5xl md:text-[3.75rem] font-bold text-white leading-[1.1] tracking-tight"
          >
            Find &amp; book your<br className="hidden sm:block" /> perfect turf
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.28 }}
            className="mt-5 text-white/50 text-base md:text-[1.05rem] max-w-lg mx-auto leading-relaxed"
          >
            Football, cricket, badminton &amp; more — bookable in seconds, near you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.36 }}
            className="mt-8 max-w-xl mx-auto"
          >
            <SearchBar placeholder="Search by turf, city, or sport..." />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.44 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6"
          >
            <Link href="/turfs" className="w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" className="gap-2 w-full">
                  Explore Turfs <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </Link>
            <Link href="/signup?role=owner" className="w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Button variant="outline" size="lg" className="w-full">List Your Turf</Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.56 }}
            className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-10 border-t border-white/[0.06]"
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.58 + i * 0.07, duration: 0.28 }}
                className="text-center"
              >
                <div className="text-2xl font-bold text-white tabular-nums">{s.value}</div>
                <div className="text-xs text-white/35 mt-0.5">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* Sports */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-8">
            <h2 className="text-lg font-semibold text-white">Browse by Sport</h2>
            <p className="text-sm text-white/40 mt-0.5">Filter venues by your favourite game</p>
          </motion.div>
          <motion.div
            variants={stagger.container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-3 sm:grid-cols-6 gap-2"
          >
            {SPORTS.map((s) => (
              <motion.div key={s.sport} variants={stagger.item}>
                <Link
                  href={`/turfs?sport=${s.sport}`}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/[0.07] bg-[#111111] hover:border-white/[0.14] hover:bg-[#181818] transition-all duration-150 group"
                >
                  <motion.span whileHover={{ scale: 1.18 }} transition={{ type: "spring", stiffness: 500, damping: 22 }} className="text-2xl">
                    {s.emoji}
                  </motion.span>
                  <span className="text-xs font-medium text-white/65 group-hover:text-white transition-colors duration-150">{s.label}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* How it works */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-8">
            <h2 className="text-lg font-semibold text-white">How it works</h2>
            <p className="text-sm text-white/40 mt-0.5">Booked in 3 simple steps</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {STEPS.map((s, i) => (
              <motion.div key={s.n} {...fadeUp(i * 0.09)}>
                <div className="p-5 rounded-xl border border-white/[0.07] bg-[#111111] hover:border-white/[0.13] transition-colors duration-200">
                  <div className="w-8 h-8 rounded-lg bg-brand-400/10 border border-brand-400/20 flex items-center justify-center mb-4">
                    <span className="text-brand-400 font-bold text-sm">{s.n}</span>
                  </div>
                  <h3 className="font-semibold text-white mb-1.5">{s.title}</h3>
                  <p className="text-sm text-white/45 leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* Nearby */}
      {(latitude || nearby.length > 0) && (
        <>
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div {...fadeUp()} className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-brand-400" /> Nearby Turfs
                  </h2>
                  <p className="text-sm text-white/40 mt-0.5">Closest to your location</p>
                </div>
                <Link href="/turfs" className="flex items-center gap-1 text-sm text-white/40 hover:text-white transition-colors">
                  View all <ChevronRight className="h-4 w-4" />
                </Link>
              </motion.div>
              {nearbyLoading ? <TurfGridSkeleton count={3} /> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nearby.slice(0, 3).map((t, i) => <TurfCard key={t.id} turf={t} index={i} />)}
                </div>
              )}
            </div>
          </section>
          <Divider />
        </>
      )}

      {/* Popular */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Popular Turfs</h2>
              <p className="text-sm text-white/40 mt-0.5">Top-rated near you</p>
            </div>
            <Link href="/turfs" className="flex items-center gap-1 text-sm text-white/40 hover:text-white transition-colors">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>
          <motion.div {...fadeUp(0.06)} className="mb-6">
            <SportFilter selected={sport} onSelect={setSport} />
          </motion.div>
          {popularLoading ? <TurfGridSkeleton /> : popular.length === 0 ? (
            <motion.div {...fadeUp()} className="py-20 text-center">
              <p className="text-white/35 text-sm">No turfs found — try a different sport</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popular.map((t, i) => <TurfCard key={t.id} turf={t} index={i} />)}
            </div>
          )}
        </div>
      </section>

      <Divider />

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-8">
            <h2 className="text-lg font-semibold text-white">Why TurfMacha?</h2>
            <p className="text-sm text-white/40 mt-0.5">Built for players, by sports enthusiasts</p>
          </motion.div>
          <motion.div
            variants={stagger.container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3"
          >
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} variants={stagger.item}>
                <div className="p-5 rounded-xl border border-white/[0.07] bg-[#111111] h-full hover:border-white/[0.13] transition-colors duration-200">
                  <Icon className="h-4 w-4 text-brand-400 mb-3" />
                  <h3 className="font-semibold text-white text-sm mb-1.5">{title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* Owner CTA */}
      <section className="py-16 px-4 pb-28 md:pb-16">
        <div className="max-w-xl mx-auto text-center">
          <motion.div {...fadeUp()}>
            <h2 className="text-2xl font-bold text-white mb-3">Own a sports turf?</h2>
            <p className="text-white/45 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
              List your venue and start receiving bookings from players nearby. Free to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup?role=owner" className="w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" className="gap-2 w-full">
                    List Your Turf <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/turfs" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full">Explore as Player</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
