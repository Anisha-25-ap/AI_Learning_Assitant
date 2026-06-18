import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,      // Port ko 5173 se badal kar 3000 kiya
    strictPort: true, // Isse Vite isi port par chalne ke liye majboor ho jayega
    host: true
  }
})