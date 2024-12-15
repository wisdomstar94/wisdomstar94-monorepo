import { getViteFrontendConfig } from "@wisdomstar94/vite-config-library";
import react from "@vitejs/plugin-react";

const PACKAGE_ROOT = __dirname;

const config = getViteFrontendConfig({
  root: PACKAGE_ROOT,
  build: {
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "next",
        "tailwindcss",
        "next/server",
        "next/navigation",
        "jose",
        "set-cookie-parser",
      ],
    },
  },
  plugins: [react()],
});

export default config;
