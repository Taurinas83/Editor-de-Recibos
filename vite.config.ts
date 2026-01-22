
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Editor-de-Recibos/', // Caminho exato do repositório no GitHub
  build: {
    outDir: 'dist',
  },
});
