import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  define: {
    'process.env': {}
  },
  server: {
    port: 5173,        // always use this port — kill whatever is using it
    strictPort: false, // if 5173 is busy, bump gracefully (CORS now handles all ports)
    proxy: {
      // All /api calls from localhost:517x are proxied to the backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
