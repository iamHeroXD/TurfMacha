"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, MapPin, Clock, IndianRupee, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { turfSchema, TurfInput } from "@/lib/validations/turf";
import { SPORTS_CONFIG, AMENITIES_LIST } from "@/lib/utils";
import { Sport, Turf } from "@/types";
import { toast } from "@/hooks/useToast";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditTurfPage() {
  const { user } = useAuthStore();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [turf, setTurf] = useState<Turf | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSports, setSelectedSports] = useState<Sport[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([""]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TurfInput>({
    resolver: zodResolver(turfSchema),
  });

  useEffect(() => {
    const fetchTurf = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("turfs").select("*").eq("id", id).single();
      if (data) {
        const t = data as Turf;
        setTurf(t);
        setSelectedSports(t.sports);
        setSelectedAmenities(t.amenities || []);
        setImageUrls(t.images?.length ? t.images : [""]);
        reset({
          name: t.name,
          description: t.description,
          address: t.address,
          city: t.city,
          state: t.state,
          latitude: t.latitude,
          longitude: t.longitude,
          price_per_hour: t.price_per_hour,
          operating_hours_start: t.operating_hours_start,
          operating_hours_end: t.operating_hours_end,
          sports: t.sports,
          amenities: t.amenities || [],
        });
      }
      setLoading(false);
    };
    fetchTurf();
  }, [id, reset]);

  const toggleSport = (sport: Sport) => {
    const next = selectedSports.includes(sport)
      ? selectedSports.filter((s) => s !== sport)
      : [...selectedSports, sport];
    setSelectedSports(next);
    setValue("sports", next as Sport[]);
  };

  const toggleAmenity = (amenity: string) => {
    const next = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((a) => a !== amenity)
      : [...selectedAmenities, amenity];
    setSelectedAmenities(next);
    setValue("amenities", next);
  };

  const onSubmit = async (data: TurfInput) => {
    if (!user || !turf) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from("turfs").update({
        ...data,
        sports: selectedSports,
        amenities: selectedAmenities,
        images: imageUrls.filter(Boolean),
      }).eq("id", id);

      if (error) throw error;
      toast({ title: "Turf updated!", description: "Changes saved successfully." });
      router.push("/dashboard/owner/turfs");
    } catch {
      toast({ title: "Error", description: "Failed to update turf.", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-2xl mx-auto space-y-4 py-8">
          <Skeleton className="h-10 w-48" />
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => router.back()} className="p-2 glass rounded-xl text-white/60 hover:text-white">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Edit Turf</h1>
              <p className="text-white/40 text-sm">{turf?.name}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="glass-card p-6 space-y-4">
              <h2 className="font-semibold text-white">Basic Information</h2>
              <div className="space-y-2">
                <Label>Turf Name *</Label>
                <Input {...register("name")} error={errors.name?.message} />
              </div>
              <div className="space-y-2">
                <Label>Description *</Label>
                <textarea
                  {...register("description")}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                />
              </div>
            </div>

            <div className="glass-card p-6 space-y-4">
              <h2 className="font-semibold text-white">Sports *</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.entries(SPORTS_CONFIG) as [Sport, (typeof SPORTS_CONFIG)[Sport]][]).map(([sport, config]) => (
                  <button key={sport} type="button" onClick={() => toggleSport(sport)}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all flex items-center gap-2 ${
                      selectedSports.includes(sport)
                        ? `bg-gradient-to-r ${config.gradient} text-white border-transparent`
                        : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                    }`}>
                    {config.emoji} {config.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 space-y-4">
              <h2 className="font-semibold text-white">Location</h2>
              <Input placeholder="Address" {...register("address")} error={errors.address?.message} />
              <div className="grid grid-cols-2 gap-4">
                <div><Label>City</Label><Input {...register("city")} className="mt-1" /></div>
                <div><Label>State</Label><Input {...register("state")} className="mt-1" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Latitude</Label><Input type="number" step="any" {...register("latitude", { valueAsNumber: true })} className="mt-1" /></div>
                <div><Label>Longitude</Label><Input type="number" step="any" {...register("longitude", { valueAsNumber: true })} className="mt-1" /></div>
              </div>
            </div>

            <div className="glass-card p-6 space-y-4">
              <h2 className="font-semibold text-white">Pricing & Hours</h2>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input type="number" className="pl-9" {...register("price_per_hour", { valueAsNumber: true })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Open</Label><Input type="time" {...register("operating_hours_start")} className="mt-1" /></div>
                <div><Label>Close</Label><Input type="time" {...register("operating_hours_end")} className="mt-1" /></div>
              </div>
            </div>

            <div className="glass-card p-6 space-y-4">
              <h2 className="font-semibold text-white">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AMENITIES_LIST.map((amenity) => (
                  <button key={amenity} type="button" onClick={() => toggleAmenity(amenity)}
                    className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      selectedAmenities.includes(amenity)
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                        : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                    }`}>
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 space-y-4">
              <h2 className="font-semibold text-white">Images</h2>
              {imageUrls.map((url, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={url} onChange={(e) => {
                    const next = [...imageUrls]; next[i] = e.target.value; setImageUrls(next);
                  }} placeholder="Image URL" />
                  {i > 0 && (
                    <button type="button" onClick={() => setImageUrls(imageUrls.filter((_, j) => j !== i))}
                      className="p-2 text-white/40 hover:text-red-400">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => setImageUrls([...imageUrls, ""])} className="gap-1">
                <Plus className="h-4 w-4" /> Add Image
              </Button>
            </div>

            <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
              Save Changes
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
