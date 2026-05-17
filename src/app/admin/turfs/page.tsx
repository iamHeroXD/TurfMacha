"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Building2, Star, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { toast } from "@/hooks/useToast";
import { Turf } from "@/types";

export default function AdminTurfsPage() {
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTurfs = useCallback(async () => {
    const sb = createClient();
    const { data } = await sb.from("turfs").select("*").order("created_at", { ascending: false });
    setTurfs((data as Turf[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchTurfs(); }, [fetchTurfs]);

  const toggleFeatured = async (t: Turf) => {
    const sb = createClient();
    await sb.from("turfs").update({ is_featured: !t.is_featured }).eq("id", t.id);
    setTurfs(turfs.map(x => x.id === t.id ? { ...x, is_featured: !t.is_featured } : x));
    toast({ title: t.is_featured ? "Removed from featured" : "Marked as featured" });
  };

  const toggleActive = async (t: Turf) => {
    const sb = createClient();
    await sb.from("turfs").update({ is_active: !t.is_active }).eq("id", t.id);
    setTurfs(turfs.map(x => x.id === t.id ? { ...x, is_active: !t.is_active } : x));
    toast({ title: t.is_active ? "Turf deactivated" : "Turf activated" });
  };

  const deleteTurf = async (id: string) => {
    if (!confirm("Delete this turf? All bookings will be cancelled.")) return;
    const sb = createClient();
    await sb.from("turfs").delete().eq("id", id);
    setTurfs(turfs.filter(x => x.id !== id));
    toast({ title: "Turf deleted" });
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Building2 className="h-6 w-6 text-brand-400" /> Turfs
        </h1>
        <p className="text-sm text-white/40 mt-0.5">{turfs.length} listings</p>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(8)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      ) : (
        <div className="space-y-2">
          {turfs.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.07] bg-[#111111]"
            >
              <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={t.images?.[0] || `https://picsum.photos/seed/${t.id}/200/200`}
                  alt={t.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-white text-sm truncate">{t.name}</p>
                  {t.is_featured && <Badge variant="success" className="text-[10px]">Featured</Badge>}
                  {!t.is_active && <Badge variant="secondary" className="text-[10px]">Inactive</Badge>}
                </div>
                <p className="text-xs text-white/35">{t.city} · {formatPrice(t.price_per_hour)}/hr · <Star className="inline h-3 w-3" /> {t.rating || "New"}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Link href={`/turfs/${t.id}`}>
                  <Button size="icon-sm" variant="ghost" title="View"><Eye className="h-3.5 w-3.5" /></Button>
                </Link>
                <Button size="icon-sm" variant="ghost" onClick={() => toggleFeatured(t)} title={t.is_featured ? "Unfeature" : "Feature"} className={t.is_featured ? "text-amber-400" : "text-white/40"}>
                  ★
                </Button>
                <Button size="icon-sm" variant={t.is_active ? "outline" : "default"} className="text-xs h-7 px-2" onClick={() => toggleActive(t)}>
                  {t.is_active ? "Off" : "On"}
                </Button>
                <Button size="icon-sm" variant="ghost" className="text-red-400" onClick={() => deleteTurf(t.id)} title="Delete">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
