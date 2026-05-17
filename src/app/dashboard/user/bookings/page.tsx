"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { BookingCard } from "@/components/booking/BookingCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";
import { Booking } from "@/types";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BookingsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (!user) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("bookings")
      .select("*, turf:turfs(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setBookings((data as Booking[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    fetchBookings();
  }, [user]);

  const upcoming = bookings.filter((b) => b.status !== "cancelled" && new Date(`${b.slot_date} ${b.start_time}`) >= new Date());
  const past = bookings.filter((b) => b.status === "cancelled" || new Date(`${b.slot_date} ${b.start_time}`) < new Date());

  return (
    <div className="min-h-screen pt-14 pb-24 md:pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-brand-400" />
            My Bookings
          </h1>

          <Tabs defaultValue="upcoming">
            <TabsList className="w-full">
              <TabsTrigger value="upcoming" className="flex-1">
                Upcoming ({upcoming.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="flex-1">
                Past & Cancelled ({past.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {loading ? (
                <div className="space-y-3 mt-4">
                  {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
                </div>
              ) : upcoming.length === 0 ? (
                <div className="glass-card p-12 text-center mt-4">
                  <div className="text-5xl mb-4">📅</div>
                  <p className="text-white/60">No upcoming bookings</p>
                  <Link href="/turfs">
                    <Button className="mt-4">Book a Turf</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3 mt-4">
                  {upcoming.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} onCancel={fetchBookings} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past">
              {loading ? (
                <div className="space-y-3 mt-4">
                  {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
                </div>
              ) : past.length === 0 ? (
                <div className="glass-card p-12 text-center mt-4">
                  <p className="text-white/60">No past bookings</p>
                </div>
              ) : (
                <div className="space-y-3 mt-4">
                  {past.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
