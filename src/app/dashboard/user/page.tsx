"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  { href: "/turfs",                        icon: MapPin,          label: "Find Turfs",   desc: "Browse nearby venues"    },
  { href: "/dashboard/user/bookings",      icon: Calendar,        label: "My Bookings",  desc: "View all reservations"   },
  { href: "/dashboard/user/favorites",     icon: Heart,           label: "Favorites",    desc: "Saved turfs"             },
  { href: "/dashboard/user/profile",       icon: User,            label: "Profile",      desc: "Edit your info"          },
];

export default function UserDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favCount, setFavCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    if (user.role === "owner") { router.push("/dashboard/owner"); return; }
    (async () => {
      const sb = createClient();
      const [b, f] = await Promise.all([
        sb.from("bookings").select("*, turf:turfs(*)").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3),
        sb.from("favorites").select("id", { count: "exact" }).eq("user_id", user.id),
      ]);
      setBookings((b.data as Booking[]) || []);
      setFavCount(f.count || 0);
      setLoading(false);
    })();
  }, [user, router]);

  if (!user) return null;

  const confirmed = bookings.filter((b) => b.status === "confirmed").length;

  return (
    <div className="min-h-screen pt-14 pb-24 md:pb-8">
      {/* Profile strip */}
      <div className="border-b border-white/[0.07] bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto px-4 py-6 flex items-center gap-4">
          <Avatar className="h-12 w-12 shrink-0">
            <AvatarImage src={user.avatar_url} />
            <AvatarFallback className="text-base bg-emerald-500/10 text-emerald-400">{getInitials(user.full_name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-white truncate">Hi, {user.full_name.split(" ")[0]}</h1>
            <p className="text-xs text-white/40 truncate mt-0.5">{user.email}</p>
          </div>
          <Link href="/dashboard/user/profile">
            <Button variant="outline" size="sm">Edit</Button>
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Calendar, label: "Bookings",  value: bookings.length },
            { icon: Heart,    label: "Saved",     value: favCount        },
            { icon: Trophy,   label: "Confirmed", value: confirmed       },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="p-4 rounded-xl border border-white/[0.07] bg-[#111111] text-center">
              <Icon className="h-4 w-4 text-white/40 mx-auto mb-2" />
              <p className="text-xl font-bold text-white">{loading ? "—" : value}</p>
              <p className="text-xs text-white/40 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div>
          <h2 className="text-sm font-medium text-white/50 mb-3">Quick access</h2>
          <div className="space-y-1">
            {QUICK.map(({ href, icon: Icon, label, desc }) => (
              <Link key={href} href={href}>
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-colors group">
                  <div className="w-8 h-8 rounded-lg border border-white/[0.07] bg-[#111111] flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-white/50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{label}</p>
                    <p className="text-xs text-white/35">{desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white/50 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent bookings */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-white/50 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Recent Bookings
            </h2>
            <Link href="/dashboard/user/bookings">
              <Button variant="ghost" size="sm" className="text-xs text-white/40 hover:text-white gap-1">
                All <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-white/[0.04] animate-pulse" />)}</div>
          ) : bookings.length === 0 ? (
            <div className="py-12 text-center rounded-xl border border-white/[0.07]">
              <p className="text-3xl mb-3">📅</p>
              <p className="text-sm text-white/50 mb-1">No bookings yet</p>
              <p className="text-xs text-white/30 mb-5">Book a turf to get started</p>
              <Link href="/turfs"><Button size="sm">Explore Turfs</Button></Link>
            </div>
          ) : (
            <div className="space-y-2">
              {bookings.map((b) => <BookingCard key={b.id} booking={b} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
