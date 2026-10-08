import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// The browser only ever calls /api on its own origin; the dev server forwards
// those calls to the deployed API. Set API_PROXY_TARGET to use another API,
// for example http://localhost:8000.
const apiTarget =
  process.env.API_PROXY_TARGET ?? "https://stockmiles-api.vercel.app";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: apiTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
