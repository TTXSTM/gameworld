import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      ignored: ['**/reviews.json', '**/comments.json', '**/users.json', '**/storage/**']
    },
    host: true,         // ← разрешает подключение по IP
    port: 5173          // ← можно поменять при желании
  }
})
