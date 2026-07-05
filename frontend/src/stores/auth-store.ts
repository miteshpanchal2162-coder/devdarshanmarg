"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { tokenStorageKeys } from "@/constants/env";

export type UserRole = "ADMIN" | "USER";

export type AuthUser = {
  id: string;
  email?: string | null;
  mobile?: string | null;
  role: UserRole;
  fullName?: string | null;
};

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  currentRole: UserRole;
  setSession: (input: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  }) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      currentRole: "ADMIN",
      setSession: ({ accessToken, refreshToken, user }) => {
        if (typeof window !== "undefined") {
          localStorage.setItem(tokenStorageKeys.accessToken, accessToken);
          localStorage.setItem(tokenStorageKeys.refreshToken, refreshToken);
        }
        set({
          accessToken,
          refreshToken,
          user,
          currentRole: user.role,
        });
      },
      setTokens: (accessToken, refreshToken) => {
        if (typeof window !== "undefined") {
          localStorage.setItem(tokenStorageKeys.accessToken, accessToken);
          localStorage.setItem(tokenStorageKeys.refreshToken, refreshToken);
        }
        set({ accessToken, refreshToken });
      },
      clearSession: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem(tokenStorageKeys.accessToken);
          localStorage.removeItem(tokenStorageKeys.refreshToken);
        }
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          currentRole: "ADMIN",
        });
      },
    }),
    {
      name: "ddm-auth-store",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        currentRole: state.currentRole,
      }),
    },
  ),
);

export function getStoredAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(tokenStorageKeys.accessToken);
}

export function getStoredRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(tokenStorageKeys.refreshToken);
}
