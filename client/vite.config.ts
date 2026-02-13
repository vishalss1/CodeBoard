import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy for the OAuth code exchange (used by AuthCallbackPage)
      // Maps /api/auth/github/callback → localhost:3000/auth/github/callback
      "/api/auth": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/auth": {
        target: "http://localhost:3000",
        changeOrigin: true,
        // Don't proxy the OAuth callback URL — serve React page instead
        bypass(req) {
          if (req.url?.startsWith("/auth/github/callback")) {
            return req.url;
          }
        },
      },
      "/post": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/refresh": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
