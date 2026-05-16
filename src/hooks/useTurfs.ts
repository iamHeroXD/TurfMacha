"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Turf, Sport } from "@/types";
import { calculateDistance } from "@/lib/utils";

interface UseTurfsOptions {
  sport?: Sport;
  userLat?: number | null;
  userLon?: number | null;
  searchQuery?: string;
  limit?: number;
}

export function useTurfs(options: UseTurfsOptions = {}) {
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTurfs = useCallback(async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      let query = supabase
        .from("turfs")
        .select("*")
        .eq("is_active", true)
        .order("rating", { ascending: false });

      if (options.sport) {
        query = query.contains("sports", [options.sport]);
      }

      if (options.searchQuery) {
        query = query.or(
          `name.ilike.%${options.searchQuery}%,city.ilike.%${options.searchQuery}%,address.ilike.%${options.searchQuery}%`
        );
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      let results = (data as Turf[]) || [];

      if (options.userLat && options.userLon) {
        results = results
          .map((turf) => ({
            ...turf,
            distance: calculateDistance(
              options.userLat!,
              options.userLon!,
              turf.latitude,
              turf.longitude
            ),
          }))
          .sort((a, b) => (a.distance || 0) - (b.distance || 0));
      }

      setTurfs(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch turfs");
    } finally {
      setLoading(false);
    }
  }, [options.sport, options.userLat, options.userLon, options.searchQuery, options.limit]);

  useEffect(() => {
    fetchTurfs();
  }, [fetchTurfs]);

  return { turfs, loading, error, refetch: fetchTurfs };
}

export function useTurf(id: string) {
  const [turf, setTurf] = useState<Turf | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTurf = async () => {
      try {
        setLoading(true);
        const supabase = createClient();

        const { data, error } = await supabase
          .from("turfs")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setTurf(data as Turf);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch turf");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTurf();
  }, [id]);

  return { turf, loading, error };
}
