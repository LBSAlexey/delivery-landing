import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/delivery-landing/', // Для GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})