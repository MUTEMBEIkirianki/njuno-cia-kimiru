import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Njuno Cia Kĩmĩrũ",
        short_name: "Njuno",
        theme_color: "#8B5E34",
        background_color: "#F5EFE6",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/icon.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icon.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ]
});