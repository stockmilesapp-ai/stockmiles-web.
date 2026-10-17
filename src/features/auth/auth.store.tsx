import { create } from "zustand";
import { forgetGoogleSelection } from "@/features/auth/googleIdentity";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

// "loading" until the first /auth/me answer arrives, so the page does not
// flash the sign-in button at someone who is already signed in.
export type AuthStatus = "loading" | "signedOut" | "signedIn";

type AuthState = {
  status: AuthStatus;
  user: AuthUser | null;
  // True while a sign-out request is in flight; the app covers the page.
  signingOut: boolean;
  error: string | null;
  loadCurrentUser: () => Promise<void>;
  failSignIn: () => void;
  signOut: () => Promise<void>;
};

// The /auth/me request in progress, shared by every caller. React StrictMode
// runs effects twice in development, so without this a page load asks twice.
// A call made after the answer arrives asks again, so the state can be
// refreshed on purpose.
let currentUserRequest: Promise<void> | null = null;

export const useAuthStore = create<AuthState>((set) => ({
  status: "loading",
  user: null,
  signingOut: false,
  error: null,

  loadCurrentUser: () => {
    currentUserRequest ??= (async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          set({ status: "signedIn", user: await response.json() });
          return;
        }
      } catch {
        // Network failure: treat as signed out; signing in will surface it.
      }
      set({ status: "signedOut", user: null });
    })().finally(() => {
      currentUserRequest = null;
    });
    return currentUserRequest;
  },

  failSignIn: () => set({ error: "Sign-in did not work. Please try again." }),

  signOut: async () => {
    set({ signingOut: true });
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Even if the request fails, drop the local state below.
    }
    forgetGoogleSelection();
    set({ status: "signedOut", user: null, signingOut: false, error: null });
  },
}));
