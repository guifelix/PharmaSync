import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  // Serve models.json and /models/ from public/
  publicDir: "public",
});
