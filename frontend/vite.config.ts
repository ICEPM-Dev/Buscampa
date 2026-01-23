/**
 * Configuración de Vite para el frontend.
 * Incluye plugins para React y Tailwind CSS.
 */
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()], // Plugins para React y Tailwind
});
