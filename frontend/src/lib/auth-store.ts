'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from './api';

type AuthState = {
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  hasHydrated: boolean;
  setSession: (session: { user: User; accessToken: string; refreshToken: string }) => void;
  setHasHydrated: (value: boolean) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      setSession: (session) => set(session),
      setHasHydrated: (value) => set({ hasHydrated: value }),
      clear: () => set({ user: undefined, accessToken: undefined, refreshToken: undefined })
    }),
    {
      name: 'lifeos-auth',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
