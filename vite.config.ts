
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // Changed from "@vitejs/plugin-react-swc"
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      // Adding these options to help with Windows-specific service issues
      clientPort: 8080,
      overlay: false
    }
  },
  plugins: [
    react(), // Using standard React plugin instead of SWC
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    // Ensure we're not using SWC for any JSX transformations
    jsx: "automatic",
  },
}));
