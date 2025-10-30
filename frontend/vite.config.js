import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: ['build-bharat.onrender.com'], // 👈 add your Render domain
    port: 3000,
  },
  preview: {
    allowedHosts: ['build-bharat.onrender.com'], // 👈 also add here for build preview
  },
})
