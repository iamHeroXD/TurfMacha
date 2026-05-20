"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Clock, IndianRupee, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { turfSchema, TurfInput } from "@/lib/validations/turf";
import { SPORTS_CONFIG, AMENITIES_LIST } from "@/lib/utils";
import { Sport, Turf } from "@/types";
import { toast } from "@/hooks/useToast";

const inputCls = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#A3E635] focus:border-transparent transition-shadow";
const cardCls  = "bg-white rounded-2xl border-2 border-gray-100 p-6 space-y-4";

export default function EditTurfPage() {
  const { user }   = useAuthStore();
  const params     = useParams();
  const router     = useRouter();
  const id         = params.id as string;

  const [turf,              setTurf]              = useState<Turf | null>(null);
  const [loading,           setLoading]           = useState(true);
  const [selectedSports,    setSelectedSports]    = useState<Sport[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [imageUrls,         setImageUrls]         = useState<string[]>([""]);

  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<TurfInput>({
    resolver: zodResolver(turfSchema),
  });

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.from("turfs").select("*").eq("id", id).single();
      if (data) {
        const t = data as Turf;
        setTurf(t);
        setSelectedSports(t.sports);
        setSelectedAmenities(t.amenities || []);
        setImageUrls(t.images?.length ? t.images : [""]);
        reset({
          name: t.name, description: t.description, address: t.address,
          city: t.city, state: t.state, latitude: t.latitude, longitude: t.longitude,
          price_per_hour: t.price_per_hour,
          operating_hours_start: t.operating_hours_start,
          operating_hours_end:   t.operating_hours_end,
          sports: t.sports, amenities: t.amenities || [],
        });
      }
      setLoading(false);
    })();
  }, [id, reset]);

  const toggleSport   = (sport: Sport) => {
    const next = selectedSports.includes(sport)
      ? selectedSports.filter((s) => s !== sport)
      : [...selectedSports, sport];
    setSelectedSports(next); setValue("sports", next);
  };
  const toggleAmenity = (a: string) => {
    const next = selectedAmenities.includes(a)
      ? selectedAmenities.filter((x) => x !== a)
      : [...selectedAmenities, a];
    setSelectedAmenities(next); setValue("amenities", next);
  };

  const onSubmit = async (data: TurfInput) => {
    if (!user || !turf) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from("turfs").update({
        ...data,
        sports: selectedSports, amenities: selectedAmenities,
        images: imageUrls.filter(Boolean),
      }).eq("id", id);
      if (error) throw error;
      toast({ title: "Turf updated!", description: "Changes saved." });
      router.push("/dashboard/owner/turfs");
    } catch {
      toast({ title: "Error", description: "Failed to update turf.", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] pt-14 px-4">
        <div className="max-w-2xl mx-auto space-y-4 py-8">
          <div className="h-10 w-48 skeleton rounded-xl" />
          {[...Array(4)].map((_, i) => <div key={i} className="h-40 rounded-2xl skeleton" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0] pt-14 pb-24 md:pb-8">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-5 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl border border-gray-200 text-[#6B7280] hover:text-[#1F2937] transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-display font-bold text-2xl text-[#0B3D2E]">Edit Turf</h1>
            <p className="text-[#9CA3AF] text-sm">{turf?.name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <div className={cardCls}>
              <h2 className="font-display font-bold text-[#1F2937]">Basic Information</h2>
              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Turf Name *</label>
                <input {...register("name")} className={inputCls} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Description *</label>
                <textarea {...register("description")} rows={3} className={`${inputCls} resize-none`} />
              </div>
            </div>

            <div className={cardCls}>
              <h2 className="font-display font-bold text-[#1F2937]">Sports *</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.entries(SPORTS_CONFIG) as [Sport, (typeof SPORTS_CONFIG)[Sport]][]).map(([sport, cfg]) => {
                  const sel = selectedSports.includes(sport);
                  return (
                    <button
                      key={sport} type="button" onClick={() => toggleSport(sport)}
                      style={sel ? { backgroundColor: cfg.selectedBg, color: cfg.selectedText, borderColor: cfg.selectedBg } : {}}
                      className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all flex items-center gap-2 ${
                        sel ? "border-transparent" : "border-gray-200 text-[#6B7280] bg-white hover:border-[#0B3D2E]/20"
                      }`}
                    >
                      {cfg.emoji} {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={cardCls}>
              <h2 className="font-display font-bold text-[#1F2937]">Location</h2>
              <input {...register("address")} placeholder="Address" className={inputCls} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">City</label>
                  <input {...register("city")} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">State</label>
                  <input {...register("state")} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Latitude</label>
                  <input type="number" step="any" {...register("latitude", { valueAsNumber: true })} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Longitude</label>
                  <input type="number" step="any" {...register("longitude", { valueAsNumber: true })} className={inputCls} />
                </div>
              </div>
            </div>

            <div className={cardCls}>
              <h2 className="font-display font-bold text-[#1F2937]">Pricing &amp; Hours</h2>
              <div className="relative">
                <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                <input type="number" className={`${inputCls} pl-9`} {...register("price_per_hour", { valueAsNumber: true })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">
                    <Clock className="inline h-3.5 w-3.5 mr-1" />Open
                  </label>
                  <input type="time" {...register("operating_hours_start")} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">
                    <Clock className="inline h-3.5 w-3.5 mr-1" />Close
                  </label>
                  <input type="time" {...register("operating_hours_end")} className={inputCls} />
                </div>
              </div>
            </div>

            <div className={cardCls}>
              <h2 className="font-display font-bold text-[#1F2937]">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AMENITIES_LIST.map((a) => {
                  const sel = selectedAmenities.includes(a);
                  return (
                    <button key={a} type="button" onClick={() => toggleAmenity(a)}
                      className={`p-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${
                        sel
                          ? "bg-[#0B3D2E]/8 border-[#0B3D2E]/25 text-[#0B3D2E]"
                          : "border-gray-200 text-[#6B7280] bg-white hover:border-[#0B3D2E]/20"
                      }`}
                    >
                      {a}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={cardCls}>
              <h2 className="font-display font-bold text-[#1F2937]">Images</h2>
              {imageUrls.map((url, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={url}
                    onChange={(e) => { const n = [...imageUrls]; n[i] = e.target.value; setImageUrls(n); }}
                    placeholder="Image URL"
                    className={inputCls}
                  />
                  {i > 0 && (
                    <button type="button" onClick={() => setImageUrls(imageUrls.filter((_, j) => j !== i))}
                      className="p-2 text-[#9CA3AF] hover:text-red-500">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm"
                onClick={() => setImageUrls([...imageUrls, ""])} className="gap-1 rounded-xl border-gray-200">
                <Plus className="h-4 w-4" /> Add Image
              </Button>
            </div>

            <Button type="submit" className="w-full rounded-xl" size="lg" loading={isSubmitting}>
              Save Changes
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
