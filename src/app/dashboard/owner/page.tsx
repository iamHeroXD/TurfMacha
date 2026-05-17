"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2, Calendar, TrendingUp, Users, Plus, ChevronRight,
  Eye, Edit, BarChart3, Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";
import { Turf, Booking } from "@/types";
import { formatPrice, getInitials } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { format, startOfMonth, endOfMonth, subDays, eachDayOfInterval } from "date-fns";

export default function OwnerDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState(0);
  const [monthRevenue, setMonthRevenue] = useState(0);
  const [chartData, setChartData] = useState<{ day: string; revenue: number }[]>([]);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    if (user.role !== "owner") { router.push("/dashboard/user"); return; }

    (async () => {
      const sb = createClient();
      const now = new Date();
      const monthStart = format(startOfMonth(now), "yyyy-MM-dd");
      const monthEnd = format(endOfMonth(now), "yyyy-MM-dd");

      const weekStart = format(subDays(now, 6), "yyyy-MM-dd");

      const [turfsRes, bookingsRes, monthRes, weekRes] = await Promise.all([
        sb.from("turfs").select("*").eq("owner_id", user.id).order("created_at", { ascending: false }),
        sb.from("bookings")
          .select("*, turf:turfs!inner(*), user:users(*)")
          .eq("turfs.owner_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5),
        sb.from("bookings")
          .select("total_price, turfs!inner(owner_id)")
          .eq("turfs.owner_id", user.id)
          .eq("status", "confirmed")
          .gte("slot_date", monthStart)
          .lte("slot_date", monthEnd),
        sb.from("bookings")
          .select("slot_date, total_price, turfs!inner(owner_id)")
          .eq("turfs.owner_id", user.id)
          .eq("status", "confirmed")
          .gte("slot_date", weekStart)
          .lte("slot_date", format(now, "yyyy-MM-dd")),
      ]);

      const turfList = (turfsRes.data as Turf[]) || [];
      const bookingList = (bookingsRes.data as Booking[]) || [];

      setTurfs(turfList);
      setRecentBookings(bookingList);
      setRevenue(
        bookingList.filter((b) => b.status === "confirmed").reduce((s, b) => s + b.total_price, 0)
      );
      setMonthRevenue(
        (monthRes.data || []).reduce((s: number, b: { total_price: number }) => s + b.total_price, 0)
      );

      // Build 7-day chart data
      const days = eachDayOfInterval({ start: subDays(now, 6), end: now });
      const revenueByDay: Record<string, number> = {};
      (weekRes.data || []).forEach((b: { slot_date: string; total_price: number }) => {
        revenueByDay[b.slot_date] = (revenueByDay[b.slot_date] || 0) + b.total_price;
      });
      setChartData(days.map(d => ({
        day: format(d, "EEE"),
        revenue: revenueByDay[format(d, "yyyy-MM-dd")] || 0,
      })));

      setLoading(false);
    })();
  }, [user, router]);

  if (!user) return null;

  const confirmed = recentBookings.filter((b) => b.status === "confirmed").length;
  const activeTurfs = turfs.filter((t) => t.is_active).length;
  const bookingRate = recentBookings.length > 0
    ? Math.round((confirmed / recentBookings.length) * 100)
    : 0;

  const STATS = [
    { icon: Building2,  label: "Active Turfs",    value: loading ? "—" : `${activeTurfs}/${turfs.length}` },
    { icon: Calendar,   label: "Bookings (recent)",value: loading ? "—" : recentBookings.length },
    { icon: TrendingUp, label: "Month Revenue",    value: loading ? "—" : formatPrice(monthRevenue) },
    { icon: Activity,   label: "Confirm Rate",     value: loading ? "—" : `${bookingRate}%` },
  ];

  return (
    <div className="min-h-screen pt-14 pb-24 md:pb-8">
      {/* Profile banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="border-b border-white/[0.07]"
      >
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center gap-4">
          <Avatar className="h-11 w-11 shrink-0 ring-2 ring-white/[0.07]">
            <AvatarImage src={user.avatar_url} />
            <AvatarFallback className="text-sm bg-brand-400/10 text-brand-400 font-medium">
              {getInitials(user.full_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-white truncate">{user.full_name}</h1>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-brand-400/10 text-brand-400 border border-brand-400/20 shrink-0">
                Owner
              </span>
            </div>
            <p className="text-xs text-white/35 truncate mt-0.5">{user.email}</p>
          </div>
          <Link href="/dashboard/owner/turfs/new" className="shrink-0">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Add Turf
            </Button>
          </Link>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">

        {/* Analytics stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {STATS.map(({ icon: Icon, label, value }) => (
            <div key={label} className="p-4 rounded-xl border border-white/[0.07] bg-[#111111] hover:border-white/[0.13] transition-colors">
              <Icon className="h-4 w-4 text-white/30 mb-2" />
              <p className="text-lg font-bold text-white tabular-nums">{value}</p>
              <p className="text-xs text-white/40 mt-0.5">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Revenue chart (7-day) */}
        {!loading && chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="p-4 rounded-xl border border-white/[0.07] bg-[#111111]"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-medium text-white/35 uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart3 className="h-3.5 w-3.5" /> Revenue — Last 7 Days
                </p>
                {revenue > 0 && (
                  <p className="text-xs text-white/40 mt-0.5">{formatPrice(revenue)} total (recent)</p>
                )}
              </div>
              <p className="text-lg font-bold text-brand-400">{formatPrice(monthRevenue)}<span className="text-xs font-normal text-white/35 ml-1">this month</span></p>
            </div>
            <div className="flex items-end gap-1.5 h-20">
              {(() => {
                const max = Math.max(...chartData.map(d => d.revenue), 1);
                return chartData.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.2 + i * 0.06, duration: 0.4 }}
                      style={{ height: `${Math.max((d.revenue / max) * 100, 4)}%`, originY: 1 }}
                      className={`w-full rounded-t-sm ${d.revenue > 0 ? "bg-brand-400/70 hover:bg-brand-400 transition-colors" : "bg-white/[0.06]"}`}
                    />
                    <span className="text-[9px] text-white/30">{d.day}</span>
                  </div>
                ));
              })()}
            </div>
          </motion.div>
        )}

        {/* My Turfs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-white/35 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" /> My Turfs
            </p>
            <Link href="/dashboard/owner/turfs">
              <Button variant="ghost" size="sm" className="text-xs text-white/35 hover:text-white gap-1 h-7">
                All <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[...Array(2)].map((_, i) => <div key={i} className="h-16 rounded-xl skeleton" />)}
            </div>
          ) : turfs.length === 0 ? (
            <div className="py-10 text-center rounded-xl border border-white/[0.07]">
              <Building2 className="h-10 w-10 text-white/15 mx-auto mb-3" />
              <p className="text-sm text-white/50 mb-5">No turfs listed yet</p>
              <Link href="/dashboard/owner/turfs/new">
                <Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" /> Add Turf</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {turfs.slice(0, 3).map((turf) => (
                <div key={turf.id} className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.07] bg-[#111111] hover:border-white/[0.12] transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center shrink-0">
                    <Building2 className="h-4 w-4 text-white/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm truncate">{turf.name}</p>
                    <p className="text-xs text-white/35 mt-0.5">
                      {turf.city} · {formatPrice(turf.price_per_hour)}/hr
                    </p>
                  </div>
                  <Badge variant={turf.is_active ? "success" : "secondary"}>
                    {turf.is_active ? "Active" : "Off"}
                  </Badge>
                  <div className="flex gap-1">
                    <Link href={`/turfs/${turf.id}`}>
                      <Button size="icon-sm" variant="ghost"><Eye className="h-3.5 w-3.5" /></Button>
                    </Link>
                    <Link href={`/dashboard/owner/turfs/${turf.id}/edit`}>
                      <Button size="icon-sm" variant="ghost"><Edit className="h-3.5 w-3.5" /></Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-white/35 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" /> Recent Bookings
            </p>
            <Link href="/dashboard/owner/bookings">
              <Button variant="ghost" size="sm" className="text-xs text-white/35 hover:text-white gap-1 h-7">
                All <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => <div key={i} className="h-14 rounded-xl skeleton" />)}
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="py-10 text-center rounded-xl border border-white/[0.07]">
              <Calendar className="h-10 w-10 text-white/15 mx-auto mb-3" />
              <p className="text-sm text-white/50">No bookings yet</p>
              <p className="text-xs text-white/30 mt-1">Bookings will appear once players reserve your turfs</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentBookings.map((b) => (
                <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.07] bg-[#111111] hover:border-white/[0.12] transition-colors">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-xs bg-white/[0.05] text-white/50">
                      {b.user ? getInitials(b.user.full_name) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm truncate">
                      {b.user?.full_name || "Unknown Player"}
                    </p>
                    <p className="text-xs text-white/35 truncate">
                      {b.turf?.name} · {format(new Date(b.slot_date), "d MMM")} · {b.start_time}
                    </p>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    <p className="text-sm font-semibold text-brand-400">{formatPrice(b.total_price)}</p>
                    <Badge
                      variant={b.status === "confirmed" ? "success" : b.status === "cancelled" ? "destructive" : "warning"}
                      className="text-[10px]"
                    >
                      {b.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-3"
        >
          <Link href="/dashboard/owner/turfs/new">
            <div className="p-4 rounded-xl border border-white/[0.07] bg-[#111111] hover:border-white/[0.14] hover:bg-[#161616] transition-colors flex items-center gap-3 group cursor-pointer">
              <Plus className="h-4 w-4 text-brand-400" />
              <div>
                <p className="text-sm font-medium text-white">Add Turf</p>
                <p className="text-xs text-white/35">List a new venue</p>
              </div>
            </div>
          </Link>
          <Link href="/dashboard/owner/bookings">
            <div className="p-4 rounded-xl border border-white/[0.07] bg-[#111111] hover:border-white/[0.14] hover:bg-[#161616] transition-colors flex items-center gap-3 group cursor-pointer">
              <Calendar className="h-4 w-4 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-white">All Bookings</p>
                <p className="text-xs text-white/35">Manage reservations</p>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
