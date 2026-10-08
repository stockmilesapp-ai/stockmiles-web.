import { create } from "zustand";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

type AuthState = {
  user: AuthUser | null;
  notice: string | null;
  signInWithGoogle: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  notice: null,
  // Placeholder until the Google Identity Services flow and POST /auth/google
  // are wired in.
  signInWithGoogle: () => set({ notice: "Google sign-in is coming soon." }),
}));
