"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Edit, Eye, Trash2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";
import { Turf } from "@/types";
import { formatPrice } from "@/lib/utils";
import { toast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";

export default function OwnerTurfsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTurfs = async () => {
    if (!user) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("turfs")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });
    setTurfs((data as Turf[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    fetchTurfs();
  }, [user]);

  const toggleActive = async (turf: Turf) => {
    const supabase = createClient();
    await supabase.from("turfs").update({ is_active: !turf.is_active }).eq("id", turf.id);
    setTurfs(turfs.map((t) => (t.id === turf.id ? { ...t, is_active: !t.is_active } : t)));
    toast({ title: turf.is_active ? "Turf deactivated" : "Turf activated" });
  };

  const deleteTurf = async (id: string) => {
    if (!confirm("Are you sure you want to delete this turf?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("turfs").delete().eq("id", id);
    if (!error) {
      setTurfs(turfs.filter((t) => t.id !== id));
      toast({ title: "Turf deleted" });
    }
  };

  return (
    <div className="min-h-screen pt-14 pb-24 md:pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-white">
            My Turfs
          </motion.h1>
          <Link href="/dashboard/owner/turfs/new">
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Turf</Button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
          </div>
        ) : turfs.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Building2 className="h-16 w-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No turfs yet</h3>
            <p className="text-white/40 text-sm mb-6">Add your first turf to start getting bookings</p>
            <Link href="/dashboard/owner/turfs/new">
              <Button className="gap-2"><Plus className="h-4 w-4" /> Add Turf</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {turfs.map((turf, i) => (
              <motion.div
                key={turf.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-4 flex items-center gap-4"
              >
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={turf.images?.[0] || `https://picsum.photos/seed/${turf.id}/200/200`}
                    alt={turf.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-white truncate">{turf.name}</h3>
                    <Badge variant={turf.is_active ? "success" : "secondary"}>
                      {turf.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-xs text-white/40 mt-1">{turf.city}, {turf.state}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-white/50">
                    <span>{formatPrice(turf.price_per_hour)}/hr</span>
                    <span>·</span>
                    <span>⭐ {turf.rating?.toFixed(1) || "New"}</span>
                    <span>·</span>
                    <span>{turf.sports.length} sport{turf.sports.length !== 1 ? "s" : ""}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <div className="flex gap-1">
                    <Link href={`/turfs/${turf.id}`}>
                      <Button size="icon-sm" variant="ghost" title="View">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/owner/turfs/${turf.id}/edit`}>
                      <Button size="icon-sm" variant="ghost" title="Edit">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <Button size="icon-sm" variant="ghost" className="text-red-400" onClick={() => deleteTurf(turf.id)} title="Delete">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant={turf.is_active ? "outline" : "default"}
                    className="text-xs h-7"
                    onClick={() => toggleActive(turf)}
                  >
                    {turf.is_active ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
