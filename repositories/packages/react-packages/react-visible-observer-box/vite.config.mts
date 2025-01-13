import { getViteFrontendConfig } from '@wisdomstar94/vite-config-library';
import react from '@vitejs/plugin-react';

const PACKAGE_ROOT = import.meta.dirname;

const config = getViteFrontendConfig({
  root: PACKAGE_ROOT,
  build: {
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  },
  plugins: [react()],
});

export default config;
