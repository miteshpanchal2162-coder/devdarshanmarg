import { create } from "zustand";

export type UserRole = "ADMIN" | "USER";

type AuthState = {
  currentRole: UserRole;
};

/** Placeholder auth state for UI-only permission wiring. */
export const useAuthStore = create<AuthState>(() => ({
  currentRole: "ADMIN",
}));
