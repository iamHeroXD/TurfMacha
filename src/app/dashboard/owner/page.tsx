"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2, Calendar, TrendingUp, Users, Plus, ChevronRight, Eye, Edit
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
      setTurfs(turfList);

      const bookingList = (bookingsRes.data as Booking[]) || [];
      setRecentBookings(bookingList);

      const totalRevenue = bookingList
        .filter((b) => b.status === "confirmed")
        .reduce((sum, b) => sum + b.total_price, 0);
      setRevenue(totalRevenue);

      setLoading(false);
    };

    fetchData();
  }, [user, router]);

  if (!user) return null;

  const totalBookings = recentBookings.length;
  const confirmedBookings = recentBookings.filter((b) => b.status === "confirmed").length;

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-5xl mx-auto">
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
            <h1 className="text-xl font-bold text-white">Owner Dashboard</h1>
            <p className="text-white/50 text-sm">{user.full_name} · {user.email}</p>
          </div>
          <div className="ml-auto">
            <Link href="/dashboard/owner/turfs/new">
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" /> Add Turf
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Building2, label: "My Turfs", value: turfs.length, color: "text-emerald-400", bg: "bg-emerald-500/10" },
            { icon: Calendar, label: "Bookings", value: totalBookings, color: "text-blue-400", bg: "bg-blue-500/10" },
            { icon: TrendingUp, label: "Revenue", value: formatPrice(revenue), color: "text-purple-400", bg: "bg-purple-500/10" },
            { icon: Users, label: "Confirmed", value: confirmedBookings, color: "text-yellow-400", bg: "bg-yellow-500/10" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-5"
              >
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="text-xl font-bold text-white">{loading ? "—" : stat.value}</p>
                <p className="text-xs text-white/50 mt-0.5">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* My Turfs */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white text-lg">My Turfs</h2>
            <Link href="/dashboard/owner/turfs">
              <Button variant="ghost" size="sm" className="text-emerald-400 gap-1">
                View all <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
            </div>
          ) : turfs.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <Building2 className="h-12 w-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/60 mb-4">No turfs listed yet</p>
              <Link href="/dashboard/owner/turfs/new">
                <Button className="gap-2"><Plus className="h-4 w-4" /> Add Your First Turf</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {turfs.slice(0, 3).map((turf) => (
                <div key={turf.id} className="glass-card p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Building2 className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm truncate">{turf.name}</h3>
                    <p className="text-xs text-white/40">{turf.city} · {formatPrice(turf.price_per_hour)}/hr</p>
                  </div>
                  <Badge variant={turf.is_active ? "success" : "secondary"}>
                    {turf.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <div className="flex gap-2">
                    <Link href={`/turfs/${turf.id}`}>
                      <Button size="icon-sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/owner/turfs/${turf.id}/edit`}>
                      <Button size="icon-sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white text-lg">Recent Bookings</h2>
            <Link href="/dashboard/owner/bookings">
              <Button variant="ghost" size="sm" className="text-emerald-400 gap-1">
                View all <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <Calendar className="h-12 w-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/60">No bookings yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="glass-card p-4 flex items-center gap-4">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="text-sm">
                      {booking.user ? getInitials(booking.user.full_name) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">
                      {booking.user?.full_name || "Unknown"}
                    </p>
                    <p className="text-xs text-white/40">
                      {booking.turf?.name} · {format(new Date(booking.slot_date), "d MMM")} at {booking.start_time}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-emerald-400 font-bold text-sm">{formatPrice(booking.total_price)}</p>
                    <Badge
                      variant={
                        booking.status === "confirmed" ? "success"
                          : booking.status === "cancelled" ? "destructive"
                          : "warning"
                      }
                      className="text-[10px] mt-1"
                    >
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
