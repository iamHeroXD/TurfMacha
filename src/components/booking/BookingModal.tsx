"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, CheckCircle, ChevronLeft, X } from "lucide-react";
import { format, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Turf, Sport } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { formatPrice, formatTime, generateTimeSlots, SPORTS_CONFIG } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface BookingModalProps {
  turf: Turf;
  open: boolean;
  onClose: () => void;
}

const STEPS = ["Date & Time", "Confirm", "Done"];

export function BookingModal({ turf, open, onClose }: BookingModalProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [selectedSport, setSelectedSport] = useState<Sport>(turf.sports[0]);
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [error, setError] = useState("");

  const timeSlots = generateTimeSlots(
    turf.operating_hours_start || "06:00",
    turf.operating_hours_end || "22:00",
    60
  );

  const totalPrice = turf.price_per_hour * selectedDuration;
  const dateOptions = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  const fetchBookedSlots = async (date: Date) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("bookings")
      .select("start_time")
      .eq("turf_id", turf.id)
      .eq("slot_date", format(date, "yyyy-MM-dd"))
      .neq("status", "cancelled");
    setBookedSlots(data?.map((b) => b.start_time) || []);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime("");
    fetchBookedSlots(date);
  };

  const handleBook = async () => {
    if (!user) { router.push("/login"); return; }
    if (!selectedTime) return;
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const [h, m] = selectedTime.split(":").map(Number);
      const endHour = h + selectedDuration;
      const endTime = `${endHour.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
      const { error: bookingError } = await supabase.from("bookings").insert({
        user_id: user.id,
        turf_id: turf.id,
        slot_date: format(selectedDate, "yyyy-MM-dd"),
        start_time: selectedTime,
        end_time: endTime,
        duration_hours: selectedDuration,
        total_price: totalPrice,
        status: "confirmed",
        sport: selectedSport,
      });
      if (bookingError) {
        setError(
          bookingError.message.includes("unique")
            ? "This slot is already booked. Choose another time."
            : bookingError.message
        );
        return;
      }
      setStep(3);
    } catch {
      setError("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        {/* Step progress bar */}
        <div className="px-6 pt-6 pb-4 border-b border-white/8">
          <DialogHeader className="mb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-white">
                {step === 3 ? "Booking Confirmed!" : `Book ${turf.name}`}
              </DialogTitle>
            </div>
          </DialogHeader>

          {step < 3 && (
            <div className="flex items-center gap-2">
              {STEPS.slice(0, 2).map((label, i) => {
                const stepNum = i + 1;
                const isActive = step === stepNum;
                const isDone = step > stepNum;
                return (
                  <div key={label} className="flex items-center gap-2 flex-1">
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0",
                      isDone ? "bg-emerald-500 text-black"
                        : isActive ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-400"
                        : "bg-white/5 border border-white/10 text-white/30"
                    )}>
                      {isDone ? <CheckCircle className="h-3.5 w-3.5" /> : stepNum}
                    </div>
                    <span className={cn(
                      "text-xs font-medium transition-colors flex-1",
                      isActive ? "text-white" : isDone ? "text-emerald-400" : "text-white/30"
                    )}>
                      {label}
                    </span>
                    {i < 1 && <div className={cn("h-px flex-1 mx-1 transition-colors", step > 1 ? "bg-emerald-500/40" : "bg-white/10")} />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-6 py-5 max-h-[65vh] overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* Step 1: Date & Time */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Sport */}
                {turf.sports.length > 1 && (
                  <div>
                    <label className="text-xs text-white/50 uppercase tracking-wider mb-2.5 block">Sport</label>
                    <div className="flex flex-wrap gap-2">
                      {turf.sports.map((sport) => (
                        <button
                          key={sport}
                          onClick={() => setSelectedSport(sport)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-sm font-medium transition-all border",
                            selectedSport === sport
                              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                              : "bg-white/5 border-white/10 text-white/55 hover:bg-white/10"
                          )}
                        >
                          {SPORTS_CONFIG[sport].emoji} {SPORTS_CONFIG[sport].label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Date */}
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> Select Date
                  </label>
                  <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                    {dateOptions.map((date) => {
                      const isSelected = format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
                      const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
                      return (
                        <button
                          key={date.toISOString()}
                          onClick={() => handleDateSelect(date)}
                          className={cn(
                            "flex flex-col items-center px-3.5 py-3 rounded-xl text-sm shrink-0 transition-all border",
                            isSelected
                              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/10"
                              : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                          )}
                        >
                          <span className="text-[9px] uppercase font-semibold tracking-wider">{format(date, "EEE")}</span>
                          <span className="text-xl font-bold leading-none mt-1">{format(date, "d")}</span>
                          <span className="text-[9px] mt-0.5 opacity-70">{isToday ? "Today" : format(date, "MMM")}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time slots */}
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> Select Time
                  </label>
                  <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                    {timeSlots.map((time) => {
                      const isBooked = bookedSlots.includes(time);
                      const isSelected = selectedTime === time;
                      return (
                        <button
                          key={time}
                          onClick={() => !isBooked && setSelectedTime(time)}
                          disabled={isBooked}
                          className={cn(
                            "py-2.5 rounded-xl text-xs font-medium transition-all border",
                            isBooked
                              ? "bg-red-500/8 border-red-500/15 text-red-400/40 cursor-not-allowed line-through"
                              : isSelected
                              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/10"
                              : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                          )}
                        >
                          {isBooked ? "Taken" : formatTime(time)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider mb-2.5 block">Duration</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((dur) => (
                      <button
                        key={dur}
                        onClick={() => setSelectedDuration(dur)}
                        className={cn(
                          "py-2.5 rounded-xl text-sm font-medium transition-all border",
                          selectedDuration === dur
                            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                            : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                        )}
                      >
                        {dur} hr{dur > 1 ? "s" : ""}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full shadow-lg shadow-emerald-500/20"
                  size="lg"
                  disabled={!selectedTime}
                  onClick={() => setStep(2)}
                >
                  Continue
                  {selectedTime && (
                    <span className="ml-2 opacity-70">— {formatPrice(totalPrice)}</span>
                  )}
                </Button>
              </motion.div>
            )}

            {/* Step 2: Confirm */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="glass-card p-5 space-y-3">
                  <h4 className="font-semibold text-white text-sm">Booking Summary</h4>
                  <div className="space-y-2.5 text-sm">
                    {[
                      { label: "Turf", value: turf.name },
                      { label: "Sport", value: `${SPORTS_CONFIG[selectedSport].emoji} ${SPORTS_CONFIG[selectedSport].label}` },
                      { label: "Date", value: format(selectedDate, "EEE, d MMM yyyy") },
                      { label: "Time", value: formatTime(selectedTime) },
                      { label: "Duration", value: `${selectedDuration} hr${selectedDuration > 1 ? "s" : ""}` },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between gap-4">
                        <span className="text-white/45">{label}</span>
                        <span className="text-white font-medium text-right">{value}</span>
                      </div>
                    ))}
                    <div className="border-t border-white/8 pt-3 flex justify-between items-center">
                      <span className="text-white font-semibold">Total</span>
                      <span className="text-emerald-400 font-bold text-xl">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back
                  </Button>
                  <Button className="flex-1 shadow-lg shadow-emerald-500/20" onClick={handleBook} loading={loading}>
                    Confirm Booking
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center mx-auto"
                >
                  <CheckCircle className="h-10 w-10 text-emerald-400" />
                </motion.div>

                <div>
                  <h3 className="text-xl font-bold text-white">Booked!</h3>
                  <p className="text-white/50 text-sm mt-1">
                    {format(selectedDate, "EEE, d MMM")} at {formatTime(selectedTime)}
                  </p>
                </div>

                <div className="glass-card p-4 text-sm space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-white/45">Turf</span>
                    <span className="text-white font-medium text-right">{turf.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/45">Total paid</span>
                    <span className="text-emerald-400 font-bold">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={onClose}>
                    Close
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => { onClose(); router.push("/dashboard/user/bookings"); }}
                  >
                    View Bookings
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
