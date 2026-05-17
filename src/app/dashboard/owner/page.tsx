"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Building2, Calendar, TrendingUp, Users, Plus, ChevronRight, Eye, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";
import { Turf, Booking } from "@/types";
import { formatPrice, getInitials } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export default function OwnerDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    if (user.role !== "owner") { router.push("/dashboard/user"); return; }
    (async () => {
      const sb = createClient();
      const [t, b] = await Promise.all([
        sb.from("turfs").select("*").eq("owner_id", user.id),
        sb.from("bookings").select("*, turf:turfs!inner(*), user:users(*)").eq("turfs.owner_id", user.id).order("created_at", { ascending: false }).limit(5),
      ]);
      const tl = (t.data as Turf[]) || [];
      const bl = (b.data as Booking[]) || [];
      setTurfs(tl);
      setBookings(bl);
      setRevenue(bl.filter((x) => x.status === "confirmed").reduce((s, x) => s + x.total_price, 0));
      setLoading(false);
    })();
  }, [user, router]);

  if (!user) return null;

  const confirmed = bookings.filter((b) => b.status === "confirmed").length;

  return (
    <div className="min-h-screen pt-14 pb-24 md:pb-8">
      {/* Profile strip */}
      <div className="border-b border-white/[0.07]">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center gap-4">
          <Avatar className="h-12 w-12 shrink-0">
            <AvatarImage src={user.avatar_url} />
            <AvatarFallback className="text-base bg-emerald-500/10 text-emerald-400">{getInitials(user.full_name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-white truncate">{user.full_name}</h1>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">Owner</span>
            </div>
            <p className="text-xs text-white/40 truncate mt-0.5">{user.email}</p>
          </div>
          <Link href="/dashboard/owner/turfs/new">
            <Button size="sm" className="gap-1.5 shrink-0"><Plus className="h-3.5 w-3.5" /> Add Turf</Button>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Building2,  label: "Turfs",     value: turfs.length      },
            { icon: Calendar,   label: "Bookings",  value: bookings.length   },
            { icon: TrendingUp, label: "Revenue",   value: formatPrice(revenue) },
            { icon: Users,      label: "Confirmed", value: confirmed         },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="p-4 rounded-xl border border-white/[0.07] bg-[#111111]">
              <Icon className="h-4 w-4 text-white/30 mb-2" />
              <p className="text-lg font-bold text-white">{loading ? "—" : value}</p>
              <p className="text-xs text-white/40 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* My Turfs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-white/50">My Turfs</h2>
            <Link href="/dashboard/owner/turfs">
              <Button variant="ghost" size="sm" className="text-xs text-white/40 hover:text-white gap-1">
                All <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-2">{[...Array(2)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-white/[0.04] animate-pulse" />)}</div>
          ) : turfs.length === 0 ? (
            <div className="py-12 text-center rounded-xl border border-white/[0.07]">
              <Building2 className="h-10 w-10 text-white/15 mx-auto mb-3" />
              <p className="text-sm text-white/50 mb-5">No turfs listed yet</p>
              <Link href="/dashboard/owner/turfs/new"><Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" /> Add Turf</Button></Link>
            </div>
          ) : (
            <div className="space-y-2">
              {turfs.slice(0, 3).map((turf) => (
                <div key={turf.id} className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.07] bg-[#111111] hover:border-white/[0.12] transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center shrink-0">
                    <Building2 className="h-4 w-4 text-white/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm truncate">{turf.name}</p>
                    <p className="text-xs text-white/35 mt-0.5">{turf.city} · {formatPrice(turf.price_per_hour)}/hr</p>
                  </div>
                  <Badge variant={turf.is_active ? "success" : "secondary"}>{turf.is_active ? "Active" : "Off"}</Badge>
                  <div className="flex gap-1">
                    <Link href={`/turfs/${turf.id}`}>
                      <Button size="icon-sm" variant="ghost"><Eye className="h-3.5 w-3.5" /></Button>
                    </Link>
                    <Link href={`/dashboard/owner/turfs/${turf.id}/edit`}>
                      <Button size="icon-sm" variant="ghost"><Edit className="h-3.5 w-3.5" /></Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-white/50">Recent Bookings</h2>
            <Link href="/dashboard/owner/bookings">
              <Button variant="ghost" size="sm" className="text-xs text-white/40 hover:text-white gap-1">
                All <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-14 rounded-xl bg-white/[0.04] animate-pulse" />)}</div>
          ) : bookings.length === 0 ? (
            <div className="py-12 text-center rounded-xl border border-white/[0.07]">
              <Calendar className="h-10 w-10 text-white/15 mx-auto mb-3" />
              <p className="text-sm text-white/50">No bookings yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {bookings.map((b) => (
                <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.07] bg-[#111111] hover:border-white/[0.12] transition-colors">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-xs bg-white/[0.05] text-white/50">{b.user ? getInitials(b.user.full_name) : "?"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm truncate">{b.user?.full_name || "Unknown"}</p>
                    <p className="text-xs text-white/35 truncate">{b.turf?.name} · {format(new Date(b.slot_date), "d MMM")} · {b.start_time}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-emerald-400">{formatPrice(b.total_price)}</p>
                    <Badge variant={b.status === "confirmed" ? "success" : b.status === "cancelled" ? "destructive" : "warning"} className="text-[10px] mt-1">
                      {b.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
