import { create } from "zustand";

export type CodeValue = {
  id: string;
  tenantId: string | null;
  key: string;
  label: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Code = {
  id: string;
  key: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  codeValues: CodeValue[];
};

export type CodesStatus = "idle" | "loading" | "loaded" | "error";

export type AdminState = {
  metadata: {
    codes: Code[];
    status: CodesStatus;
  };
  loadAllCodes: () => Promise<void>;
};

// The request in progress, shared by every caller. React StrictMode runs
// effects twice in development, so without this the page asks twice.
let codesRequest: Promise<void> | null = null;

export const useAdminStore = create<AdminState>((set, get) => ({
  metadata: {
    codes: [],
    status: "idle",
  },
  loadAllCodes: () => {
    if (get().metadata.status === "loaded") return Promise.resolve();
    codesRequest ??= (async () => {
      set({ metadata: { ...get().metadata, status: "loading" } });
      try {
        const response = await fetch("/api/codes");
        if (response.ok) {
          set({ metadata: { codes: await response.json(), status: "loaded" } });
          return;
        }
      } catch {
        // Network failure: fall through to the error state.
      }
      set({ metadata: { codes: [], status: "error" } });
    })().finally(() => {
      codesRequest = null;
    });
    return codesRequest;
  },
}));
