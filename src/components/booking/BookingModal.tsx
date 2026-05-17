"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Clock, CheckCircle, ChevronLeft } from "lucide-react";
import { format, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Turf, Sport } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { formatPrice, formatTime, generateTimeSlots, SPORTS_CONFIG } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface BookingModalProps { turf: Turf; open: boolean; onClose: () => void; }

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

  const slots = generateTimeSlots(turf.operating_hours_start || "06:00", turf.operating_hours_end || "22:00");
  const total = turf.price_per_hour * duration;
  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  const fetchBooked = async (d: Date) => {
    const { data } = await createClient().from("bookings").select("start_time")
      .eq("turf_id", turf.id).eq("slot_date", format(d, "yyyy-MM-dd")).neq("status", "cancelled");
    setBooked(data?.map((b) => b.start_time) || []);
  };

  const onDateSelect = (d: Date) => { setDate(d); setTime(""); fetchBooked(d); };

  const handleBook = async () => {
    if (!user) { router.push("/login"); return; }
    setLoading(true); setError("");
    try {
      const [h] = time.split(":").map(Number);
      const end = `${String(h + duration).padStart(2, "0")}:${time.split(":")[1]}`;
      const { error: err } = await createClient().from("bookings").insert({
        user_id: user.id, turf_id: turf.id, slot_date: format(date, "yyyy-MM-dd"),
        start_time: time, end_time: end, duration_hours: duration,
        total_price: total, status: "confirmed", sport,
      });
      if (err) { setError(err.message.includes("unique") ? "Slot already booked — pick another time." : err.message); return; }
      setStep(3);
    } catch { setError("Booking failed. Try again."); }
    finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm w-[calc(100vw-2rem)] mx-auto">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-white/[0.07]">
          <DialogHeader>
            <DialogTitle>{step === 3 ? "Booking Confirmed" : `Book — ${turf.name}`}</DialogTitle>
          </DialogHeader>
          {step < 3 && (
            <div className="flex items-center gap-2 mt-3">
              {["Date & Time", "Confirm"].map((label, i) => {
                const n = i + 1;
                return (
                  <div key={label} className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 border",
                      step > n ? "bg-emerald-500 text-black border-emerald-500"
                        : step === n ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10"
                        : "border-white/[0.09] text-white/30"
                    )}>
                      {step > n ? "✓" : n}
                    </div>
                    <span className={cn("text-xs truncate", step === n ? "text-white" : "text-white/30")}>{label}</span>
                    {i < 1 && <div className={cn("h-px flex-1 mx-1", step > 1 ? "bg-emerald-500/30" : "bg-white/[0.07]")} />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-5 py-5 overflow-y-auto max-h-[60vh]">
          <AnimatePresence mode="wait">

            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-5">
                {/* Sport */}
                {turf.sports.length > 1 && (
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Sport</p>
                    <div className="flex flex-wrap gap-2">
                      {turf.sports.map((s) => (
                        <button key={s} onClick={() => setSport(s)}
                          className={cn("px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors",
                            sport === s ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" : "border-white/[0.09] text-white/50 hover:text-white hover:border-white/[0.15]"
                          )}>
                          {SPORTS_CONFIG[s].emoji} {SPORTS_CONFIG[s].label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Date */}
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Date</p>
                  <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                    {dates.map((d) => {
                      const sel = format(d, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
                      const today = format(d, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
                      return (
                        <button key={d.toISOString()} onClick={() => onDateSelect(d)}
                          className={cn("flex flex-col items-center px-3 py-2.5 rounded-lg border text-xs shrink-0 transition-colors",
                            sel ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" : "border-white/[0.09] text-white/60 hover:border-white/[0.15]"
                          )}>
                          <span className="text-[9px] uppercase font-semibold tracking-wider">{format(d, "EEE")}</span>
                          <span className="text-lg font-bold leading-none mt-0.5">{format(d, "d")}</span>
                          <span className="text-[9px] mt-0.5 opacity-60">{today ? "Today" : format(d, "MMM")}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time */}
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Clock className="h-3 w-3" /> Time</p>
                  <div className="grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto">
                    {slots.map((s) => {
                      const isB = booked.includes(s), isSel = time === s;
                      return (
                        <button key={s} onClick={() => !isB && setTime(s)} disabled={isB}
                          className={cn("py-2 rounded-lg border text-xs font-medium transition-colors",
                            isB ? "border-white/[0.04] text-white/20 line-through cursor-not-allowed"
                              : isSel ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                              : "border-white/[0.09] text-white/60 hover:border-white/[0.15] hover:text-white"
                          )}>
                          {isB ? "—" : formatTime(s)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Duration</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((d) => (
                      <button key={d} onClick={() => setDuration(d)}
                        className={cn("py-2 rounded-lg border text-sm font-medium transition-colors",
                          duration === d ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" : "border-white/[0.09] text-white/60 hover:border-white/[0.15]"
                        )}>
                        {d}h
                      </button>
                    ))}
                  </div>
                </div>

                <Button className="w-full" disabled={!time} onClick={() => setStep(2)}>
                  Continue {time && `· ${formatPrice(total)}`}
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-4">
                <div className="rounded-xl border border-white/[0.07] bg-[#0e0e0e] p-4 space-y-2.5 text-sm">
                  {[
                    ["Turf", turf.name],
                    ["Sport", `${SPORTS_CONFIG[sport].emoji} ${SPORTS_CONFIG[sport].label}`],
                    ["Date", format(date, "EEE, d MMM yyyy")],
                    ["Time", formatTime(time)],
                    ["Duration", `${duration} hr${duration > 1 ? "s" : ""}`],
                  ].map(([l, v]) => (
                    <div key={l} className="flex justify-between gap-3">
                      <span className="text-white/40">{l}</span>
                      <span className="text-white font-medium text-right">{v}</span>
                    </div>
                  ))}
                  <div className="border-t border-white/[0.07] pt-2.5 flex justify-between">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-emerald-400 font-bold text-base">{formatPrice(total)}</span>
                  </div>
                </div>

                {error && <p className="text-xs text-red-400 bg-red-500/8 border border-red-500/20 rounded-lg p-3">{error}</p>}

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 gap-1" onClick={() => setStep(1)}>
                    <ChevronLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button className="flex-1" onClick={handleBook} loading={loading}>
                    Confirm
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4 space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Booking confirmed!</h3>
                  <p className="text-sm text-white/50 mt-1">{format(date, "EEE, d MMM")} · {formatTime(time)}</p>
                </div>
                <div className="rounded-xl border border-white/[0.07] p-4 text-sm space-y-2">
                  <div className="flex justify-between"><span className="text-white/40">Turf</span><span className="text-white">{turf.name}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Paid</span><span className="text-emerald-400 font-bold">{formatPrice(total)}</span></div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={onClose}>Close</Button>
                  <Button className="flex-1" onClick={() => { onClose(); router.push("/dashboard/user/bookings"); }}>My Bookings</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
