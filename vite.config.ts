import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import demoSource from './vite-plugin-demo-source'

// https://vite.dev/config/
export default defineConfig({
  plugins: [demoSource(), react()],
})
