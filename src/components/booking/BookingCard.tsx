"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Booking } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, formatTime, SPORTS_CONFIG } from "@/lib/utils";

interface BookingCardProps {
  booking: Booking;
  onCancel?: () => void;
}

export function BookingCard({ booking, onCancel }: BookingCardProps) {
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setCancelling(true);
    try {
      const supabase = createClient();
      await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", booking.id);
      onCancel?.();
    } finally {
      setCancelling(false);
    }
  };

  const statusVariants: Record<string, "success" | "warning" | "destructive"> = {
    confirmed: "success",
    pending: "warning",
    cancelled: "destructive",
  };

  return (
    <div className="glass-card p-4 flex gap-4">
      {/* Turf image */}
      <Link href={`/turfs/${booking.turf_id}`} className="shrink-0">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden">
          <Image
            src={booking.turf?.images?.[0] || `https://picsum.photos/seed/${booking.turf_id}/200/200`}
            alt={booking.turf?.name || "Turf"}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/turfs/${booking.turf_id}`}>
            <h3 className="font-semibold text-white text-sm hover:text-emerald-400 transition-colors truncate">
              {booking.turf?.name}
            </h3>
          </Link>
          <Badge variant={statusVariants[booking.status]} className="shrink-0 text-[10px]">
            {booking.status}
          </Badge>
        </div>

        <div className="flex items-center gap-1 mt-1 text-white/50 text-xs">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{booking.turf?.city}</span>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
          <div className="flex items-center gap-1 text-xs text-white/60">
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(booking.slot_date), "d MMM yyyy")}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-white/60">
            <Clock className="h-3 w-3" />
            <span>{formatTime(booking.start_time)} - {formatTime(booking.end_time)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-emerald-400 font-bold text-sm">
            {formatPrice(booking.total_price)}
          </span>
          {booking.status !== "cancelled" && booking.status !== "confirmed" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleCancel}
              loading={cancelling}
              className="text-xs h-7 px-3"
            >
              <XCircle className="h-3 w-3" />
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
