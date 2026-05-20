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
      const monthEnd   = format(endOfMonth(now), "yyyy-MM-dd");
      const weekStart  = format(subDays(now, 6), "yyyy-MM-dd");

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

      const turfList    = (turfsRes.data as Turf[])    || [];
      const bookingList = (bookingsRes.data as Booking[]) || [];

      setTurfs(turfList);
      setRecentBookings(bookingList);
      setRevenue(bookingList.filter((b) => b.status === "confirmed").reduce((s, b) => s + b.total_price, 0));
      setMonthRevenue((monthRes.data || []).reduce((s: number, b: { total_price: number }) => s + b.total_price, 0));

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

  const confirmed   = recentBookings.filter((b) => b.status === "confirmed").length;
  const activeTurfs = turfs.filter((t) => t.is_active).length;
  const bookingRate = recentBookings.length > 0
    ? Math.round((confirmed / recentBookings.length) * 100)
    : 0;

  const STATS = [
    { icon: Building2,  label: "Active Turfs",     value: loading ? "—" : `${activeTurfs}/${turfs.length}` },
    { icon: Calendar,   label: "Recent Bookings",   value: loading ? "—" : recentBookings.length },
    { icon: TrendingUp, label: "Month Revenue",     value: loading ? "—" : formatPrice(monthRevenue) },
    { icon: Activity,   label: "Confirm Rate",      value: loading ? "—" : `${bookingRate}%` },
  ];

  return (
    <div className="min-h-screen bg-[#F4F1EB] pt-14 pb-24 md:pb-8">

      {/* Profile banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white border-b border-[#E7E2DA]"
      >
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center gap-4">
          <Avatar className="h-12 w-12 shrink-0 ring-2 ring-[#E7E2DA]">
            <AvatarImage src={user.avatar_url} />
            <AvatarFallback className="text-sm bg-[#0D4D36]/10 text-[#0D4D36] font-bold">
              {getInitials(user.full_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-[#111111] truncate">{user.full_name}</h1>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#0D4D36]/8 text-[#0D4D36] border border-[#0D4D36]/15 shrink-0 font-bold">
                Owner
              </span>
            </div>
            <p className="text-xs text-[#9E9284] truncate mt-0.5">{user.email}</p>
          </div>
          <Link href="/dashboard/owner/turfs/new" className="shrink-0">
            <Button size="sm" className="gap-1.5 rounded-xl">
              <Plus className="h-3.5 w-3.5" /> Add Turf
            </Button>
          </Link>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

        {/* Stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.35 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {STATS.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="p-5 rounded-2xl border-2 border-[#E7E2DA] bg-white hover:border-[#C4BAB0] hover:shadow-md hover:shadow-black/5 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-xl bg-[#0D4D36]/8 flex items-center justify-center mb-3">
                <Icon className="h-4 w-4 text-[#0D4D36]" />
              </div>
              <p className="text-xl font-bold text-[#111111] tabular-nums">{value}</p>
              <p className="text-xs text-[#9E9284] mt-0.5 font-medium">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Revenue chart */}
        {!loading && chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-5 rounded-2xl border-2 border-[#E7E2DA] bg-white"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs font-bold text-[#9E9284] uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart3 className="h-3.5 w-3.5" /> Revenue — Last 7 Days
                </p>
                {revenue > 0 && (
                  <p className="text-xs text-[#9E9284] mt-0.5">{formatPrice(revenue)} recent</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-[#0D4D36]">{formatPrice(monthRevenue)}</p>
                <p className="text-xs text-[#9E9284]">this month</p>
              </div>
            </div>
            <div className="flex items-end gap-1.5 h-20">
              {(() => {
                const max = Math.max(...chartData.map((d) => d.revenue), 1);
                return chartData.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.18 + i * 0.06, duration: 0.4 }}
                      style={{ height: `${Math.max((d.revenue / max) * 100, 5)}%`, originY: 1 }}
                      className={`w-full rounded-t-md ${
                        d.revenue > 0
                          ? "bg-[#0D4D36]/70 hover:bg-[#0D4D36] transition-colors"
                          : "bg-[#E7E2DA]"
                      }`}
                    />
                    <span className="text-[9px] text-[#9E9284] font-medium">{d.day}</span>
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#111111] flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-[#0D4D36]" /> My Turfs
            </h2>
            <Link href="/dashboard/owner/turfs">
              <Button variant="ghost" size="sm" className="text-xs text-[#5F5F5F] gap-1 h-7 rounded-xl">
                All <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-2.5">
              {[...Array(2)].map((_, i) => <div key={i} className="h-16 rounded-2xl skeleton" />)}
            </div>
          ) : turfs.length === 0 ? (
            <div className="py-12 text-center rounded-2xl border-2 border-dashed border-[#E7E2DA] bg-white">
              <Building2 className="h-10 w-10 text-[#C4BAB0] mx-auto mb-3" />
              <p className="text-sm font-semibold text-[#5F5F5F] mb-4">No turfs listed yet</p>
              <Link href="/dashboard/owner/turfs/new">
                <Button size="sm" className="gap-1.5 rounded-xl">
                  <Plus className="h-3.5 w-3.5" /> Add Turf
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {turfs.slice(0, 3).map((turf) => (
                <div key={turf.id} className="flex items-center gap-3 p-3.5 rounded-2xl border-2 border-[#E7E2DA] bg-white hover:border-[#C4BAB0] transition-all duration-150">
                  <div className="w-9 h-9 rounded-xl bg-[#0D4D36]/8 border border-[#0D4D36]/15 flex items-center justify-center shrink-0">
                    <Building2 className="h-4 w-4 text-[#0D4D36]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#111111] text-sm truncate">{turf.name}</p>
                    <p className="text-xs text-[#9E9284] mt-0.5">
                      {turf.city} · {formatPrice(turf.price_per_hour)}/hr
                    </p>
                  </div>
                  <Badge variant={turf.is_active ? "success" : "secondary"}>
                    {turf.is_active ? "Active" : "Off"}
                  </Badge>
                  <div className="flex gap-1">
                    <Link href={`/turfs/${turf.id}`}>
                      <Button size="icon-sm" variant="ghost" className="rounded-lg text-[#5F5F5F]">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/owner/turfs/${turf.id}/edit`}>
                      <Button size="icon-sm" variant="ghost" className="rounded-lg text-[#5F5F5F]">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#111111] flex items-center gap-2 text-sm">
              <BarChart3 className="h-4 w-4 text-[#0D4D36]" /> Recent Bookings
            </h2>
            <Link href="/dashboard/owner/bookings">
              <Button variant="ghost" size="sm" className="text-xs text-[#5F5F5F] gap-1 h-7 rounded-xl">
                All <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-2.5">
              {[...Array(3)].map((_, i) => <div key={i} className="h-14 rounded-2xl skeleton" />)}
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="py-12 text-center rounded-2xl border-2 border-dashed border-[#E7E2DA] bg-white">
              <Calendar className="h-10 w-10 text-[#C4BAB0] mx-auto mb-3" />
              <p className="text-sm font-semibold text-[#5F5F5F]">No bookings yet</p>
              <p className="text-xs text-[#9E9284] mt-1">Players&apos; reservations will appear here</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentBookings.map((b) => (
                <div key={b.id} className="flex items-center gap-3 p-3.5 rounded-2xl border-2 border-[#E7E2DA] bg-white hover:border-[#C4BAB0] transition-all duration-150">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="text-xs bg-[#F4F1EB] text-[#5F5F5F] font-semibold">
                      {b.user ? getInitials(b.user.full_name) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#111111] text-sm truncate">
                      {b.user?.full_name || "Unknown Player"}
                    </p>
                    <p className="text-xs text-[#9E9284] truncate">
                      {b.turf?.name} · {format(new Date(b.slot_date), "d MMM")} · {b.start_time}
                    </p>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    <p className="text-sm font-bold text-[#0D4D36]">{formatPrice(b.total_price)}</p>
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
            <div className="p-5 rounded-2xl border-2 border-[#E7E2DA] bg-white hover:border-[#0D4D36]/30 hover:shadow-md hover:shadow-black/5 transition-all duration-200 flex items-center gap-3 cursor-pointer group">
              <div className="w-9 h-9 rounded-xl bg-[#0D4D36]/8 flex items-center justify-center shrink-0">
                <Plus className="h-4 w-4 text-[#0D4D36]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#111111]">Add Turf</p>
                <p className="text-xs text-[#9E9284]">List a new venue</p>
              </div>
            </div>
          </Link>
          <Link href="/dashboard/owner/bookings">
            <div className="p-5 rounded-2xl border-2 border-[#E7E2DA] bg-white hover:border-blue-200 hover:shadow-md hover:shadow-black/5 transition-all duration-200 flex items-center gap-3 cursor-pointer group">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Calendar className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#111111]">All Bookings</p>
                <p className="text-xs text-[#9E9284]">Manage reservations</p>
              </div>
            </div>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
