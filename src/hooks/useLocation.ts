"use client";

import { useEffect } from "react";
import { useLocationStore } from "@/store/useLocationStore";

export function useLocation() {
  const { latitude, longitude, loading, error, setLocation, setLoading, setError } =
    useLocationStore();

  useEffect(() => {
    if (latitude !== null && longitude !== null) return;
    if (!navigator.geolocation) {
      setError("Geolocation is not supported");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setError(err.message);
        // Default to Bangalore if location denied
        setLocation(12.9716, 77.5946);
      },
      { timeout: 10000, maximumAge: 300000 }
    );
  }, [latitude, longitude, setLocation, setLoading, setError]);

  return { latitude, longitude, loading, error };
}
