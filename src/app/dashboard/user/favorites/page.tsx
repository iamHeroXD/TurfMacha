"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { TurfCard } from "@/components/turf/TurfCard";
import { TurfGridSkeleton } from "@/components/turf/TurfCardSkeleton";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";
import { Turf } from "@/types";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FavoritesPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }

    const fetchFavorites = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("favorites")
        .select("turf:turfs(*)")
        .eq("user_id", user.id);

      const favTurfs = data?.map((f: { turf: unknown }) => f.turf).filter(Boolean) || [];
      setTurfs(favTurfs as Turf[]);
      setLoading(false);
    };

    fetchFavorites();
  }, [user]);

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-400" />
            Saved Turfs
          </h1>

          {loading ? (
            <TurfGridSkeleton />
          ) : turfs.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="text-5xl mb-4">❤️</div>
              <p className="text-white/60 mb-2">No saved turfs yet</p>
              <p className="text-white/40 text-sm mb-6">Tap the heart on any turf to save it</p>
              <Link href="/turfs">
                <Button>Explore Turfs</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {turfs.map((turf, i) => (
                <TurfCard key={turf.id} turf={turf} index={i} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
