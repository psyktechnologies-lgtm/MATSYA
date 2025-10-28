import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    // Inline these deps so Vite transforms their CSS/imports for the test environment
    server: {
      deps: {
        inline: ['@mui/x-data-grid', '@mui/material', '@mui/icons-material', 'whatwg-url'],
      },
    },
  },
})
