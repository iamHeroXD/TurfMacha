"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";
import { Booking } from "@/types";
import { formatPrice, formatTime, getInitials } from "@/lib/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function OwnerBookingsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    if (user.role !== "owner") { router.push("/dashboard/user"); return; }

    const fetchBookings = async () => {
      setLoading(true);
      const supabase = createClient();
      let q = supabase
        .from("bookings")
        .select("*, turf:turfs!inner(*), user:users(*)")
        .eq("turfs.owner_id", user.id)
        .order("slot_date", { ascending: false });
      if (filter !== "all") q = q.eq("status", filter);
      const { data } = await q;
      setBookings((data as Booking[]) || []);
      setLoading(false);
    };
    fetchBookings();
  }, [user, filter, router]);

  const statusVariant = (s: string) =>
    s === "confirmed" ? "success" : s === "cancelled" ? "destructive" : "warning";

  return (
    <div className="min-h-screen bg-[#F4F1EB] pt-14 pb-24 md:pb-8">

      <div className="bg-white border-b border-[#E7E2DA]">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-xl text-[#111111] flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#0D4D36]" /> All Bookings
            </h1>
            {!loading && (
              <p className="text-sm text-[#5F5F5F] mt-0.5">
                {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-36 h-9 text-sm rounded-xl border-[#E7E2DA] bg-[#F4F1EB]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
          </div>
        ) : bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-[#E7E2DA] p-14 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#F4F1EB] border border-[#E7E2DA] flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-7 w-7 text-[#C4BAB0]" />
            </div>
            <p className="font-semibold text-[#111111] mb-1">
              {filter === "all" ? "No bookings yet" : `No ${filter} bookings`}
            </p>
            <p className="text-sm text-[#5F5F5F]">
              {filter === "all"
                ? "Player reservations will appear here once your turfs are listed."
                : "Try a different status filter."}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2.5">
            {bookings.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white rounded-2xl border border-[#E7E2DA] p-4 flex items-center gap-4 hover:border-[#C4BAB0] transition-colors"
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="text-xs bg-[#0D4D36]/8 text-[#0D4D36] font-semibold">
                    {b.user ? getInitials(b.user.full_name) : "?"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="font-semibold text-[#111111] text-sm">{b.user?.full_name || "Unknown"}</p>
                    <span className="text-[#C4BAB0] text-xs">·</span>
                    <p className="text-xs text-[#5F5F5F] truncate">{b.turf?.name}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-[#9E9284] flex-wrap">
                    <span>{format(new Date(b.slot_date + "T12:00:00"), "d MMM yyyy")}</span>
                    <span className="text-[#C4BAB0]">·</span>
                    <span>{formatTime(b.start_time)} – {formatTime(b.end_time)}</span>
                    <span className="text-[#C4BAB0]">·</span>
                    <span className="capitalize">{b.sport}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-bold text-[#0D4D36] text-sm">{formatPrice(b.total_price)}</p>
                  <Badge variant={statusVariant(b.status) as "success" | "warning" | "destructive"} className="mt-1 text-[10px] capitalize">
                    {b.status}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
