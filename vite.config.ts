import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Pure SPA/CSR build — no TanStack Start SSR.
// The app has no server-side data fetching, so CSR works perfectly.
// This fixes the "Invariant failed" hydration error on static hosts (Vercel).
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  build: {
    outDir: "dist/client",
  },
});
