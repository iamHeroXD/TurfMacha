"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin, Star, Zap, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TurfCard } from "@/components/turf/TurfCard";
import { TurfGridSkeleton } from "@/components/turf/TurfCardSkeleton";
import { SportFilter } from "@/components/turf/SportFilter";
import { SearchBar } from "@/components/turf/SearchBar";
import { useTurfs } from "@/hooks/useTurfs";
import { useLocationStore } from "@/store/useLocationStore";
import { useFilterStore } from "@/store/useFilterStore";

const SPORTS_CATEGORIES = [
  { emoji: "⚽", label: "Football", sport: "football", bg: "from-emerald-500/20 to-green-500/20" },
  { emoji: "🏏", label: "Cricket", sport: "cricket", bg: "from-blue-500/20 to-cyan-500/20" },
  { emoji: "🏸", label: "Badminton", sport: "badminton", bg: "from-yellow-500/20 to-orange-500/20" },
  { emoji: "🏀", label: "Basketball", sport: "basketball", bg: "from-orange-500/20 to-red-500/20" },
  { emoji: "🏐", label: "Volleyball", sport: "volleyball", bg: "from-purple-500/20 to-pink-500/20" },
  { emoji: "🎾", label: "Tennis", sport: "tennis", bg: "from-lime-500/20 to-green-500/20" },
];

const FEATURES = [
  { icon: Zap, title: "Instant Booking", desc: "Book your slot in seconds", color: "text-yellow-400" },
  { icon: Shield, title: "Secure Payments", desc: "100% secure transactions", color: "text-emerald-400" },
  { icon: Clock, title: "24/7 Available", desc: "Book anytime, anywhere", color: "text-blue-400" },
  { icon: Star, title: "Verified Turfs", desc: "Quality assured venues", color: "text-purple-400" },
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-8">
              <MapPin className="h-4 w-4" />
              Find turfs near you
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight tracking-tight">
              Book Your{" "}
              <span className="gradient-text">Perfect</span>
              <br />
              Sports Turf
            </h1>

            <p className="mt-6 text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
              Discover premium sports turfs near you. Football, cricket, badminton and more.
              Instant booking. No hassle.
            </p>

            {/* Search */}
            <div className="mt-10 max-w-2xl mx-auto">
              <SearchBar placeholder="Search turfs, cities, sports..." className="text-left" />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link href="/turfs">
                <Button size="lg" className="gap-2 h-13 px-8 text-base shadow-lg shadow-emerald-500/30">
                  Explore Turfs <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/signup?role=owner">
                <Button variant="outline" size="lg" className="h-13 px-8 text-base">
                  List Your Turf
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-12 text-sm">
              {[
                { value: "500+", label: "Turfs Listed" },
                { value: "50K+", label: "Bookings Made" },
                { value: "4.8★", label: "Average Rating" },
                { value: "20+", label: "Cities" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-white/40 text-xs mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-2">
            <div className="w-1 h-3 rounded-full bg-white/40" />
          </div>
        </motion.div>
      </section>

      {/* Sport Categories */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Browse by Sport</h2>
              <p className="section-subtitle">Find courts for your favorite game</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {SPORTS_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.sport}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/turfs?sport=${cat.sport}`}
                  className={`glass-card p-4 flex flex-col items-center gap-2 text-center hover:scale-105 transition-all duration-300 cursor-pointer bg-gradient-to-br ${cat.bg} border border-white/10 hover:border-white/20`}
                >
                  <span className="text-4xl">{cat.emoji}</span>
                  <span className="text-sm font-semibold text-white">{cat.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Nearby Turfs */}
      {(latitude || nearbyTurfs.length > 0) && (
        <section className="py-8 px-4 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="section-title flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-emerald-400" />
                  Nearby Turfs
                </h2>
                <p className="section-subtitle">Turfs close to your location</p>
              </div>
              <Link href="/turfs">
                <Button variant="ghost" size="sm" className="gap-1 text-emerald-400 hover:text-emerald-300">
                  View all <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {nearbyLoading ? (
              <TurfGridSkeleton count={3} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearbyTurfs.slice(0, 3).map((turf, i) => (
                  <TurfCard key={turf.id} turf={turf} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        </section>
      )}

      {/* Popular Turfs */}
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-title flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                Popular Turfs
              </h2>
              <p className="section-subtitle">Top-rated venues in your area</p>
            </div>
            <Link href="/turfs">
              <Button variant="ghost" size="sm" className="gap-1 text-emerald-400 hover:text-emerald-300">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Sport filter */}
          <div className="mb-6">
            <SportFilter selected={sport} onSelect={setSport} />
          </div>

          {popularLoading ? (
            <TurfGridSkeleton />
          ) : popularTurfs.length === 0 ? (
            <div className="text-center py-16 text-white/40">
              <div className="text-5xl mb-4">🏟️</div>
              <p className="text-lg font-medium">No turfs found</p>
              <p className="text-sm mt-1">Try a different sport or location</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularTurfs.map((turf, i) => (
                <TurfCard key={turf.id} turf={turf} index={i} />
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white">Why TurfBook?</h2>
          <p className="text-white/50 mt-2">The smarter way to book sports venues</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <Icon className={`h-6 w-6 ${feat.color}`} />
                </div>
                <h3 className="font-semibold text-white text-sm">{feat.title}</h3>
                <p className="text-white/40 text-xs mt-1">{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass-card p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/5" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white">Own a Sports Turf?</h2>
            <p className="text-white/50 mt-3 max-w-lg mx-auto">
              List your venue on TurfBook and start getting bookings today. Join 500+ turf owners already using our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/signup?role=owner">
                <Button size="lg" className="gap-2">
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
