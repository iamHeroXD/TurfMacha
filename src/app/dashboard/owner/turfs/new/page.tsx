"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Clock, IndianRupee, ChevronLeft, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { turfSchema, TurfInput } from "@/lib/validations/turf";
import { SPORTS_CONFIG, AMENITIES_LIST } from "@/lib/utils";
import { Sport } from "@/types";
import { toast } from "@/hooks/useToast";

const inputCls = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#A3E635] focus:border-transparent transition-shadow";
const cardCls  = "bg-white rounded-2xl border-2 border-gray-100 p-6 space-y-4";

export default function NewTurfPage() {
  const { user }  = useAuthStore();
  const router    = useRouter();
  const [selectedSports,    setSelectedSports]    = useState<Sport[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [imageUrls,         setImageUrls]         = useState<string[]>([""]);
  const [geoLoading,        setGeoLoading]        = useState(false);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<TurfInput>({
    resolver: zodResolver(turfSchema),
    defaultValues: {
      sports: [], amenities: [],
      operating_hours_start: "06:00", operating_hours_end: "22:00",
      price_per_hour: 500, latitude: 8.5241, longitude: 76.9366, // Trivandrum default
    },
  });

  const toggleSport = (sport: Sport) => {
    const next = selectedSports.includes(sport)
      ? selectedSports.filter((s) => s !== sport)
      : [...selectedSports, sport];
    setSelectedSports(next);
    setValue("sports", next);
  };

  const toggleAmenity = (a: string) => {
    const next = selectedAmenities.includes(a)
      ? selectedAmenities.filter((x) => x !== a)
      : [...selectedAmenities, a];
    setSelectedAmenities(next);
    setValue("amenities", next);
  };

  const detectLocation = () => {
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setValue("latitude",  pos.coords.latitude);
        setValue("longitude", pos.coords.longitude);
        setGeoLoading(false);
        toast({ title: "Location detected!" });
      },
      () => {
        setGeoLoading(false);
        toast({ title: "Location error", description: "Could not detect location.", variant: "destructive" });
      }
    );
  };

  const onSubmit = async (data: TurfInput) => {
    if (!user) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from("turfs").insert({
        ...data,
        owner_id: user.id,
        sports: selectedSports,
        amenities: selectedAmenities,
        images: imageUrls.filter(Boolean),
        is_active: true,
        rating: 0,
        total_reviews: 0,
      });
      if (error) throw error;
      toast({ title: "Turf listed!", description: "Your turf is now live on TurfMacha." });
      router.push("/dashboard/owner/turfs");
    } catch {
      toast({ title: "Error", description: "Failed to add turf.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] pt-14 pb-24 md:pb-8">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-5 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl border border-gray-200 text-[#6B7280] hover:text-[#1F2937] hover:border-gray-300 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-display font-bold text-2xl text-[#0B3D2E]">Add New Turf</h1>
            <p className="text-[#9CA3AF] text-sm">List your sports venue</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Basic Info */}
            <div className={cardCls}>
              <h2 className="font-display font-bold text-[#1F2937]">Basic Information</h2>
              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Turf Name *</label>
                <input {...register("name")} placeholder="e.g., Green Arena Football Ground" className={inputCls} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Description *</label>
                <textarea
                  {...register("description")}
                  placeholder="Describe your turf, facilities, and what makes it special..."
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
              </div>
            </div>

            {/* Sports */}
            <div className={cardCls}>
              <h2 className="font-display font-bold text-[#1F2937]">Sports Available *</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.entries(SPORTS_CONFIG) as [Sport, (typeof SPORTS_CONFIG)[Sport]][]).map(([sport, cfg]) => {
                  const sel = selectedSports.includes(sport);
                  return (
                    <button
                      key={sport}
                      type="button"
                      onClick={() => toggleSport(sport)}
                      style={sel ? { backgroundColor: cfg.selectedBg, color: cfg.selectedText, borderColor: cfg.selectedBg } : {}}
                      className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all flex items-center gap-2 ${
                        sel ? "border-transparent" : "border-gray-200 text-[#6B7280] hover:border-[#0B3D2E]/20 bg-white"
                      }`}
                    >
                      {cfg.emoji} {cfg.label}
                    </button>
                  );
                })}
              </div>
              {errors.sports && <p className="text-xs text-red-500">{errors.sports.message as string}</p>}
            </div>

            {/* Location */}
            <div className={cardCls}>
              <h2 className="font-display font-bold text-[#1F2937]">Location</h2>
              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Address *</label>
                <input {...register("address")} placeholder="Full street address" className={inputCls} />
                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">City *</label>
                  <input {...register("city")} placeholder="Trivandrum" className={inputCls} />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">State *</label>
                  <input {...register("state")} placeholder="Kerala" className={inputCls} />
                  {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>}
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
              <Button type="button" variant="outline" size="sm" onClick={detectLocation} loading={geoLoading} className="gap-2 rounded-xl border-gray-200">
                <MapPin className="h-4 w-4" /> Auto-detect Location
              </Button>
            </div>

            {/* Pricing & Hours */}
            <div className={cardCls}>
              <h2 className="font-display font-bold text-[#1F2937]">Pricing &amp; Hours</h2>
              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Price per Hour (₹) *</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                  <input type="number" className={`${inputCls} pl-9`} placeholder="500"
                    {...register("price_per_hour", { valueAsNumber: true })} />
                </div>
                {errors.price_per_hour && <p className="text-xs text-red-500 mt-1">{errors.price_per_hour.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Opening Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                    <input type="time" className={`${inputCls} pl-9`} {...register("operating_hours_start")} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Closing Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                    <input type="time" className={`${inputCls} pl-9`} {...register("operating_hours_end")} />
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className={cardCls}>
              <h2 className="font-display font-bold text-[#1F2937]">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AMENITIES_LIST.map((a) => {
                  const sel = selectedAmenities.includes(a);
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleAmenity(a)}
                      className={`p-2.5 rounded-xl border-2 text-xs font-semibold transition-all text-left ${
                        sel
                          ? "bg-[#0B3D2E]/8 border-[#0B3D2E]/25 text-[#0B3D2E]"
                          : "border-gray-200 text-[#6B7280] hover:border-[#0B3D2E]/20 bg-white"
                      }`}
                    >
                      {a}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Images */}
            <div className={cardCls}>
              <h2 className="font-display font-bold text-[#1F2937]">Turf Images (URLs)</h2>
              <p className="text-xs text-[#9CA3AF]">Add direct image URLs for your turf gallery</p>
              {imageUrls.map((url, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={url}
                    onChange={(e) => {
                      const next = [...imageUrls]; next[i] = e.target.value; setImageUrls(next);
                    }}
                    placeholder="https://example.com/turf-image.jpg"
                    className={inputCls}
                  />
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => setImageUrls(imageUrls.filter((_, j) => j !== i))}
                      className="p-2 text-[#9CA3AF] hover:text-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <Button
                type="button" variant="outline" size="sm"
                onClick={() => setImageUrls([...imageUrls, ""])}
                className="gap-2 rounded-xl border-gray-200"
              >
                <Plus className="h-4 w-4" /> Add Image
              </Button>
            </div>

            <Button type="submit" className="w-full rounded-xl" size="lg" loading={isSubmitting}>
              Publish Turf
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
