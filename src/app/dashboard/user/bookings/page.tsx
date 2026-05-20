"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { BookingCard } from "@/components/booking/BookingCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";
import { Booking } from "@/types";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BookingsPage() {
  const { user }   = useAuthStore();
  const router     = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading,  setLoading]  = useState(true);

  const fetchBookings = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("bookings")
      .select("*, turf:turfs(*)")
      .eq("user_id", user.id)
      .order("slot_date", { ascending: false });
    setBookings((data as Booking[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    fetchBookings();
  }, [user, router, fetchBookings]);

  const upcoming = bookings.filter(
    (b) => b.status !== "cancelled" && new Date(`${b.slot_date}T${b.start_time}`) >= new Date()
  );
  const past = bookings.filter(
    (b) => b.status === "cancelled" || new Date(`${b.slot_date}T${b.start_time}`) < new Date()
  );

  return (
    <div className="min-h-screen bg-[#FAF7F0] pt-14 pb-24 md:pb-8">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <h1 className="font-display font-bold text-2xl text-[#0B3D2E] flex items-center gap-2">
            <Calendar className="h-6 w-6" /> My Bookings
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Tabs defaultValue="upcoming">
            <TabsList className="w-full bg-gray-100 rounded-xl p-1 mb-6">
              <TabsTrigger value="upcoming" className="flex-1 rounded-lg data-[state=active]:bg-[#0B3D2E] data-[state=active]:text-white font-semibold">
                Upcoming ({upcoming.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="flex-1 rounded-lg data-[state=active]:bg-[#0B3D2E] data-[state=active]:text-white font-semibold">
                Past &amp; Cancelled ({past.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-2xl skeleton" />)}
                </div>
              ) : upcoming.length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-14 text-center">
                  <div className="text-5xl mb-4">📅</div>
                  <p className="font-semibold text-[#1F2937] mb-1">No upcoming bookings</p>
                  <p className="text-sm text-[#9CA3AF] mb-5">Ready for your next game?</p>
                  <Link href="/turfs">
                    <Button className="rounded-xl">Book a Turf</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcoming.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} onCancel={fetchBookings} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-2xl skeleton" />)}
                </div>
              ) : past.length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-14 text-center">
                  <p className="text-[#9CA3AF]">No past bookings yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {past.map((booking) => <BookingCard key={booking.id} booking={booking} />)}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
