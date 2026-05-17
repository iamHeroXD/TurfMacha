"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Building2, Calendar, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { User, Booking } from "@/types";

interface Stats {
  users: number;
  turfs: number;
  bookings: number;
  revenue: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const sb = createClient();
      const [usersRes, turfsRes, bookingsRes, recentUsersRes, recentBookingsRes] = await Promise.all([
        sb.from("users").select("id", { count: "exact", head: true }),
        sb.from("turfs").select("id", { count: "exact", head: true }),
        sb.from("bookings").select("id, total_price, status"),
        sb.from("users").select("*").order("created_at", { ascending: false }).limit(5),
        sb.from("bookings").select("*, turf:turfs(name), user:users(full_name)").order("created_at", { ascending: false }).limit(5),
      ]);

      const bookings = bookingsRes.data ?? [];
      const revenue = bookings.filter(b => b.status === "confirmed").reduce((s: number, b: { total_price: number }) => s + b.total_price, 0);

      setStats({
        users: usersRes.count ?? 0,
        turfs: turfsRes.count ?? 0,
        bookings: bookingsRes.count ?? 0,
        revenue,
      });
      setRecentUsers((recentUsersRes.data ?? []) as User[]);
      setRecentBookings((recentBookingsRes.data ?? []) as Booking[]);
      setLoading(false);
    })();
  }, []);

  const STAT_CARDS = [
    { icon: Users,     label: "Total Users",    value: stats?.users,   color: "text-blue-400",  bg: "bg-blue-500/10"  },
    { icon: Building2, label: "Total Turfs",    value: stats?.turfs,   color: "text-brand-400", bg: "bg-brand-400/10" },
    { icon: Calendar,  label: "Total Bookings", value: stats?.bookings,color: "text-purple-400",bg: "bg-purple-500/10"},
    { icon: TrendingUp,label: "Total Revenue",  value: stats ? formatPrice(stats.revenue) : null, color: "text-brand-400", bg: "bg-brand-400/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Overview</h1>
        <p className="text-sm text-white/40 mt-0.5">Platform health at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STAT_CARDS.map(({ icon: Icon, label, value, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-xl border border-white/[0.07] bg-[#111111]"
          >
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            {loading ? <Skeleton className="h-6 w-16 mb-1" /> : (
              <p className="text-xl font-bold text-white tabular-nums">{value}</p>
            )}
            <p className="text-xs text-white/40 mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Recent users */}
        <div className="p-4 rounded-xl border border-white/[0.07] bg-[#111111]">
          <p className="text-xs font-medium text-white/35 uppercase tracking-wider mb-3">Recent Signups</p>
          {loading ? (
            <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 rounded-lg" />)}</div>
          ) : (
            <div className="space-y-2">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0">
                    <span className="text-xs text-white/50">{u.full_name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{u.full_name}</p>
                    <p className="text-xs text-white/35 truncate">{u.email}</p>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-white/40 capitalize">{u.role}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent bookings */}
        <div className="p-4 rounded-xl border border-white/[0.07] bg-[#111111]">
          <p className="text-xs font-medium text-white/35 uppercase tracking-wider mb-3">Recent Bookings</p>
          {loading ? (
            <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 rounded-lg" />)}</div>
          ) : (
            <div className="space-y-2">
              {recentBookings.map((b) => (
                <div key={b.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{b.user?.full_name ?? "Unknown"}</p>
                    <p className="text-xs text-white/35 truncate">{b.turf?.name} · {format(new Date(b.slot_date), "d MMM")}</p>
                  </div>
                  <p className="text-sm font-semibold text-brand-400">{formatPrice(b.total_price)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
