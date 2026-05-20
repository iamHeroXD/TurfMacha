"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, AlertTriangle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
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
  return new Date(`${booking.slot_date}T${booking.start_time}`) > new Date();
}

function parseDate(dateStr: string): Date {
  return new Date(dateStr.includes("T") ? dateStr : `${dateStr}T12:00:00`);
}

export function BookingCard({ booking, onCancel }: BookingCardProps) {
  const [cancelling,  setCancelling]  = useState(false);
  const [confirming,  setConfirming]  = useState(false);
  const cancellable = isCancellable(booking);

  const handleCancel = async () => {
    setCancelling(true);
    setConfirming(false);
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
          ? "Refund will arrive in 5–7 business days."
          : data.refundNote ?? "Booking cancelled successfully.",
      });
      onCancel?.();
    } catch (err) {
      toast({
        title: "Cancellation failed",
        description: err instanceof Error ? err.message : "Could not cancel booking",
        variant: "destructive",
      });
    } finally {
      setCancelling(false);
    }
  };

  const statusVariant: Record<string, "success" | "warning" | "destructive"> = {
    confirmed: "success", pending: "warning", cancelled: "destructive",
  };

  return (
    <div className="rounded-2xl border border-[#E7E2DA] bg-white hover:border-[#0D4D36]/15 hover:shadow-md hover:shadow-[#0D4D36]/5 transition-all duration-200 overflow-hidden">
      <div className="flex gap-3 p-4">
        {/* Thumbnail */}
        <Link href={`/turfs/${booking.turf_id}`} className="shrink-0">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#F4F1EB]">
            <Image
              src={booking.turf?.images?.[0] || `https://picsum.photos/seed/${booking.turf_id}/200/200`}
              alt={booking.turf?.name || "Turf"}
              fill className="object-cover" sizes="64px"
            />
          </div>
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <Link href={`/turfs/${booking.turf_id}`}>
              <h3 className="font-display font-bold text-[#111111] text-sm hover:text-[#0D4D36] transition-colors line-clamp-1">
                {booking.turf?.name}
              </h3>
            </Link>
            <Badge variant={statusVariant[booking.status] ?? "warning"} className="shrink-0 text-[10px] capitalize">
              {booking.status}
            </Badge>
          </div>

          <div className="flex items-center gap-1 text-xs text-[#9E9284] mb-2">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{booking.turf?.city}</span>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#9E9284]">
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
            <span className="text-sm font-bold text-[#0D4D36]">{formatPrice(booking.total_price)}</span>
            {cancellable && !confirming && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirming(true)}
                className="text-xs h-7 px-2.5 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Inline cancel confirm */}
      <AnimatePresence>
        {confirming && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mx-4 mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200">
              <div className="flex items-start gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-red-800">Cancel this booking?</p>
                  <p className="text-xs text-red-600 mt-0.5">
                    {booking.payment_status === "paid"
                      ? "A refund will be initiated automatically (5–7 business days)."
                      : "This slot will be released immediately."}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirming(false)}
                  disabled={cancelling}
                  className="flex-1 h-8 text-xs rounded-lg border-red-200 text-[#5F5F5F]"
                >
                  Keep Booking
                </Button>
                <Button
                  size="sm"
                  onClick={handleCancel}
                  loading={cancelling}
                  className="flex-1 h-8 text-xs rounded-lg bg-red-600 hover:bg-red-700 text-white"
                >
                  Yes, Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
