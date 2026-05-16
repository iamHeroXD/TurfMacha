"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { format, addDays, isBefore, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Turf, Sport } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { formatPrice, formatTime, generateTimeSlots, SPORTS_CONFIG } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface BookingModalProps {
  turf: Turf;
  open: boolean;
  onClose: () => void;
}

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
  const [success, setSuccess] = useState(false);

  const timeSlots = generateTimeSlots(
    turf.operating_hours_start || "06:00",
    turf.operating_hours_end || "22:00",
    60
  );

  const totalPrice = turf.price_per_hour * selectedDuration;

  const fetchBookedSlots = async (date: Date) => {
    const supabase = createClient();
    const dateStr = format(date, "yyyy-MM-dd");
    const { data } = await supabase
      .from("bookings")
      .select("start_time")
      .eq("turf_id", turf.id)
      .eq("slot_date", dateStr)
      .neq("status", "cancelled");

    setBookedSlots(data?.map((b) => b.start_time) || []);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime("");
    fetchBookedSlots(date);
  };

  const handleBook = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!selectedTime) return;

    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const dateStr = format(selectedDate, "yyyy-MM-dd");

      // Calculate end time
      const [h, m] = selectedTime.split(":").map(Number);
      const endHour = h + selectedDuration;
      const endTime = `${endHour.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;

      const { error: bookingError } = await supabase.from("bookings").insert({
        user_id: user.id,
        turf_id: turf.id,
        slot_date: dateStr,
        start_time: selectedTime,
        end_time: endTime,
        duration_hours: selectedDuration,
        total_price: totalPrice,
        status: "confirmed",
        sport: selectedSport,
      });

      if (bookingError) {
        if (bookingError.message.includes("unique")) {
          setError("This slot is already booked. Please choose another time.");
        } else {
          setError(bookingError.message);
        }
        return;
      }

      setSuccess(true);
      setStep(3);
    } catch (err) {
      setError("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const dateOptions = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 3 ? "Booking Confirmed!" : `Book ${turf.name}`}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* Step 1: Date & Time */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              {/* Sport Selection */}
              <div>
                <label className="text-sm text-white/60 mb-2 block">Sport</label>
                <div className="flex flex-wrap gap-2">
                  {turf.sports.map((sport) => (
                    <button
                      key={sport}
                      onClick={() => setSelectedSport(sport)}
                      className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                        selectedSport === sport
                          ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                          : "bg-white/5 border border-white/10 text-white/50 hover:bg-white/10"
                      }`}
                    >
                      {SPORTS_CONFIG[sport].emoji} {SPORTS_CONFIG[sport].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="text-sm text-white/60 mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Select Date
                </label>
                <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                  {dateOptions.map((date) => {
                    const isSelected = format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
                    const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => handleDateSelect(date)}
                        className={`flex flex-col items-center px-3 py-2.5 rounded-xl text-sm shrink-0 transition-all ${
                          isSelected
                            ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                            : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        <span className="text-[10px] uppercase font-medium">{format(date, "EEE")}</span>
                        <span className="text-lg font-bold leading-none mt-0.5">{format(date, "d")}</span>
                        <span className="text-[10px]">{isToday ? "Today" : format(date, "MMM")}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <label className="text-sm text-white/60 mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Select Time
                </label>
                <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto">
                  {timeSlots.map((time) => {
                    const isBooked = bookedSlots.includes(time);
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        onClick={() => !isBooked && setSelectedTime(time)}
                        disabled={isBooked}
                        className={`py-2 rounded-xl text-xs font-medium transition-all ${
                          isBooked
                            ? "bg-red-500/10 border border-red-500/20 text-red-400/50 cursor-not-allowed"
                            : isSelected
                            ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                            : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        {isBooked ? "Booked" : formatTime(time)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="text-sm text-white/60 mb-2 block">Duration</label>
                <div className="flex gap-2">
                  {[1, 2, 3].map((dur) => (
                    <button
                      key={dur}
                      onClick={() => setSelectedDuration(dur)}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedDuration === dur
                          ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                          : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      {dur}h
                    </button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full"
                disabled={!selectedTime}
                onClick={() => setStep(2)}
              >
                Continue → {selectedTime && `${formatPrice(totalPrice)}`}
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
              <div className="glass-card p-4 space-y-3">
                <h4 className="font-semibold text-white">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/50">Turf</span>
                    <span className="text-white font-medium">{turf.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Sport</span>
                    <span className="text-white">{SPORTS_CONFIG[selectedSport].emoji} {SPORTS_CONFIG[selectedSport].label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Date</span>
                    <span className="text-white">{format(selectedDate, "EEE, d MMM yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Time</span>
                    <span className="text-white">{formatTime(selectedTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Duration</span>
                    <span className="text-white">{selectedDuration} hour{selectedDuration > 1 ? "s" : ""}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between">
                    <span className="text-white/70 font-semibold">Total</span>
                    <span className="text-emerald-400 font-bold text-lg">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
                <Button className="flex-1" onClick={handleBook} loading={loading}>
                  Confirm Booking
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-5 py-4"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <Check className="h-10 w-10 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Booking Confirmed!</h3>
                <p className="text-white/50 text-sm mt-1">
                  {format(selectedDate, "EEE, d MMM")} at {formatTime(selectedTime)}
                </p>
              </div>
              <div className="glass-card p-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/50">Turf</span>
                  <span className="text-white">{turf.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Amount paid</span>
                  <span className="text-emerald-400 font-bold">{formatPrice(totalPrice)}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  Close
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    onClose();
                    router.push("/dashboard/user/bookings");
                  }}
                >
                  View Bookings
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
