import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // ✅ ISSO FORÇA O SERVIDOR A ABRIR PARA A REDE (IP)
    port: 5173,
  }
})