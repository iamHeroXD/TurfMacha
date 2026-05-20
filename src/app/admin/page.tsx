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
      const [usersRes, turfsRes, bookingsCountRes, revenueRes, recentUsersRes, recentBookingsRes] = await Promise.all([
        sb.from("users").select("id", { count: "exact", head: true }),
        sb.from("turfs").select("id", { count: "exact", head: true }),
        sb.from("bookings").select("id", { count: "exact", head: true }),
        sb.from("bookings")
          .select("total_price.sum()")
          .eq("status", "confirmed")
          .eq("payment_status", "paid"),
        sb.from("users").select("*").order("created_at", { ascending: false }).limit(5),
        sb.from("bookings").select("*, turf:turfs(name), user:users(full_name)").order("created_at", { ascending: false }).limit(5),
      ]);

      const revenueRow = revenueRes.data?.[0] as unknown as { "total_price": { sum: number } } | undefined;
      const revenue = revenueRow?.["total_price"]?.sum ?? 0;

      setStats({
        users: usersRes.count ?? 0,
        turfs: turfsRes.count ?? 0,
        bookings: bookingsCountRes.count ?? 0,
        revenue,
      });
      setRecentUsers((recentUsersRes.data ?? []) as User[]);
      setRecentBookings((recentBookingsRes.data ?? []) as Booking[]);
      setLoading(false);
    })();
  }, []);

  const STAT_CARDS = [
    { icon: Users,      label: "Total Users",    value: stats?.users,    iconCls: "text-blue-600",    iconBg: "bg-blue-100"        },
    { icon: Building2,  label: "Total Turfs",    value: stats?.turfs,    iconCls: "text-[#0B3D2E]",  iconBg: "bg-[#0B3D2E]/10"   },
    { icon: Calendar,   label: "Total Bookings", value: stats?.bookings, iconCls: "text-purple-600",  iconBg: "bg-purple-100"      },
    { icon: TrendingUp, label: "Total Revenue",  value: stats ? formatPrice(stats.revenue) : null, iconCls: "text-[#0B3D2E]", iconBg: "bg-[#A3E635]/20" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-[#1F2937]">Admin Overview</h1>
        <p className="text-sm text-[#6B7280] mt-0.5">Platform health at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STAT_CARDS.map(({ icon: Icon, label, value, iconCls, iconBg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm"
          >
            <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center mb-3`}>
              <Icon className={`h-4 w-4 ${iconCls}`} />
            </div>
            {loading ? <Skeleton className="h-6 w-16 mb-1" /> : (
              <p className="text-xl font-bold text-[#1F2937] tabular-nums">{value}</p>
            )}
            <p className="text-xs text-[#6B7280] mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Recent users */}
        <div className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm">
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-4">Recent Signups</p>
          {loading ? (
            <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 rounded-lg" />)}</div>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0B3D2E]/10 flex items-center justify-center shrink-0">
                    <span className="text-xs text-[#0B3D2E] font-bold">{u.full_name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#1F2937] font-medium truncate">{u.full_name}</p>
                    <p className="text-xs text-[#9CA3AF] truncate">{u.email}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-[#6B7280] capitalize font-medium">{u.role}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent bookings */}
        <div className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm">
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-4">Recent Bookings</p>
          {loading ? (
            <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 rounded-lg" />)}</div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((b) => (
                <div key={b.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#1F2937] font-medium truncate">{b.user?.full_name ?? "Unknown"}</p>
                    <p className="text-xs text-[#9CA3AF] truncate">{b.turf?.name} · {format(new Date(b.slot_date), "d MMM")}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#0B3D2E]">{formatPrice(b.total_price)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
