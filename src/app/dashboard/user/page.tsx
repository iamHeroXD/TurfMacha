"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar, Heart, Trophy, ChevronRight, MapPin, User,
  TrendingUp, Clock, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingCard } from "@/components/booking/BookingCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";
import { Booking } from "@/types";
import { getInitials } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const QUICK_LINKS = [
  { href: "/turfs", label: "Find Turfs", icon: MapPin, desc: "Discover nearby venues", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { href: "/dashboard/user/bookings", label: "My Bookings", icon: Calendar, desc: "View all bookings", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  { href: "/dashboard/user/favorites", label: "Favorites", icon: Heart, desc: "Saved turfs", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
  { href: "/dashboard/user/profile", label: "Profile", icon: User, desc: "Edit your info", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
];

export default function UserDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    if (user.role === "owner") { router.push("/dashboard/owner"); return; }

    const fetchData = async () => {
      const supabase = createClient();
      const [bookingsRes, favsRes] = await Promise.all([
        supabase
          .from("bookings")
          .select("*, turf:turfs(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3),
        supabase
          .from("favorites")
          .select("id", { count: "exact" })
          .eq("user_id", user.id),
      ]);
      setBookings((bookingsRes.data as Booking[]) || []);
      setFavoritesCount(favsRes.count || 0);
      setLoading(false);
    };

    fetchData();
  }, [user, router]);

  if (!user) return null;

  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;

  const STATS = [
    { icon: Calendar, label: "Total Bookings", value: bookings.length, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
    { icon: Heart, label: "Saved Turfs", value: favoritesCount, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
    { icon: Trophy, label: "Confirmed", value: confirmedBookings, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  ];

  return (
    <div className="min-h-screen pt-16 pb-28 md:pb-8">
      {/* Hero banner */}
      <div className="relative bg-gradient-to-br from-[#0a0f1a] to-[#0a0a1a] border-b border-white/8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.08),transparent_60%)]" />
        <div className="max-w-4xl mx-auto px-4 py-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-5"
          >
            <Avatar className="h-16 w-16 ring-2 ring-emerald-500/25 ring-offset-2 ring-offset-transparent shrink-0">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback className="text-xl bg-emerald-500/20 text-emerald-400">
                {getInitials(user.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-white/50 text-sm">Welcome back,</p>
              <h1 className="text-2xl font-bold text-white truncate">{user.full_name}</h1>
              <p className="text-white/40 text-xs mt-0.5">{user.email}</p>
            </div>
            <Link href="/dashboard/user/profile" className="shrink-0">
              <Button variant="outline" size="sm">Edit Profile</Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className={cn("glass-card p-4 border", stat.bg)}>
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-white/5")}>
                  <Icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <p className="text-2xl font-bold text-white">{loading ? "—" : stat.value}</p>
                <p className="text-xs text-white/45 mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href}>
                  <div className={cn(
                    "glass-card p-4 flex items-center gap-3 hover:scale-[1.02] transition-all duration-200 cursor-pointer border group",
                    link.bg
                  )}>
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                      <Icon className={cn("h-5 w-5", link.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">{link.label}</p>
                      <p className="text-xs text-white/40">{link.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Recent bookings */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-white/40" />
              Recent Bookings
            </h2>
            <Link href="/dashboard/user/bookings">
              <Button variant="ghost" size="sm" className="text-emerald-400 text-xs gap-1 hover:text-emerald-300">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
            </div>
          ) : bookings.length === 0 ? (
            <div className="glass-card p-10 text-center">
              <div className="text-5xl mb-4">📅</div>
              <p className="text-white/60 font-medium mb-1">No bookings yet</p>
              <p className="text-white/30 text-sm mb-6">Find a turf near you and make your first booking!</p>
              <Link href="/turfs">
                <Button className="gap-2">
                  Find Turfs <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </motion.div>

        {/* Explore prompt */}
        {!loading && bookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card p-6 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Ready to play again?</p>
                <p className="text-white/40 text-xs">New turfs added this week</p>
              </div>
            </div>
            <Link href="/turfs" className="shrink-0">
              <Button size="sm" className="gap-1.5">
                Explore <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
