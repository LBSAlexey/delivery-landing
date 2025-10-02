// frontend/vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  
  // Базовый путь для GitHub Pages
  // Замените 'delivery-landing' на название вашего репозитория
  base: process.env.NODE_ENV === 'production' 
    ? '/delivery-landing/' 
    : '/',
  
  // Настройки сборки
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Удаляем console.log в продакшене
      },
    },
  },
  
  // Dev сервер
  server: {
    port: 5173,
    open: true, // Автоматически открывать браузер
    cors: true,
  },
  
  // Алиасы путей
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@assets': '/src/assets',
      '@utils': '/src/utils',
    },
  },
})
