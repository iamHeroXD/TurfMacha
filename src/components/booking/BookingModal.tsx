"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Clock, CheckCircle, ChevronLeft, Coins, CreditCard } from "lucide-react";
import { format, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Turf, Sport } from "@/types";
import { useAuthStore } from "@/store/useAuthStore";
import { formatPrice, formatTime, generateTimeSlots, SPORTS_CONFIG } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/useToast";

// Razorpay types
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: RazorpayPaymentResponse) => void;
  modal?: { ondismiss?: () => void };
}
interface RazorpayInstance {
  open: () => void;
}
interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface BookingModalProps {
  turf: Turf;
  open: boolean;
  onClose: () => void;
}

const RAZORPAY_ENABLED =
  typeof process !== "undefined" &&
  !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

async function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (window.Razorpay) return true;
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

export function BookingModal({ turf, open, onClose }: BookingModalProps) {
  const { user } = useAuthStore();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(1);
  const [sport, setSport] = useState<Sport>(turf.sports[0]);
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [bookingId, setBookingId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const realtimeChannelRef = useRef<any>(null);

  const slots = generateTimeSlots(
    turf.operating_hours_start || "06:00",
    turf.operating_hours_end || "22:00"
  );
  const total = turf.price_per_hour * duration;
  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  // Reset all state when modal opens and pre-fetch today's booked slots
  useEffect(() => {
    if (!open) return;
    const today = new Date();
    setStep(1);
    setDate(today);
    setTime("");
    setDuration(1);
    setSport(turf.sports[0]);
    setError("");
    setBookingId(null);
    fetchBooked(today);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, turf.id]);

  // Realtime subscription: refresh booked slots whenever another user books this turf+date
  useEffect(() => {
    if (!open) {
      // Clean up channel on close
      if (realtimeChannelRef.current) {
        import("@/lib/supabase/client").then(({ createClient }) => {
          createClient().removeChannel(realtimeChannelRef.current);
          realtimeChannelRef.current = null;
        });
      }
      return;
    }

    import("@/lib/supabase/client").then(({ createClient }) => {
      const supabase = createClient();
      const channelName = `bookings-${turf.id}`;

      // Remove previous channel if exists
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
      }

      const channel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookings",
            filter: `turf_id=eq.${turf.id}`,
          },
          () => {
            // Re-fetch whenever any booking for this turf changes
            fetchBooked(date);
          }
        )
        .subscribe();

      realtimeChannelRef.current = channel;
    });
  // date and fetchBooked are stable within an open session; re-subscribing on date change is fine
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, turf.id, date]);

  const fetchBooked = useCallback(async (d: Date) => {
    const { createClient } = await import("@/lib/supabase/client");
    const { data, error } = await createClient()
      .from("bookings")
      .select("start_time")
      .eq("turf_id", turf.id)
      .eq("slot_date", format(d, "yyyy-MM-dd"))
      .neq("status", "cancelled");

    if (error) {
      console.error("fetchBooked error:", error);
      setBooked([]);
      return;
    }
    setBooked(data?.map((b) => b.start_time) || []);
  }, [turf.id]);

  const onDateSelect = (d: Date) => {
    setDate(d);
    setTime("");
    fetchBooked(d);
  };

  // Calculate end time — guard against midnight rollover
  const getEndTime = (startTime: string, durationHours: number): string | null => {
    const [h, m] = startTime.split(":").map(Number);
    const endTotalMinutes = h * 60 + m + durationHours * 60;
    const endHour = Math.floor(endTotalMinutes / 60);
    const endMin = endTotalMinutes % 60;
    if (endHour >= 24) return null; // crosses midnight
    return `${String(endHour).padStart(2, "0")}:${String(endMin).padStart(2, "0")}`;
  };

  const handlePayAndBook = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError("");

    const endTime = getEndTime(time, duration);
    if (!endTime) {
      setError("Booking would extend past midnight. Please choose an earlier time slot.");
      setLoading(false);
      return;
    }

    try {
      // If Razorpay is configured, use payment flow
      if (RAZORPAY_ENABLED) {
        await handleRazorpayFlow(endTime);
      } else {
        // Development / no-payment mode: create pending booking directly
        await handleDirectBooking(endTime);
      }
    } catch {
      setError("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDirectBooking = async (endTime: string) => {
    const { createClient } = await import("@/lib/supabase/client");
    const { data, error: err } = await createClient()
      .from("bookings")
      .insert({
        user_id: user!.id,
        turf_id: turf.id,
        slot_date: format(date, "yyyy-MM-dd"),
        start_time: time,
        end_time: endTime,
        duration_hours: duration,
        total_price: total,
        status: "confirmed",
        payment_status: "unpaid",
        sport,
      })
      .select("id")
      .single();

    if (err) {
      setError(
        err.message.includes("overlap") || err.message.includes("unique")
          ? "This slot was just booked by someone else — please pick another time."
          : err.message
      );
      return;
    }
    setBookingId(data?.id ?? null);
    setStep(3);
  };

  const handleRazorpayFlow = async (endTime: string) => {
    // Step 1: Create order on backend
    const orderRes = await fetch("/api/payments/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turfId: turf.id,
        slotDate: format(date, "yyyy-MM-dd"),
        startTime: time,
        endTime,
        durationHours: duration,
        totalPrice: total,
        sport,
      }),
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok) {
      setError(orderData.error || "Failed to create payment order. Please try again.");
      setLoading(false);
      return;
    }

    // Step 2: Load Razorpay SDK
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setError("Payment gateway failed to load. Please try again or use a different network.");
      setLoading(false);
      return;
    }

    setLoading(false); // Stop spinner — Razorpay checkout takes over

    // Step 3: Open Razorpay checkout
    const options: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: orderData.amount,
      currency: "INR",
      name: "TurfMacha",
      description: `${turf.name} — ${format(date, "d MMM")} ${formatTime(time)}`,
      order_id: orderData.razorpayOrderId,
      prefill: {
        name: user?.full_name,
        email: user?.email,
      },
      theme: { color: "#0D4D36" },
      handler: async (paymentResponse: RazorpayPaymentResponse) => {
        setLoading(true);
        try {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bookingId: orderData.bookingId,
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpaySignature: paymentResponse.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) {
            setError(verifyData.error || "Payment verification failed. Contact support.");
            return;
          }
          setBookingId(orderData.bookingId);
          setStep(3);
        } catch {
          setError("Payment verified but booking confirmation failed. Contact support.");
        } finally {
          setLoading(false);
        }
      },
      modal: {
        ondismiss: () => {
          setError("Payment was cancelled. Your slot has been reserved for 10 minutes.");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm w-[calc(100vw-2rem)] mx-auto">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-[#E7E2DA]">
          <DialogHeader>
            <DialogTitle className="text-[#111111]">
              {step === 3 ? "Booking Confirmed" : `Book — ${turf.name}`}
            </DialogTitle>
          </DialogHeader>
          {step < 3 && (
            <div className="flex items-center gap-2 mt-3">
              {["Date & Time", "Confirm"].map((label, i) => {
                const n = i + 1;
                return (
                  <div key={label} className="flex items-center gap-2 flex-1 min-w-0">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 border-2",
                        step > n
                          ? "bg-[#0D4D36] text-white border-[#0D4D36]"
                          : step === n
                          ? "border-[#0D4D36]/50 text-[#0D4D36] bg-[#0D4D36]/8"
                          : "border-[#E7E2DA] text-[#9E9284]"
                      )}
                    >
                      {step > n ? "✓" : n}
                    </div>
                    <span
                      className={cn(
                        "text-xs truncate font-medium",
                        step === n ? "text-[#111111]" : "text-[#9E9284]"
                      )}
                    >
                      {label}
                    </span>
                    {i < 1 && (
                      <div
                        className={cn(
                          "h-px flex-1 mx-1",
                          step > 1 ? "bg-[#0D4D36]/30" : "bg-[#E7E2DA]"
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-5 py-5 overflow-y-auto max-h-[60vh]">
          <AnimatePresence mode="wait">
            {/* Step 1: Date & Time */}
            {step === 1 && (
              <motion.div
                key="s1"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-5"
              >
                {/* Sport selector */}
                {turf.sports.length > 1 && (
                  <div>
                    <p className="text-xs text-[#9E9284] uppercase tracking-wider mb-2 font-semibold">
                      Sport
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {turf.sports.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSport(s)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl border-2 text-xs font-semibold transition-all",
                            sport === s
                              ? "bg-[#0D4D36]/8 border-[#0D4D36]/30 text-[#0D4D36]"
                              : "border-[#E7E2DA] text-[#5F5F5F] hover:border-[#C4BAB0] hover:text-[#111111]"
                          )}
                        >
                          {SPORTS_CONFIG[s].emoji} {SPORTS_CONFIG[s].label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Date selector */}
                <div>
                  <p className="text-xs text-[#9E9284] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-semibold">
                    <Calendar className="h-3 w-3" /> Date
                  </p>
                  <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                    {dates.map((d) => {
                      const sel = format(d, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
                      const today = format(d, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
                      return (
                        <button
                          key={d.toISOString()}
                          onClick={() => onDateSelect(d)}
                          className={cn(
                            "flex flex-col items-center px-3 py-2.5 rounded-2xl border-2 text-xs shrink-0 transition-all",
                            sel
                              ? "bg-[#0D4D36] border-[#0D4D36] text-white"
                              : "border-[#E7E2DA] text-[#5F5F5F] hover:border-[#C4BAB0] bg-white"
                          )}
                        >
                          <span className="text-[9px] uppercase font-bold tracking-wider opacity-70">
                            {format(d, "EEE")}
                          </span>
                          <span className="text-lg font-bold leading-none mt-0.5">
                            {format(d, "d")}
                          </span>
                          <span className="text-[9px] mt-0.5 opacity-60">
                            {today ? "Today" : format(d, "MMM")}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time selector */}
                <div>
                  <p className="text-xs text-[#9E9284] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-semibold">
                    <Clock className="h-3 w-3" /> Time
                  </p>
                  <div className="grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto">
                    {slots.map((s) => {
                      const isB = booked.includes(s);
                      const isSel = time === s;
                      const wouldCrossMidnight = !getEndTime(s, duration);
                      const unavailable = isB || wouldCrossMidnight;
                      return (
                        <button
                          key={s}
                          onClick={() => !unavailable && setTime(s)}
                          disabled={unavailable}
                          className={cn(
                            "py-2 rounded-xl border-2 text-xs font-semibold transition-all",
                            unavailable
                              ? "border-[#E7E2DA] text-[#C4BAB0] line-through cursor-not-allowed bg-[#F4F1EB]"
                              : isSel
                              ? "bg-[#0D4D36] border-[#0D4D36] text-white"
                              : "border-[#E7E2DA] text-[#5F5F5F] hover:border-[#C4BAB0] hover:text-[#111111] bg-white"
                          )}
                        >
                          {unavailable ? "—" : formatTime(s)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Duration selector */}
                <div>
                  <p className="text-xs text-[#9E9284] uppercase tracking-wider mb-2 font-semibold">
                    Duration
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDuration(d)}
                        className={cn(
                          "py-2 rounded-xl border-2 text-sm font-semibold transition-all",
                          duration === d
                            ? "bg-[#0D4D36] border-[#0D4D36] text-white"
                            : "border-[#E7E2DA] text-[#5F5F5F] hover:border-[#C4BAB0] bg-white"
                        )}
                      >
                        {d}h
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full"
                  disabled={!time}
                  onClick={() => setStep(2)}
                >
                  Continue {time && `· ${formatPrice(total)}`}
                </Button>
              </motion.div>
            )}

            {/* Step 2: Confirm & Pay */}
            {step === 2 && (
              <motion.div
                key="s2"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-4"
              >
                {/* Booking summary */}
                <div className="rounded-2xl border-2 border-[#E7E2DA] bg-[#F4F1EB] p-4 space-y-2.5 text-sm">
                  {(
                    [
                      ["Turf", turf.name],
                      ["Sport", `${SPORTS_CONFIG[sport].emoji} ${SPORTS_CONFIG[sport].label}`],
                      ["Date", format(date, "EEE, d MMM yyyy")],
                      ["Time", formatTime(time)],
                      ["Duration", `${duration} hr${duration > 1 ? "s" : ""}`],
                    ] as [string, string][]
                  ).map(([l, v]) => (
                    <div key={l} className="flex justify-between gap-3">
                      <span className="text-[#9E9284] font-medium">{l}</span>
                      <span className="text-[#111111] font-semibold text-right">{v}</span>
                    </div>
                  ))}
                  <div className="border-t border-[#E7E2DA] pt-2.5 flex justify-between">
                    <span className="text-[#111111] font-bold">Total</span>
                    <span className="text-[#0D4D36] font-bold text-base">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* TurfCoins preview */}
                {turf.rewards_enabled && (turf.coins_per_booking ?? 0) > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#0D4D36]/6 border border-[#0D4D36]/15 text-xs">
                    <Coins className="h-3.5 w-3.5 text-[#0D4D36] shrink-0" />
                    <span className="text-[#5F5F5F]">
                      You&apos;ll earn{" "}
                      <span className="text-[#0D4D36] font-bold">
                        {turf.coins_per_booking} TurfCoins
                      </span>{" "}
                      for this booking
                    </span>
                  </div>
                )}

                {/* Payment method badge */}
                {RAZORPAY_ENABLED && (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs">
                    <CreditCard className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    <span className="text-[#5F5F5F]">Pay via UPI, cards, net banking, or wallets</span>
                  </div>
                )}

                {error && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
                    {error}
                  </p>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 gap-1"
                    onClick={() => setStep(1)}
                  >
                    <ChevronLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handlePayAndBook}
                    loading={loading}
                  >
                    {RAZORPAY_ENABLED ? "Pay & Confirm" : "Confirm"}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <motion.div
                key="s3"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4 space-y-5"
              >
                <div className="w-16 h-16 rounded-full bg-[#0D4D36]/10 border-2 border-[#0D4D36]/20 flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-[#0D4D36]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#111111] text-lg">Booking confirmed!</h3>
                  <p className="text-sm text-[#5F5F5F] mt-1">
                    {format(date, "EEE, d MMM")} · {formatTime(time)}
                  </p>
                </div>
                <div className="rounded-2xl border-2 border-[#E7E2DA] bg-[#F4F1EB] p-4 text-sm space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-[#9E9284] font-medium">Turf</span>
                    <span className="text-[#111111] font-semibold">{turf.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9E9284] font-medium">Amount</span>
                    <span className="text-[#0D4D36] font-bold">{formatPrice(total)}</span>
                  </div>
                  {turf.rewards_enabled && (turf.coins_per_booking ?? 0) > 0 && (
                    <div className="flex justify-between border-t border-[#E7E2DA] pt-2.5">
                      <span className="text-[#9E9284] flex items-center gap-1 font-medium">
                        <Coins className="h-3 w-3" /> Earned
                      </span>
                      <span className="text-[#0D4D36] font-bold">
                        +{turf.coins_per_booking} TurfCoins
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      onClose();
                      router.push("/dashboard/user/bookings");
                    }}
                  >
                    My Bookings
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
