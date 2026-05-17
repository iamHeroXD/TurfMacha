"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2, Calendar, TrendingUp, Users, Plus, ChevronRight,
  Eye, Edit, ArrowRight, BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";
import { Turf, Booking } from "@/types";
import { formatPrice, getInitials } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function OwnerDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    if (user.role !== "owner") { router.push("/dashboard/user"); return; }

    const fetchData = async () => {
      const supabase = createClient();
      const [turfsRes, bookingsRes] = await Promise.all([
        supabase.from("turfs").select("*").eq("owner_id", user.id),
        supabase
          .from("bookings")
          .select("*, turf:turfs!inner(*), user:users(*)")
          .eq("turfs.owner_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);
      const turfList = (turfsRes.data as Turf[]) || [];
      const bookingList = (bookingsRes.data as Booking[]) || [];
      setTurfs(turfList);
      setRecentBookings(bookingList);
      setRevenue(
        bookingList.filter((b) => b.status === "confirmed").reduce((s, b) => s + b.total_price, 0)
      );
      setLoading(false);
    };

    fetchData();
  }, [user, router]);

  if (!user) return null;

  const confirmedBookings = recentBookings.filter((b) => b.status === "confirmed").length;

  const STATS = [
    { icon: Building2, label: "My Turfs", value: turfs.length, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { icon: Calendar, label: "Bookings", value: recentBookings.length, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
    { icon: TrendingUp, label: "Revenue", value: formatPrice(revenue), color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
    { icon: Users, label: "Confirmed", value: confirmedBookings, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  ];

  return (
    <div className="min-h-screen pt-16 pb-28 md:pb-8">
      {/* Banner */}
      <div className="relative bg-gradient-to-br from-[#0a0f1a] to-[#0a0a1a] border-b border-white/8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.08),transparent_60%)]" />
        <div className="max-w-5xl mx-auto px-4 py-10 relative">
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
              <div className="flex items-center gap-2 mb-1">
                <p className="text-white/50 text-sm">Owner Dashboard</p>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[11px] font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Active
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white truncate">{user.full_name}</h1>
              <p className="text-white/40 text-xs mt-0.5">{user.email}</p>
            </div>
            <Link href="/dashboard/owner/turfs/new" className="shrink-0">
              <Button size="sm" className="gap-1.5 shadow-lg shadow-emerald-500/20">
                <Plus className="h-4 w-4" /> Add Turf
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className={cn("glass-card p-5 border", stat.bg)}>
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center mb-3">
                  <Icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <p className="text-xl font-bold text-white">{loading ? "—" : stat.value}</p>
                <p className="text-xs text-white/45 mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </motion.div>

        {/* My Turfs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white flex items-center gap-2">
              <Building2 className="h-4 w-4 text-white/40" />
              My Turfs
            </h2>
            <Link href="/dashboard/owner/turfs">
              <Button variant="ghost" size="sm" className="text-emerald-400 gap-1 hover:text-emerald-300 text-xs">
                View all <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
            </div>
          ) : turfs.length === 0 ? (
            <div className="glass-card p-10 text-center">
              <Building2 className="h-12 w-12 text-white/15 mx-auto mb-3" />
              <p className="text-white/60 font-medium mb-1">No turfs listed yet</p>
              <p className="text-white/30 text-sm mb-6">Add your first turf to start receiving bookings</p>
              <Link href="/dashboard/owner/turfs/new">
                <Button className="gap-2"><Plus className="h-4 w-4" /> Add Your First Turf</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {turfs.slice(0, 3).map((turf) => (
                <div key={turf.id} className="glass-card p-4 flex items-center gap-4 hover:border-white/15 transition-all">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Building2 className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm truncate">{turf.name}</h3>
                    <p className="text-xs text-white/40 mt-0.5">{turf.city} · {formatPrice(turf.price_per_hour)}/hr</p>
                  </div>
                  <Badge variant={turf.is_active ? "success" : "secondary"} className="shrink-0">
                    {turf.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <div className="flex gap-1 shrink-0">
                    <Link href={`/turfs/${turf.id}`}>
                      <Button size="icon-sm" variant="ghost" className="text-white/40 hover:text-white">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/owner/turfs/${turf.id}/edit`}>
                      <Button size="icon-sm" variant="ghost" className="text-white/40 hover:text-emerald-400">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
              {turfs.length > 3 && (
                <Link href="/dashboard/owner/turfs">
                  <div className="glass-card p-3 text-center text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
                    View {turfs.length - 3} more turf{turfs.length - 3 !== 1 ? "s" : ""}
                  </div>
                </Link>
              )}
            </div>
          )}
        </motion.div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-white/40" />
              Recent Bookings
            </h2>
            <Link href="/dashboard/owner/bookings">
              <Button variant="ghost" size="sm" className="text-emerald-400 gap-1 hover:text-emerald-300 text-xs">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="glass-card p-10 text-center">
              <Calendar className="h-12 w-12 text-white/15 mx-auto mb-3" />
              <p className="text-white/60 font-medium mb-1">No bookings yet</p>
              <p className="text-white/30 text-sm">Bookings will appear here once players start booking your turfs</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="glass-card p-4 flex items-center gap-4 hover:border-white/15 transition-all">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="text-sm bg-white/5 text-white/60">
                      {booking.user ? getInitials(booking.user.full_name) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">
                      {booking.user?.full_name || "Unknown Player"}
                    </p>
                    <p className="text-xs text-white/40 mt-0.5">
                      {booking.turf?.name} · {format(new Date(booking.slot_date), "d MMM")} · {booking.start_time}
                    </p>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    <p className="text-emerald-400 font-bold text-sm">{formatPrice(booking.total_price)}</p>
                    <Badge
                      variant={
                        booking.status === "confirmed" ? "success"
                          : booking.status === "cancelled" ? "destructive"
                          : "warning"
                      }
                      className="text-[10px]"
                    >
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
