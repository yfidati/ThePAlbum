import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/albums': {
        target: 'http://localhost:3000', // Backend server URL
        changeOrigin: true,
      },
    },
  },
});
