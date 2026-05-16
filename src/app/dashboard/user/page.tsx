"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Heart, Star, ChevronRight, MapPin, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingCard } from "@/components/booking/BookingCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";
import { Booking } from "@/types";
import { getInitials } from "@/lib/utils";
import { useRouter } from "next/navigation";

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

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6 flex items-center gap-4"
        >
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar_url} />
            <AvatarFallback className="text-xl">{getInitials(user.full_name)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold text-white">Welcome, {user.full_name.split(" ")[0]}!</h1>
            <p className="text-white/50 text-sm">{user.email}</p>
          </div>
          <div className="ml-auto">
            <Link href="/dashboard/user/profile">
              <Button variant="outline" size="sm">Edit Profile</Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: Calendar, label: "Bookings", value: bookings.length, color: "text-emerald-400", bg: "bg-emerald-500/10" },
            { icon: Heart, label: "Favorites", value: favoritesCount, color: "text-red-400", bg: "bg-red-500/10" },
            { icon: Trophy, label: "Confirmed", value: confirmedBookings, color: "text-yellow-400", bg: "bg-yellow-500/10" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-4 text-center"
              >
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-white">{loading ? "-" : stat.value}</p>
                <p className="text-xs text-white/50 mt-0.5">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { href: "/turfs", label: "Find Turfs", icon: MapPin, desc: "Discover nearby venues" },
            { href: "/dashboard/user/bookings", label: "My Bookings", icon: Calendar, desc: "View all bookings" },
            { href: "/dashboard/user/favorites", label: "Favorites", icon: Heart, desc: "Saved turfs" },
            { href: "/dashboard/user/profile", label: "Profile", icon: Star, desc: "Edit your info" },
          ].map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <div className="glass-card p-4 flex items-center gap-3 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{link.label}</p>
                    <p className="text-xs text-white/40">{link.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-white/60 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Recent bookings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white">Recent Bookings</h2>
            <Link href="/dashboard/user/bookings">
              <Button variant="ghost" size="sm" className="text-emerald-400 text-xs gap-1">
                View all <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
            </div>
          ) : bookings.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <div className="text-4xl mb-3">📅</div>
              <p className="text-white/60 text-sm">No bookings yet</p>
              <Link href="/turfs">
                <Button className="mt-4" size="sm">Book a Turf</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
