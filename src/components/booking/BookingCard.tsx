"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Booking } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, formatTime } from "@/lib/utils";

interface BookingCardProps {
  booking: Booking;
  onCancel?: () => void;
}

export function BookingCard({ booking, onCancel }: BookingCardProps) {
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    if (!confirm("Cancel this booking?")) return;
    setCancelling(true);
    try {
      await createClient().from("bookings").update({ status: "cancelled" }).eq("id", booking.id);
      onCancel?.();
    } finally { setCancelling(false); }
  };

  const statusVariant: Record<string, "success" | "warning" | "destructive"> = {
    confirmed: "success", pending: "warning", cancelled: "destructive",
  };

  return (
    <div className="flex gap-3 p-3 rounded-xl border border-white/[0.07] bg-[#111111] hover:border-white/[0.12] transition-colors">
      <Link href={`/turfs/${booking.turf_id}`} className="shrink-0">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/[0.04]">
          <Image
            src={booking.turf?.images?.[0] || `https://picsum.photos/seed/${booking.turf_id}/200/200`}
            alt={booking.turf?.name || "Turf"}
            fill className="object-cover"
          />
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link href={`/turfs/${booking.turf_id}`}>
            <h3 className="font-medium text-white text-sm hover:text-emerald-400 transition-colors line-clamp-1">
              {booking.turf?.name}
            </h3>
          </Link>
          <Badge variant={statusVariant[booking.status]} className="shrink-0 text-[10px]">
            {booking.status}
          </Badge>
        </div>

        <div className="flex items-center gap-1 text-xs text-white/40 mb-2">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{booking.turf?.city}</span>
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/40">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{format(new Date(booking.slot_date), "d MMM yyyy")}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatTime(booking.start_time)} – {formatTime(booking.end_time)}</span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-semibold text-emerald-400">{formatPrice(booking.total_price)}</span>
          {booking.status === "pending" && (
            <Button variant="destructive" size="sm" onClick={handleCancel} loading={cancelling} className="text-xs h-7 px-2.5">
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
