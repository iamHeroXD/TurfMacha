"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Booking } from "@/types";
import { formatPrice, formatTime } from "@/lib/utils";
import { toast } from "@/hooks/useToast";

interface BookingCardProps {
  booking: Booking;
  onCancel?: () => void;
}

function isCancellable(booking: Booking): boolean {
  if (booking.status === "cancelled") return false;
  const slotStart = new Date(`${booking.slot_date}T${booking.start_time}`);
  return slotStart > new Date();
}

/* Safe date parse — avoids UTC midnight timezone rollover */
function parseDate(dateStr: string): Date {
  return new Date(dateStr.includes("T") ? dateStr : `${dateStr}T12:00:00`);
}

export function BookingCard({ booking, onCancel }: BookingCardProps) {
  const [cancelling, setCancelling] = useState(false);
  const cancellable = isCancellable(booking);

  const handleCancel = async () => {
    if (!confirm("Cancel this booking? A refund will be initiated automatically.")) return;
    setCancelling(true);
    try {
      const res = await fetch("/api/payments/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to cancel booking");

      toast({
        title: "Booking cancelled",
        description: data.refunded
          ? "Your refund has been initiated and will arrive in 5–7 business days."
          : data.refundNote ?? "Booking cancelled successfully.",
      });
      onCancel?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not cancel booking";
      toast({ title: "Cancellation failed", description: msg, variant: "destructive" });
    } finally {
      setCancelling(false);
    }
  };

  const statusVariant: Record<string, "success" | "warning" | "destructive"> = {
    confirmed: "success",
    pending:   "warning",
    cancelled: "destructive",
  };

  return (
    <div className="flex gap-3 p-4 rounded-2xl border-2 border-gray-100 bg-white hover:border-[#0B3D2E]/15 hover:shadow-md hover:shadow-[#0B3D2E]/5 transition-all duration-200">
      <Link href={`/turfs/${booking.turf_id}`} className="shrink-0">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#FAF7F0]">
          <Image
            src={
              booking.turf?.images?.[0] ||
              `https://picsum.photos/seed/${booking.turf_id}/200/200`
            }
            alt={booking.turf?.name || "Turf"}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link href={`/turfs/${booking.turf_id}`}>
            <h3 className="font-display font-bold text-[#1F2937] text-sm hover:text-[#0B3D2E] transition-colors line-clamp-1">
              {booking.turf?.name}
            </h3>
          </Link>
          <Badge variant={statusVariant[booking.status] ?? "warning"} className="shrink-0 text-[10px] capitalize">
            {booking.status}
          </Badge>
        </div>

        <div className="flex items-center gap-1 text-xs text-[#9CA3AF] mb-2">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{booking.turf?.city}</span>
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#9CA3AF]">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {format(parseDate(booking.slot_date), "d MMM yyyy")}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTime(booking.start_time)} – {formatTime(booking.end_time)}
          </span>
        </div>

        <div className="flex items-center justify-between mt-2.5">
          <span className="text-sm font-bold text-[#0B3D2E]">
            {formatPrice(booking.total_price)}
          </span>
          {cancellable && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleCancel}
              loading={cancelling}
              className="text-xs h-7 px-2.5"
            >
              Cancel & Refund
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
