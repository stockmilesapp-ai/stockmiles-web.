import { create } from "zustand";

export type HealthStatus = "idle" | "checking" | "ok" | "error";

type StatusState = {
  health: HealthStatus;
  checkHealth: () => Promise<void>;
};

export const useStatusStore = create<StatusState>((set) => ({
  health: "idle",
  checkHealth: async () => {
    set({ health: "checking" });
    try {
      const response = await fetch("/api/health");
      const body: { db?: string } = await response.json();
      set({ health: response.ok && body.db === "ok" ? "ok" : "error" });
    } catch {
      set({ health: "error" });
    }
  },
}));
