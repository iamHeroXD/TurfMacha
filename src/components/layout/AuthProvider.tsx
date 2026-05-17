"use client";

import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "@/hooks/useLocation";

// AuthProvider initializes auth state and geolocation on the client.
// Rendered inside <body> — hooks run client-side only.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  useAuth();
  useLocation();
  return <>{children}</>;
}
