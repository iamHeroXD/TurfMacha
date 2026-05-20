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
  { label: string; emoji: string; color: string; selectedBg: string; selectedText: string }
> = {
  football:   { label: "Football",   emoji: "⚽", color: "emerald", selectedBg: "#0D4D36", selectedText: "#F4F1EB" },
  cricket:    { label: "Cricket",    emoji: "🏏", color: "blue",    selectedBg: "#1D4ED8", selectedText: "#FFFFFF" },
  badminton:  { label: "Badminton",  emoji: "🏸", color: "yellow",  selectedBg: "#B45309", selectedText: "#FFFFFF" },
  basketball: { label: "Basketball", emoji: "🏀", color: "orange",  selectedBg: "#C2410C", selectedText: "#FFFFFF" },
  volleyball: { label: "Volleyball", emoji: "🏐", color: "purple",  selectedBg: "#7C3AED", selectedText: "#FFFFFF" },
  tennis:     { label: "Tennis",     emoji: "🎾", color: "lime",    selectedBg: "#166534", selectedText: "#FFFFFF" },
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
  if (!name?.trim()) return "?";
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
