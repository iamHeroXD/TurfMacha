export type Sport =
  | "football"
  | "cricket"
  | "badminton"
  | "basketball"
  | "volleyball"
  | "tennis";

export type UserRole = "user" | "owner" | "admin";

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  role: UserRole;
  created_at: string;
}

export interface OwnerProfile {
  id: string;
  user_id: string;
  business_name: string;
  phone: string;
  address: string;
  verified: boolean;
  created_at: string;
}

export interface Turf {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  sports: Sport[];
  price_per_hour: number;
  amenities: string[];
  images: string[];
  operating_hours_start: string;
  operating_hours_end: string;
  is_active: boolean;
  rating: number;
  total_reviews: number;
  created_at: string;
  owner?: OwnerProfile;
  distance?: number;
}

export interface TimeSlot {
  id: string;
  turf_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  price_override?: number;
}

export interface Booking {
  id: string;
  user_id: string;
  turf_id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  duration_hours: number;
  total_price: number;
  status: BookingStatus;
  sport: Sport;
  notes?: string;
  created_at: string;
  turf?: Turf;
  user?: User;
}

export interface Review {
  id: string;
  user_id: string;
  turf_id: string;
  booking_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user?: User;
}

export interface Favorite {
  id: string;
  user_id: string;
  turf_id: string;
  created_at: string;
  turf?: Turf;
}

export interface FilterState {
  sport?: Sport;
  maxDistance?: number;
  maxPrice?: number;
  minRating?: number;
  searchQuery?: string;
}

export interface LocationState {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
}
