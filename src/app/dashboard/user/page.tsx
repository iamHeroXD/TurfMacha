"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Heart, Trophy, ChevronRight, MapPin, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingCard } from "@/components/booking/BookingCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";
import { Booking } from "@/types";
import { getInitials } from "@/lib/utils";
import { useRouter } from "next/navigation";

const QUICK = [
  { href: "/turfs",                    icon: MapPin,   label: "Find Turfs",  desc: "Browse nearby venues"   },
  { href: "/dashboard/user/bookings",  icon: Calendar, label: "My Bookings", desc: "View all reservations"  },
  { href: "/dashboard/user/favorites", icon: Heart,    label: "Favorites",   desc: "Saved turfs"            },
  { href: "/dashboard/user/profile",   icon: User,     label: "Profile",     desc: "Edit your info"         },
];

export default function UserDashboard() {
  const { user }  = useAuthStore();
  const router    = useRouter();
  const [bookings,  setBookings]  = useState<Booking[]>([]);
  const [favCount,  setFavCount]  = useState(0);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    if (user.role === "owner") { router.push("/dashboard/owner"); return; }
    (async () => {
      const sb = createClient();
      const [b, f] = await Promise.all([
        sb.from("bookings").select("*, turf:turfs(*)").eq("user_id", user.id)
          .order("created_at", { ascending: false }).limit(3),
        sb.from("favorites").select("id", { count: "exact" }).eq("user_id", user.id),
      ]);
      setBookings((b.data as Booking[]) || []);
      setFavCount(f.count || 0);
      setLoading(false);
    })();
  }, [user, router]);

  if (!user) return null;

  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const STATS = [
    { icon: Calendar, label: "Bookings",  value: bookings.length },
    { icon: Heart,    label: "Saved",     value: favCount        },
    { icon: Trophy,   label: "Confirmed", value: confirmed       },
  ];

  return (
    <div className="min-h-screen bg-[#F4F1EB] pt-14 pb-24 md:pb-8">

      {/* Profile banner */}
      <div className="bg-white border-b border-[#E7E2DA]">
        <div className="max-w-3xl mx-auto px-4 py-6 flex items-center gap-4">
          <Avatar className="h-12 w-12 shrink-0 ring-2 ring-[#0D4D36]/15">
            <AvatarImage src={user.avatar_url} />
            <AvatarFallback className="text-sm bg-[#0D4D36]/10 text-[#0D4D36] font-bold">
              {getInitials(user.full_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-[#111111] truncate">
              Hi, {user.full_name.split(" ")[0]} 👋
            </h1>
            <p className="text-xs text-[#9E9284] truncate mt-0.5">{user.email}</p>
          </div>
          <Link href="/dashboard/user/profile">
            <Button variant="outline" size="sm" className="rounded-xl border-[#E7E2DA]">Edit</Button>
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {STATS.map(({ icon: Icon, label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.07, duration: 0.3 }}
              className="p-5 rounded-2xl border-2 border-[#E7E2DA] bg-white text-center hover:border-[#0D4D36]/15 hover:shadow-md hover:shadow-[#0D4D36]/5 transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-[#0D4D36]/8 flex items-center justify-center mx-auto mb-3">
                <Icon className="h-4 w-4 text-[#0D4D36]" />
              </div>
              <p className="text-2xl font-display font-extrabold text-[#111111] tabular-nums">
                {loading ? "—" : value}
              </p>
              <p className="text-xs text-[#9E9284] mt-0.5 font-medium">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick links */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <p className="text-xs font-bold text-[#9E9284] uppercase tracking-wider mb-4">Quick access</p>
          <div className="space-y-2">
            {QUICK.map(({ href, icon: Icon, label, desc }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.33 + i * 0.05 }}
              >
                <Link href={href}>
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border-2 border-[#E7E2DA] hover:border-[#0D4D36]/15 hover:shadow-sm transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-[#0D4D36]/8 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-[#0D4D36]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#111111]">{label}</p>
                      <p className="text-xs text-[#9E9284]">{desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[#C4BAB0] group-hover:text-[#0D4D36] transition-colors" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent bookings */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-[#9E9284] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Recent Bookings
            </p>
            <Link href="/dashboard/user/bookings">
              <Button variant="ghost" size="sm" className="text-xs text-[#0D4D36] gap-1 h-7 rounded-xl">
                All <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-2.5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 rounded-2xl skeleton" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-14 text-center rounded-2xl border-2 border-dashed border-[#E7E2DA] bg-white">
              <p className="text-3xl mb-3">📅</p>
              <p className="text-sm font-semibold text-[#111111] mb-1">No bookings yet</p>
              <p className="text-xs text-[#9E9284] mb-5">Book a turf to get started</p>
              <Link href="/turfs">
                <Button size="sm" className="rounded-xl">Explore Turfs</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {bookings.map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.07 }}
                >
                  <BookingCard booking={b} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}