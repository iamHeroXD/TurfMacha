import { create } from "zustand";

interface LocationStore {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
  setLocation: (lat: number, lon: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
  latitude: null,
  longitude: null,
  loading: false,
  error: null,
  setLocation: (latitude, longitude) =>
    set({ latitude, longitude, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
}));
