import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthStore {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  emailVerified: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setEmailVerified: (verified: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      initialized: false,
      emailVerified: false,
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      setInitialized: (initialized) => set({ initialized }),
      setEmailVerified: (emailVerified) => set({ emailVerified }),
      logout: () => set({ user: null, emailVerified: false }),
    }),
    {
      name: "turfmacha-auth",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
