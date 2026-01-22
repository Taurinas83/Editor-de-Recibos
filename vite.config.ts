
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Define base como relativo para funcionar em qualquer subpasta do GitHub Pages
  build: {
    outDir: 'dist',
  },
});
