import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        silenceDeprecations: ['legacy-js-api'],
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['antd'],
          'form-vendor':   ['react-hook-form', 'zod', '@hookform/resolvers'],
          'utils-vendor':  ['date-fns', 'axios']
        }
      }
    }
  }
})
