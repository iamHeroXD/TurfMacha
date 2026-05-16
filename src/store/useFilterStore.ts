import { create } from "zustand";
import { Sport, FilterState } from "@/types";

interface FilterStore extends FilterState {
  setSport: (sport: Sport | undefined) => void;
  setMaxDistance: (distance: number | undefined) => void;
  setMaxPrice: (price: number | undefined) => void;
  setMinRating: (rating: number | undefined) => void;
  setSearchQuery: (query: string | undefined) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  sport: undefined,
  maxDistance: undefined,
  maxPrice: undefined,
  minRating: undefined,
  searchQuery: undefined,
  setSport: (sport) => set({ sport }),
  setMaxDistance: (maxDistance) => set({ maxDistance }),
  setMaxPrice: (maxPrice) => set({ maxPrice }),
  setMinRating: (minRating) => set({ minRating }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  resetFilters: () =>
    set({
      sport: undefined,
      maxDistance: undefined,
      maxPrice: undefined,
      minRating: undefined,
      searchQuery: undefined,
    }),
}));
