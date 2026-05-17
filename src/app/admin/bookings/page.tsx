"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { Booking } from "@/types";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const sb = createClient();
      let q = sb.from("bookings")
        .select("*, turf:turfs(name, city), user:users(full_name)")
        .order("created_at", { ascending: false })
        .limit(100);
      if (filter !== "all") q = q.eq("status", filter);
      const { data } = await q;
      setBookings((data as Booking[]) ?? []);
      setLoading(false);
    })();
  }, [filter]);

  const totalRevenue = bookings.filter(b => b.status === "confirmed").reduce((s, b) => s + b.total_price, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="h-6 w-6 text-brand-400" /> Bookings
          </h1>
          <p className="text-sm text-white/40 mt-0.5">
            {bookings.length} bookings · {formatPrice(totalRevenue)} confirmed revenue
          </p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(8)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
      ) : bookings.length === 0 ? (
        <div className="py-16 text-center rounded-xl border border-white/[0.07]">
          <Calendar className="h-10 w-10 text-white/15 mx-auto mb-3" />
          <p className="text-white/40 text-sm">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {bookings.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.015 }}
              className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.07] bg-[#111111]"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm truncate">{b.user?.full_name ?? "Unknown"}</p>
                <p className="text-xs text-white/35 truncate">
                  {b.turf?.name} · {format(new Date(b.slot_date), "d MMM yyyy")} · {b.start_time}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <p className="text-sm font-bold text-brand-400">{formatPrice(b.total_price)}</p>
                <Badge
                  variant={b.status === "confirmed" ? "success" : b.status === "cancelled" ? "destructive" : "warning"}
                  className="text-[10px]"
                >
                  {b.status}
                </Badge>
                {b.payment_status && b.payment_status !== "unpaid" && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium border ${
                    b.payment_status === "paid"
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      : b.payment_status === "refunded"
                      ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}>
                    {b.payment_status}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
