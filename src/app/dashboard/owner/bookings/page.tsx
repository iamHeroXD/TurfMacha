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

    const fetchBookings = async () => {
      const supabase = createClient();
      let query = supabase
        .from("bookings")
        .select("*, turf:turfs!inner(*), user:users(*)")
        .eq("turfs.owner_id", user.id)
        .order("slot_date", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data } = await query;
      setBookings((data as Booking[]) || []);
      setLoading(false);
    };

    fetchBookings();
  }, [user, filter, router]);

  return (
    <div className="min-h-screen bg-[#FAF7F0] pt-28 pb-24 md:pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-display font-bold text-[#1F2937] flex items-center gap-2"
          >
            <Calendar className="h-6 w-6 text-[#0B3D2E]" />
            All Bookings
          </motion.h1>

          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
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

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
            <Calendar className="h-16 w-16 text-gray-200 mx-auto mb-4" />
            <p className="text-[#6B7280] font-medium">No bookings found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm"
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="text-sm bg-[#0B3D2E]/8 text-[#0B3D2E] font-semibold">
                    {booking.user ? getInitials(booking.user.full_name) : "?"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[#1F2937] text-sm">{booking.user?.full_name || "Unknown"}</p>
                    <span className="text-[#9CA3AF] text-xs">·</span>
                    <p className="text-xs text-[#6B7280]">{booking.turf?.name}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-[#9CA3AF]">
                    <span>{format(new Date(booking.slot_date), "d MMM yyyy")}</span>
                    <span>·</span>
                    <span>{formatTime(booking.start_time)} – {formatTime(booking.end_time)}</span>
                    <span>·</span>
                    <span>{booking.sport}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-bold text-[#0B3D2E] text-sm">{formatPrice(booking.total_price)}</p>
                  <Badge
                    variant={
                      booking.status === "confirmed" ? "success"
                        : booking.status === "cancelled" ? "destructive"
                        : "warning"
                    }
                    className="mt-1 text-[10px]"
                  >
                    {booking.status}
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
