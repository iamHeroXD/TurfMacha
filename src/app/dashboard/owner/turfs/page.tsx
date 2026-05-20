"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Eye, Trash2, Building2, AlertTriangle, ToggleLeft, ToggleRight } from "lucide-react";
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchTurfs = async () => {
    if (!user) return;
    const { data } = await createClient()
      .from("turfs").select("*").eq("owner_id", user.id)
      .order("created_at", { ascending: false });
    setTurfs((data as Turf[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    if (user.role !== "owner") { router.push("/dashboard/user"); return; }
    fetchTurfs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const toggleActive = async (turf: Turf) => {
    await createClient().from("turfs").update({ is_active: !turf.is_active }).eq("id", turf.id);
    setTurfs((prev) => prev.map((t) => t.id === turf.id ? { ...t, is_active: !turf.is_active } : t));
    toast({ title: turf.is_active ? "Turf deactivated" : "Turf activated" });
  };

  const deleteTurf = async (id: string) => {
    setDeletingId(id);
    const { error } = await createClient().from("turfs").delete().eq("id", id);
    if (!error) {
      setTurfs((prev) => prev.filter((t) => t.id !== id));
      toast({ title: "Turf deleted" });
    } else {
      toast({ title: "Delete failed", variant: "destructive" });
    }
    setDeletingId(null);
    setConfirmDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-[#F4F1EB] pt-14 pb-24 md:pb-8">

      <div className="bg-white border-b border-[#E7E2DA]">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-xl text-[#111111]">My Turfs</h1>
            <p className="text-sm text-[#5F5F5F] mt-0.5">
              {loading ? "Loading…" : `${turfs.length} turf${turfs.length !== 1 ? "s" : ""} listed`}
            </p>
          </div>
          <Link href="/dashboard/owner/turfs/new">
            <Button className="gap-1.5 rounded-xl bg-[#0D4D36] shadow-md shadow-[#0D4D36]/20">
              <Plus className="h-4 w-4" /> Add Turf
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
        ) : turfs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-[#E7E2DA] p-14 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#F4F1EB] border border-[#E7E2DA] flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-8 w-8 text-[#C4BAB0]" />
            </div>
            <h3 className="text-base font-display font-bold text-[#111111] mb-1">No turfs listed yet</h3>
            <p className="text-sm text-[#5F5F5F] mb-6">Add your first venue to start receiving bookings</p>
            <Link href="/dashboard/owner/turfs/new">
              <Button className="gap-1.5 rounded-xl bg-[#0D4D36]">
                <Plus className="h-4 w-4" /> Add Turf
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {turfs.map((turf, i) => (
              <motion.div
                key={turf.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl border border-[#E7E2DA] overflow-hidden hover:border-[#C4BAB0] transition-colors"
              >
                <div className="flex items-center gap-4 p-4">
                  <Link href={`/turfs/${turf.id}`} className="shrink-0">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#F4F1EB]">
                      <Image
                        src={turf.images?.[0] || `https://picsum.photos/seed/${turf.id}/200/200`}
                        alt={turf.name} fill className="object-cover" sizes="64px"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-[#111111] text-sm truncate">{turf.name}</h3>
                      <Badge variant={turf.is_active ? "success" : "secondary"} className="text-[10px]">
                        {turf.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#9E9284] mt-0.5">{turf.city}, {turf.state}</p>
                    <div className="flex items-center gap-2.5 mt-1.5 text-xs text-[#5F5F5F]">
                      <span className="font-semibold text-[#0D4D36]">{formatPrice(turf.price_per_hour)}/hr</span>
                      <span className="text-[#C4BAB0]">·</span>
                      <span>⭐ {turf.rating > 0 ? turf.rating.toFixed(1) : "New"}</span>
                      <span className="text-[#C4BAB0]">·</span>
                      <span>{turf.sports.length} sport{turf.sports.length !== 1 ? "s" : ""}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-1">
                      <Link href={`/turfs/${turf.id}`}>
                        <Button size="icon-sm" variant="ghost" aria-label="View" className="text-[#9E9284] hover:text-[#0D4D36]">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/owner/turfs/${turf.id}/edit`}>
                        <Button size="icon-sm" variant="ghost" aria-label="Edit" className="text-[#9E9284] hover:text-[#0D4D36]">
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Button
                        size="icon-sm" variant="ghost" aria-label="Delete"
                        className="text-[#9E9284] hover:text-red-500 hover:bg-red-50"
                        onClick={() => setConfirmDeleteId(confirmDeleteId === turf.id ? null : turf.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <button
                      onClick={() => toggleActive(turf)}
                      className="flex items-center gap-1 text-xs font-semibold transition-colors"
                      style={{ color: turf.is_active ? "#0D4D36" : "#9E9284" }}
                    >
                      {turf.is_active
                        ? <ToggleRight className="h-4 w-4" />
                        : <ToggleLeft className="h-4 w-4" />}
                      {turf.is_active ? "Active" : "Off"}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {confirmDeleteId === turf.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mx-4 mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200">
                        <div className="flex items-start gap-2 mb-3">
                          <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-red-800">Delete &quot;{turf.name}&quot;?</p>
                            <p className="text-xs text-red-600 mt-0.5">
                              Removes this turf listing. Existing bookings are not affected.
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setConfirmDeleteId(null)}
                            disabled={deletingId === turf.id}
                            className="flex-1 h-8 text-xs rounded-lg border-red-200 text-[#5F5F5F]">
                            Keep
                          </Button>
                          <Button size="sm" onClick={() => deleteTurf(turf.id)}
                            loading={deletingId === turf.id}
                            className="flex-1 h-8 text-xs rounded-lg bg-red-600 hover:bg-red-700 text-white">
                            Delete
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
