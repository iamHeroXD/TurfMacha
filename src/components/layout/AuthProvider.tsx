"use client";

import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "@/hooks/useLocation";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useAuth();
  useLocation();
  return <>{children}</>;
}
