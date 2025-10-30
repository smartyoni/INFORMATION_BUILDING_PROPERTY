import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/INFORMATION_BUILDING_PROPERTY/',
  server: {
    port: 5173,
    open: true
  }
})
