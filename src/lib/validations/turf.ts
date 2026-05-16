import { z } from "zod";

export const turfSchema = z.object({
  name: z.string().min(2, "Turf name is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  sports: z.array(z.enum(["football", "cricket", "badminton", "basketball", "volleyball", "tennis"])).min(1, "Select at least one sport"),
  price_per_hour: z.number().min(100, "Minimum price is ₹100"),
  amenities: z.array(z.string()),
  operating_hours_start: z.string(),
  operating_hours_end: z.string(),
});

export const bookingSchema = z.object({
  turf_id: z.string().uuid(),
  slot_date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  sport: z.enum(["football", "cricket", "badminton", "basketball", "volleyball", "tennis"]),
  notes: z.string().optional(),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Review must be at least 10 characters"),
});

export type TurfInput = z.infer<typeof turfSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
