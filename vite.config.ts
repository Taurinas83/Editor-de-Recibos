
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANTE: O nome aqui deve ser EXATAMENTE igual ao nome do seu repositório no GitHub
  base: '/Editor-de-Recibos/', 
  build: {
    outDir: 'dist',
  },
});
