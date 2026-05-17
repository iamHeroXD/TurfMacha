import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Sport } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export function generateTimeSlots(
  start: string,
  end: string,
  duration: number = 60
): string[] {
  const slots: string[] = [];
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  let currentMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  while (currentMinutes + duration <= endMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const mins = currentMinutes % 60;
    slots.push(`${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`);
    currentMinutes += duration;
  }

  return slots;
}

export const SPORTS_CONFIG: Record<
  Sport,
  { label: string; emoji: string; color: string; gradient: string }
> = {
  football: {
    label: "Football",
    emoji: "⚽",
    color: "emerald",
    gradient: "from-brand-400 to-green-600",
  },
  cricket: {
    label: "Cricket",
    emoji: "🏏",
    color: "blue",
    gradient: "from-blue-500 to-cyan-600",
  },
  badminton: {
    label: "Badminton",
    emoji: "🏸",
    color: "yellow",
    gradient: "from-yellow-500 to-orange-500",
  },
  basketball: {
    label: "Basketball",
    emoji: "🏀",
    color: "orange",
    gradient: "from-orange-500 to-red-500",
  },
  volleyball: {
    label: "Volleyball",
    emoji: "🏐",
    color: "purple",
    gradient: "from-purple-500 to-pink-500",
  },
  tennis: {
    label: "Tennis",
    emoji: "🎾",
    color: "lime",
    gradient: "from-lime-500 to-green-500",
  },
};

export const AMENITIES_LIST = [
  "Parking",
  "Changing Rooms",
  "Showers",
  "Floodlights",
  "Drinking Water",
  "First Aid",
  "Cafeteria",
  "Equipment Rental",
  "Wifi",
  "CCTV",
  "Washrooms",
  "Seating Area",
];

export function getBookingStatusStyle(status: string): string {
  switch (status) {
    case "confirmed":
      return "status-confirmed";
    case "pending":
      return "status-pending";
    case "cancelled":
      return "status-cancelled";
    default:
      return "status-pending";
  }
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + "..." : str;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
