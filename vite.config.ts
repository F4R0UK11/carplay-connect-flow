import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { componentTagger } from "lovable-tagger";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }: { mode: string }) => ({
  base: "",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: mode !== "production" ? true : false,
    rollupOptions: {
      output: {
        entryFileNames: "theme-app.js",
        chunkFileNames: "theme-app-[name].js",
        assetFileNames: (assetInfo: { name?: string }) => {
          const name = assetInfo.name ?? "asset";
          const extMatch = name.match(/\.[^.]+$/);
          const ext = extMatch ? extMatch[0] : "";
          if (ext === ".css") {
            return "theme-app.css";
          }
          const baseName = ext ? name.replace(ext, "") : name;
          return `theme-${baseName}${ext}`;
        },
      },
    },
  },
}));
