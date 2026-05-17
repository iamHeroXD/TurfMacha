"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Star, Zap, Shield, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TurfCard } from "@/components/turf/TurfCard";
import { TurfGridSkeleton } from "@/components/turf/TurfCardSkeleton";
import { SportFilter } from "@/components/turf/SportFilter";
import { SearchBar } from "@/components/turf/SearchBar";
import { useTurfs } from "@/hooks/useTurfs";
import { useLocationStore } from "@/store/useLocationStore";
import { useFilterStore } from "@/store/useFilterStore";

const SPORTS = [
  { emoji: "⚽", label: "Football", sport: "football" },
  { emoji: "🏏", label: "Cricket",  sport: "cricket"  },
  { emoji: "🏸", label: "Badminton",sport: "badminton"},
  { emoji: "🏀", label: "Basketball",sport:"basketball"},
  { emoji: "🏐", label: "Volleyball",sport:"volleyball"},
  { emoji: "🎾", label: "Tennis",   sport: "tennis"   },
];

const FEATURES = [
  { icon: Zap,    title: "Instant Booking", desc: "Reserve a slot in seconds."        },
  { icon: Shield, title: "Verified Venues", desc: "Every turf is quality-checked."    },
  { icon: Clock,  title: "Open 24/7",       desc: "Book any time, any day."           },
  { icon: Star,   title: "Top Rated",       desc: "Reviewed by real players."         },
];

const STEPS = [
  { n: "1", title: "Search",  desc: "Find turfs by sport or location." },
  { n: "2", title: "Pick",    desc: "Choose a date and time slot."     },
  { n: "3", title: "Play",    desc: "Show up and enjoy the game."      },
];

const STATS = [
  { value: "500+", label: "Turfs" },
  { value: "50K+", label: "Bookings" },
  { value: "4.8",  label: "Avg rating" },
  { value: "20+",  label: "Cities" },
];

export default function HomePage() {
  const { latitude, longitude } = useLocationStore();
  const { sport, setSport } = useFilterStore();

  const { turfs: nearby, loading: nearbyLoading } = useTurfs({
    userLat: latitude, userLon: longitude, limit: 6,
  });

  const { turfs: popular, loading: popularLoading } = useTurfs({
    sport, userLat: latitude, userLon: longitude, limit: 6,
  });

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section className="pt-28 pb-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-medium text-emerald-400 uppercase tracking-widest mb-4">
            Sports Turf Booking
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight">
            Find &amp; book your<br />perfect turf
          </h1>
          <p className="mt-5 text-white/50 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Football, cricket, badminton and more — available near you, bookable in seconds.
          </p>

          <div className="mt-8 max-w-xl mx-auto">
            <SearchBar placeholder="Search by turf name, city or sport…" />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <Link href="/turfs">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                Explore Turfs <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/signup?role=owner">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                List Your Turf
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-10 border-t border-white/[0.06]">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sports ── */}
      <section className="py-16 px-4 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-semibold text-white">Browse by Sport</h2>
              <p className="text-sm text-white/40 mt-0.5">Pick a sport to filter venues</p>
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {SPORTS.map((s) => (
              <Link
                key={s.sport}
                href={`/turfs?sport=${s.sport}`}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/[0.07] bg-[#111111] hover:border-white/[0.14] hover:bg-[#161616] transition-colors group"
              >
                <span className="text-2xl">{s.emoji}</span>
                <span className="text-xs font-medium text-white/70 group-hover:text-white transition-colors">{s.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-16 px-4 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-lg font-semibold text-white mb-8">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STEPS.map((s) => (
              <div key={s.n} className="p-5 rounded-xl border border-white/[0.07] bg-[#111111]">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                  <span className="text-emerald-400 font-bold text-sm">{s.n}</span>
                </div>
                <h3 className="font-semibold text-white mb-1.5">{s.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Nearby Turfs ── */}
      {(latitude || nearby.length > 0) && (
        <section className="py-16 px-4 border-t border-white/[0.06]">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-400" /> Nearby Turfs
                </h2>
                <p className="text-sm text-white/40 mt-0.5">Closest to your location</p>
              </div>
              <Link href="/turfs" className="flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors">
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            {nearbyLoading ? <TurfGridSkeleton count={3} /> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {nearby.slice(0, 3).map((t, i) => <TurfCard key={t.id} turf={t} index={i} />)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Popular Turfs ── */}
      <section className="py-16 px-4 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Popular Turfs</h2>
              <p className="text-sm text-white/40 mt-0.5">Top-rated near you</p>
            </div>
            <Link href="/turfs" className="flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mb-6">
            <SportFilter selected={sport} onSelect={setSport} />
          </div>
          {popularLoading ? <TurfGridSkeleton /> : popular.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-white/40 text-sm">No turfs found — try a different sport</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popular.map((t, i) => <TurfCard key={t.id} turf={t} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-16 px-4 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-lg font-semibold text-white mb-8">Why TurfBook?</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 rounded-xl border border-white/[0.07] bg-[#111111]">
                <Icon className="h-5 w-5 text-emerald-400 mb-3" />
                <h3 className="font-semibold text-white text-sm mb-1">{title}</h3>
                <p className="text-xs text-white/45 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Owner CTA ── */}
      <section className="py-16 px-4 pb-28 md:pb-16 border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Own a sports turf?</h2>
          <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-md mx-auto">
            List your venue and start receiving bookings from thousands of players nearby. Free to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup?role=owner">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                List Your Turf <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/turfs">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Explore as Player
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
