import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  // In production (Vercel), VITE_API_URL env var points to EC2 backend.
  // The dev proxy above only applies to `npm run dev`.
})
