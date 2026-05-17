"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Clock, IndianRupee, ChevronLeft, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { turfSchema, TurfInput } from "@/lib/validations/turf";
import { SPORTS_CONFIG, AMENITIES_LIST } from "@/lib/utils";
import { Sport } from "@/types";
import { toast } from "@/hooks/useToast";

export default function NewTurfPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [selectedSports, setSelectedSports] = useState<Sport[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [geoLoading, setGeoLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TurfInput>({
    resolver: zodResolver(turfSchema),
    defaultValues: {
      sports: [],
      amenities: [],
      operating_hours_start: "06:00",
      operating_hours_end: "22:00",
      price_per_hour: 500,
      latitude: 12.9716,
      longitude: 77.5946,
    },
  });

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

  const detectLocation = () => {
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setValue("latitude", pos.coords.latitude);
        setValue("longitude", pos.coords.longitude);
        setGeoLoading(false);
        toast({ title: "Location detected!", description: "Coordinates updated." });
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
      toast({ title: "Turf added!", description: "Your turf is now live." });
      router.push("/dashboard/owner/turfs");
    } catch (err) {
      toast({ title: "Error", description: "Failed to add turf.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen pt-14 pb-24 md:pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => router.back()} className="p-2 glass rounded-xl text-white/60 hover:text-white">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Add New Turf</h1>
              <p className="text-white/40 text-sm">List your sports venue</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="glass-card p-6 space-y-4">
              <h2 className="font-semibold text-white">Basic Information</h2>
              <div className="space-y-2">
                <Label>Turf Name *</Label>
                <Input placeholder="e.g., Green Arena Football Ground" {...register("name")} error={errors.name?.message} />
              </div>
              <div className="space-y-2">
                <Label>Description *</Label>
                <textarea
                  {...register("description")}
                  placeholder="Describe your turf, facilities, and what makes it special..."
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-400/50 resize-none"
                />
                {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
              </div>
            </div>

            {/* Sports */}
            <div className="glass-card p-6 space-y-4">
              <h2 className="font-semibold text-white">Sports Available *</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.entries(SPORTS_CONFIG) as [Sport, (typeof SPORTS_CONFIG)[Sport]][]).map(([sport, config]) => (
                  <button
                    key={sport}
                    type="button"
                    onClick={() => toggleSport(sport)}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all flex items-center gap-2 ${
                      selectedSports.includes(sport)
                        ? `bg-gradient-to-r ${config.gradient} text-white border-transparent`
                        : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                    }`}
                  >
                    {config.emoji} {config.label}
                  </button>
                ))}
              </div>
              {errors.sports && <p className="text-xs text-red-400">{errors.sports.message as string}</p>}
            </div>

            {/* Location */}
            <div className="glass-card p-6 space-y-4">
              <h2 className="font-semibold text-white">Location</h2>
              <div className="space-y-2">
                <Label>Address *</Label>
                <Input placeholder="Full street address" {...register("address")} error={errors.address?.message} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City *</Label>
                  <Input placeholder="Bangalore" {...register("city")} error={errors.city?.message} />
                </div>
                <div className="space-y-2">
                  <Label>State *</Label>
                  <Input placeholder="Karnataka" {...register("state")} error={errors.state?.message} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Latitude</Label>
                  <Input type="number" step="any" {...register("latitude", { valueAsNumber: true })} />
                </div>
                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input type="number" step="any" {...register("longitude", { valueAsNumber: true })} />
                </div>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={detectLocation} loading={geoLoading} className="gap-2">
                <MapPin className="h-4 w-4" /> Auto-detect Location
              </Button>
            </div>

            {/* Pricing & Hours */}
            <div className="glass-card p-6 space-y-4">
              <h2 className="font-semibold text-white">Pricing & Hours</h2>
              <div className="space-y-2">
                <Label>Price per Hour (₹) *</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    type="number"
                    className="pl-9"
                    placeholder="500"
                    {...register("price_per_hour", { valueAsNumber: true })}
                    error={errors.price_per_hour?.message}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Opening Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <Input type="time" className="pl-9" {...register("operating_hours_start")} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Closing Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <Input type="time" className="pl-9" {...register("operating_hours_end")} />
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="glass-card p-6 space-y-4">
              <h2 className="font-semibold text-white">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AMENITIES_LIST.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`p-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                      selectedAmenities.includes(amenity)
                        ? "bg-brand-400/20 border-brand-400/40 text-brand-400"
                        : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="glass-card p-6 space-y-4">
              <h2 className="font-semibold text-white">Turf Images (URLs)</h2>
              <p className="text-xs text-white/40">Add image URLs for your turf gallery</p>
              {imageUrls.map((url, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={url}
                    onChange={(e) => {
                      const next = [...imageUrls];
                      next[i] = e.target.value;
                      setImageUrls(next);
                    }}
                    placeholder="https://example.com/turf-image.jpg"
                  />
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => setImageUrls(imageUrls.filter((_, j) => j !== i))}
                      className="p-2 text-white/40 hover:text-red-400 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setImageUrls([...imageUrls, ""])}
                className="gap-2"
              >
                <Plus className="h-4 w-4" /> Add Image
              </Button>
            </div>

            <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
              Publish Turf
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
