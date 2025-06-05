import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/', // Nom du repo GitHub
  plugins: [react()],
  server: {
    host: 'arte', // Assure que localhost est bien pris en charge
    port: 5173, // Vérifie que le port correspond bien
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // ✅ Corrige l'alias en utilisant `path.resolve`
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'), // ✅ Corrige la gestion du `index.html`
    },
  },
});
