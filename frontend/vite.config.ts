
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      !isProduction && componentTagger() // Plugin only runs in development
    ].filter(Boolean),
    
    // ✅ Base path for both development and production
    // base: "/intern/",

    base: isProduction ? '/' : '/',
        // base: process.env.VITE_BASE_PATH || (isProduction  ? '/intern/' : '/'),


    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

