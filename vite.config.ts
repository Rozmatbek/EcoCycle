import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        register: resolve(__dirname, 'register.html'),
        landing: resolve(__dirname, 'landing.html')
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
});

