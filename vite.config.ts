import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
  },
  optimizeDeps: {
    dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
    include: ['react', 'react-dom', 'lucide-react', 'recharts'],
  },
  server: {
    port: 4000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
